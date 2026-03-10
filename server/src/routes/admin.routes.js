import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { HttpError } from "../lib/http-error.js";
import { getPagination } from "../lib/pagination.js";
import { prisma } from "../lib/prisma.js";
import { optionalTrimmedString, optionalUrl, requireTrimmedString } from "../lib/validators.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

const allowedRoles = ["STUDENT", "INSTRUCTOR", "ADMIN"];
const allowedStatuses = ["ACTIVE", "PENDING", "BLOCKED"];
const allowedCourseStatuses = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"];
const allowedOrderStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const allowedBlogStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const allowedLearningPathLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const allowedCouponTypes = ["PERCENTAGE", "FIXED"];
const allowedNotificationTypes = ["SYSTEM", "ENROLLMENT", "COURSE", "PAYMENT", "BLOG", "REVIEW"];

const parseOptionalDate = (value, field) => {
  if (value === undefined) {
    return undefined;
  }
  if (value === null || String(value).trim() === "") {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, `${field} must be a valid date`);
  }
  return date;
};

const parseOptionalNumber = (value, field) => {
  if (value === undefined) {
    return undefined;
  }
  if (value === null || value === "") {
    return null;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    throw new HttpError(400, `${field} must be a number`);
  }
  return num;
};

const parseStringArray = (value, field) => {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new HttpError(400, `${field} must be an array`);
  }
  const cleaned = value.map((item) => String(item || "").trim()).filter(Boolean);
  return cleaned;
};

const parseExpertise = (value) => {
  const cleaned = parseStringArray(value, "Expertise");
  if (cleaned === undefined) {
    return undefined;
  }
  return cleaned.slice(0, 20);
};

const logAdminAction = async (actorId, action, entityType, entityId, meta = null) => {
  await prisma.auditLog.create({
    data: {
      actorId,
      action,
      entityType,
      entityId,
      meta
    }
  });
};

router.use("/admin", requireAuth, requireRole("ADMIN"));

router.get(
  "/admin/dashboard/overview",
  asyncHandler(async (_req, res) => {
    const [users, activeStudents, courses, reviewQueue, paidOrders, revenue, pendingTestimonials] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          role: "STUDENT",
          status: "ACTIVE"
        }
      }),
      prisma.course.count(),
      prisma.course.count({
        where: {
          status: "REVIEW"
        }
      }),
      prisma.order.count({
        where: {
          status: "PAID"
        }
      }),
      prisma.order.aggregate({
        where: {
          status: "PAID"
        },
        _sum: {
          totalAmount: true
        }
      }),
      prisma.testimonial.count({
        where: {
          isApproved: false
        }
      })
    ]);

    res.json({
      data: {
        users,
        activeStudents,
        courses,
        coursesInReview: reviewQueue,
        paidOrders,
        totalRevenue: revenue._sum.totalAmount || 0,
        pendingTestimonials
      }
    });
  })
);

router.get(
  "/admin/users",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const search = String(req.query.search || "").trim();
    const role = String(req.query.role || "").toUpperCase().trim();
    const status = String(req.query.status || "").toUpperCase().trim();

    const andWhere = [];

    if (search) {
      andWhere.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } }
        ]
      });
    }

    if (allowedRoles.includes(role)) {
      andWhere.push({ role });
    }

    if (allowedStatuses.includes(status)) {
      andWhere.push({ status });
    }

    const where = andWhere.length ? { AND: andWhere } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          lastLoginAt: true
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.patch(
  "/admin/users/:id",
  asyncHandler(async (req, res) => {
    const data = {};

    if (req.body.role) {
      const role = String(req.body.role).toUpperCase();

      if (!allowedRoles.includes(role)) {
        throw new HttpError(400, "Invalid role");
      }

      data.role = role;
    }

    if (req.body.status) {
      const status = String(req.body.status).toUpperCase();

      if (!allowedStatuses.includes(status)) {
        throw new HttpError(400, "Invalid user status");
      }

      data.status = status;
    }

    const user = await prisma.user.update({
      where: {
        id: req.params.id
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true
      }
    });

    await logAdminAction(req.auth.userId, "USER_UPDATED", "User", user.id, data);

    res.json({ data: user });
  })
);

router.get(
  "/admin/instructors",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const search = String(req.query.search || "").trim();
    const active = String(req.query.active || "").toLowerCase().trim();
    const featured = String(req.query.featured || "").toLowerCase().trim();

    const andWhere = [];

    if (search) {
      andWhere.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { user: { is: { name: { contains: search, mode: "insensitive" } } } },
          { user: { is: { email: { contains: search, mode: "insensitive" } } } }
        ]
      });
    }

    if (active === "true") {
      andWhere.push({ isActive: true });
    } else if (active === "false") {
      andWhere.push({ isActive: false });
    }

    if (featured === "true") {
      andWhere.push({ isFeatured: true });
    } else if (featured === "false") {
      andWhere.push({ isFeatured: false });
    }

    const where = andWhere.length ? { AND: andWhere } : {};

    const [items, total] = await Promise.all([
      prisma.instructorProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          bio: true,
          photoUrl: true,
          expertise: true,
          isActive: true,
          isFeatured: true,
          totalStudents: true,
          totalCourses: true,
          averageRating: true,
          displayOrder: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          }
        }
      }),
      prisma.instructorProfile.count({ where })
    ]);

    res.json({
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.patch(
  "/admin/instructors/:id",
  asyncHandler(async (req, res) => {
    const data = {};

    if ("title" in req.body) data.title = requireTrimmedString(req.body.title, "Title", { min: 2, max: 120 });
    if ("bio" in req.body) data.bio = requireTrimmedString(req.body.bio, "Bio", { min: 10, max: 3000 });
    if ("photoUrl" in req.body) data.photoUrl = optionalUrl(req.body.photoUrl, "Photo URL");
    if ("expertise" in req.body) data.expertise = parseExpertise(req.body.expertise);
    if ("websiteUrl" in req.body) data.websiteUrl = optionalUrl(req.body.websiteUrl, "Website URL");
    if ("linkedinUrl" in req.body) data.linkedinUrl = optionalUrl(req.body.linkedinUrl, "LinkedIn URL");
    if ("twitterUrl" in req.body) data.twitterUrl = optionalUrl(req.body.twitterUrl, "Twitter URL");
    if ("githubUrl" in req.body) data.githubUrl = optionalUrl(req.body.githubUrl, "GitHub URL");
    if ("youtubeUrl" in req.body) data.youtubeUrl = optionalUrl(req.body.youtubeUrl, "YouTube URL");
    if ("isActive" in req.body) data.isActive = Boolean(req.body.isActive);
    if ("isFeatured" in req.body) data.isFeatured = Boolean(req.body.isFeatured);
    if ("displayOrder" in req.body) data.displayOrder = Number(req.body.displayOrder || 0);

    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "No instructor fields provided");
    }

    const instructor = await prisma.instructorProfile.update({
      where: { id: req.params.id },
      data
    });

    await logAdminAction(req.auth.userId, "INSTRUCTOR_UPDATED", "InstructorProfile", instructor.id, data);

    res.json({ data: instructor });
  })
);

router.get(
  "/admin/courses",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const status = String(req.query.status || "").toUpperCase();

    const where = status && allowedCourseStatuses.includes(status) ? { status } : {};

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ updatedAt: "desc" }],
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          instructor: {
            select: {
              id: true,
              title: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.course.count({ where })
    ]);

    res.json({
      data: courses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.patch(
  "/admin/courses/:id/status",
  asyncHandler(async (req, res) => {
    const status = String(req.body.status || "").toUpperCase();

    if (!allowedCourseStatuses.includes(status)) {
      throw new HttpError(400, "Invalid course status");
    }

    const course = await prisma.course.update({
      where: {
        id: req.params.id
      },
      data: {
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : undefined
      }
    });

    await logAdminAction(req.auth.userId, "COURSE_STATUS_UPDATED", "Course", course.id, { status });

    res.json({ data: course });
  })
);

router.patch(
  "/admin/courses/:id",
  asyncHandler(async (req, res) => {
    const data = {};

    if ("title" in req.body) data.title = requireTrimmedString(req.body.title, "Title", { min: 2, max: 200 });
    if ("subtitle" in req.body) data.subtitle = optionalTrimmedString(req.body.subtitle, { max: 200 });
    if ("shortDescription" in req.body)
      data.shortDescription = requireTrimmedString(req.body.shortDescription, "Short description", { min: 10, max: 500 });
    if ("fullDescription" in req.body) data.fullDescription = optionalTrimmedString(req.body.fullDescription);
    if ("price" in req.body) data.price = parseOptionalNumber(req.body.price, "Price") ?? 0;
    if ("salePrice" in req.body) data.salePrice = parseOptionalNumber(req.body.salePrice, "Sale price");
    if ("currency" in req.body) data.currency = requireTrimmedString(req.body.currency, "Currency", { min: 1, max: 10 });
    if ("level" in req.body) data.level = requireTrimmedString(req.body.level, "Level", { min: 2, max: 80 });
    if ("language" in req.body) data.language = requireTrimmedString(req.body.language, "Language", { min: 2, max: 80 });
    if ("durationText" in req.body) data.durationText = optionalTrimmedString(req.body.durationText, { max: 120 });
    if ("durationMinutes" in req.body) data.durationMinutes = parseOptionalNumber(req.body.durationMinutes, "Duration minutes");
    if ("thumbnailUrl" in req.body) data.thumbnailUrl = optionalUrl(req.body.thumbnailUrl, "Thumbnail URL");
    if ("trailerUrl" in req.body) data.trailerUrl = optionalUrl(req.body.trailerUrl, "Trailer URL");
    if ("tags" in req.body) data.tags = parseStringArray(req.body.tags, "Tags");
    if ("features" in req.body) data.features = parseStringArray(req.body.features, "Features");
    if ("prerequisites" in req.body) data.prerequisites = parseStringArray(req.body.prerequisites, "Prerequisites");
    if ("categoryId" in req.body) data.categoryId = req.body.categoryId ? String(req.body.categoryId) : null;
    if ("instructorId" in req.body) data.instructorId = req.body.instructorId ? String(req.body.instructorId) : null;
    if ("isFeatured" in req.body) data.isFeatured = Boolean(req.body.isFeatured);
    if ("isPopular" in req.body) data.isPopular = Boolean(req.body.isPopular);
    if ("certificateEnabled" in req.body) data.certificateEnabled = Boolean(req.body.certificateEnabled);

    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "No course fields provided");
    }

    const course = await prisma.course.update({
      where: { id: req.params.id },
      data
    });

    await logAdminAction(req.auth.userId, "COURSE_UPDATED", "Course", course.id, data);

    res.json({ data: course });
  })
);

router.get(
  "/admin/categories",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const search = String(req.query.search || "").trim();

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } }
          ]
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }]
      }),
      prisma.category.count({ where })
    ]);

    res.json({
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.post(
  "/admin/categories",
  asyncHandler(async (req, res) => {
    const name = requireTrimmedString(req.body.name, "Name", { min: 2, max: 120 });
    const slug = requireTrimmedString(req.body.slug, "Slug", { min: 2, max: 120 });
    const description = optionalTrimmedString(req.body.description, { max: 500 });
    const imageUrl = optionalUrl(req.body.imageUrl, "Image URL");
    const displayOrder = Number(req.body.displayOrder || 0);

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        displayOrder
      }
    });

    await logAdminAction(req.auth.userId, "CATEGORY_CREATED", "Category", category.id, { slug });

    res.status(201).json({ data: category });
  })
);

router.patch(
  "/admin/categories/:id",
  asyncHandler(async (req, res) => {
    const data = {};

    if ("name" in req.body) data.name = requireTrimmedString(req.body.name, "Name", { min: 2, max: 120 });
    if ("slug" in req.body) data.slug = requireTrimmedString(req.body.slug, "Slug", { min: 2, max: 120 });
    if ("description" in req.body) data.description = optionalTrimmedString(req.body.description, { max: 500 });
    if ("imageUrl" in req.body) data.imageUrl = optionalUrl(req.body.imageUrl, "Image URL");
    if ("displayOrder" in req.body) data.displayOrder = Number(req.body.displayOrder || 0);

    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "No category fields provided");
    }

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data
    });

    await logAdminAction(req.auth.userId, "CATEGORY_UPDATED", "Category", category.id, data);

    res.json({ data: category });
  })
);

router.get(
  "/admin/testimonials",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const approved = String(req.query.approved || "").toLowerCase().trim();
    const search = String(req.query.search || "").trim();

    const andWhere = [];

    if (approved === "true") {
      andWhere.push({ isApproved: true });
    } else if (approved === "false") {
      andWhere.push({ isApproved: false });
    }

    if (search) {
      andWhere.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { quote: { contains: search, mode: "insensitive" } }
        ]
      });
    }

    const where = andWhere.length ? { AND: andWhere } : {};

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }]
      }),
      prisma.testimonial.count({ where })
    ]);

    res.json({
      data: testimonials,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.get(
  "/admin/testimonials/pending",
  asyncHandler(async (req, res) => {
    req.query.approved = "false";
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const search = String(req.query.search || "").trim();

    const where = search
      ? {
          AND: [
            { isApproved: false },
            {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { quote: { contains: search, mode: "insensitive" } }
              ]
            }
          ]
        }
      : { isApproved: false };

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }]
      }),
      prisma.testimonial.count({ where })
    ]);

    res.json({
      data: testimonials,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.get(
  "/admin/orders",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const status = String(req.query.status || "").toUpperCase().trim();
    const search = String(req.query.search || "").trim();

    const andWhere = [];

    if (status && allowedOrderStatuses.includes(status)) {
      andWhere.push({ status });
    }

    if (search) {
      andWhere.push({
        OR: [
          { orderNumber: { contains: search, mode: "insensitive" } },
          { paymentReference: { contains: search, mode: "insensitive" } },
          {
            user: {
              is: {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } }
                ]
              }
            }
          }
        ]
      });
    }

    const where = andWhere.length ? { AND: andWhere } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              course: {
                select: {
                  id: true,
                  slug: true,
                  title: true
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.patch(
  "/admin/orders/:id",
  asyncHandler(async (req, res) => {
    const data = {};

    if (req.body.status) {
      const status = String(req.body.status).toUpperCase();

      if (!allowedOrderStatuses.includes(status)) {
        throw new HttpError(400, "Invalid order status");
      }

      data.status = status;
      data.paidAt = status === "PAID" ? new Date() : null;
    }

    if (req.body.paymentReference !== undefined) {
      data.paymentReference = req.body.paymentReference ? String(req.body.paymentReference) : null;
    }

    const order = await prisma.order.update({
      where: {
        id: req.params.id
      },
      data
    });

    await logAdminAction(req.auth.userId, "ORDER_UPDATED", "Order", order.id, data);

    res.json({ data: order });
  })
);

router.patch(
  "/admin/testimonials/:id",
  asyncHandler(async (req, res) => {
    const testimonial = await prisma.testimonial.update({
      where: {
        id: req.params.id
      },
      data: {
        isApproved: req.body.isApproved !== undefined ? Boolean(req.body.isApproved) : undefined,
        isFeatured: req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : undefined
      }
    });

    await logAdminAction(req.auth.userId, "TESTIMONIAL_UPDATED", "Testimonial", testimonial.id, {
      isApproved: testimonial.isApproved,
      isFeatured: testimonial.isFeatured
    });

    res.json({ data: testimonial });
  })
);

router.post(
  "/admin/learning-paths",
  asyncHandler(async (req, res) => {
    const slug = String(req.body.slug || "").trim();
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const estimatedDuration = String(req.body.estimatedDuration || "").trim();
    const level = String(req.body.level || "").toUpperCase();

    if (!slug || !title || !description || !estimatedDuration || !level) {
      throw new HttpError(400, "slug, title, description, estimatedDuration, and level are required");
    }

    const learningPath = await prisma.learningPath.create({
      data: {
        slug,
        title,
        description,
        estimatedDuration,
        level,
        icon: req.body.icon ? String(req.body.icon) : null,
        imageUrl: req.body.imageUrl ? String(req.body.imageUrl) : null,
        features: Array.isArray(req.body.features) ? req.body.features : [],
        skills: Array.isArray(req.body.skills) ? req.body.skills : [],
        projects: req.body.projects || null,
        isPublished: Boolean(req.body.isPublished),
        isFeatured: Boolean(req.body.isFeatured),
        displayOrder: Number(req.body.displayOrder || 0)
      }
    });

    await logAdminAction(req.auth.userId, "LEARNING_PATH_CREATED", "LearningPath", learningPath.id, {
      slug: learningPath.slug
    });

    res.status(201).json({ data: learningPath });
  })
);

router.get(
  "/admin/learning-paths",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const search = String(req.query.search || "").trim();
    const level = String(req.query.level || "").toUpperCase().trim();
    const published = String(req.query.published || "").toLowerCase().trim();

    const andWhere = [];

    if (search) {
      andWhere.push({
        OR: [{ title: { contains: search, mode: "insensitive" } }, { slug: { contains: search, mode: "insensitive" } }]
      });
    }

    if (allowedLearningPathLevels.includes(level)) {
      andWhere.push({ level });
    }

    if (published === "true") {
      andWhere.push({ isPublished: true });
    } else if (published === "false") {
      andWhere.push({ isPublished: false });
    }

    const where = andWhere.length ? { AND: andWhere } : {};

    const [items, total] = await Promise.all([
      prisma.learningPath.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }]
      }),
      prisma.learningPath.count({ where })
    ]);

    res.json({
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.patch(
  "/admin/learning-paths/:id",
  asyncHandler(async (req, res) => {
    const data = {};

    if ("title" in req.body) data.title = String(req.body.title || "").trim();
    if ("description" in req.body) data.description = String(req.body.description || "").trim();
    if ("estimatedDuration" in req.body) data.estimatedDuration = String(req.body.estimatedDuration || "").trim();
    if ("icon" in req.body) data.icon = req.body.icon ? String(req.body.icon) : null;
    if ("imageUrl" in req.body) data.imageUrl = req.body.imageUrl ? String(req.body.imageUrl) : null;
    if ("displayOrder" in req.body) data.displayOrder = Number(req.body.displayOrder || 0);
    if ("isPublished" in req.body) data.isPublished = Boolean(req.body.isPublished);
    if ("isFeatured" in req.body) data.isFeatured = Boolean(req.body.isFeatured);
    if ("features" in req.body) data.features = Array.isArray(req.body.features) ? req.body.features : [];
    if ("skills" in req.body) data.skills = Array.isArray(req.body.skills) ? req.body.skills : [];
    if ("projects" in req.body) data.projects = req.body.projects || null;

    if ("level" in req.body) {
      const level = String(req.body.level || "").toUpperCase();
      if (!allowedLearningPathLevels.includes(level)) {
        throw new HttpError(400, "Invalid learning path level");
      }
      data.level = level;
    }

    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "No learning path fields provided");
    }

    const learningPath = await prisma.learningPath.update({
      where: { id: req.params.id },
      data
    });

    await logAdminAction(req.auth.userId, "LEARNING_PATH_UPDATED", "LearningPath", learningPath.id, data);

    res.json({ data: learningPath });
  })
);

router.post(
  "/admin/blogs",
  asyncHandler(async (req, res) => {
    const title = String(req.body.title || "").trim();
    const slug = String(req.body.slug || "").trim();
    const snippet = String(req.body.snippet || "").trim();
    const content = String(req.body.content || "").trim();
    const status = String(req.body.status || "DRAFT").toUpperCase();

    if (!title || !slug || !snippet || !content) {
      throw new HttpError(400, "title, slug, snippet, and content are required");
    }

    const post = await prisma.blogPost.create({
      data: {
        authorId: req.auth.userId,
        title,
        slug,
        snippet,
        content,
        coverImageUrl: req.body.coverImageUrl ? String(req.body.coverImageUrl) : null,
        status,
        isFeatured: Boolean(req.body.isFeatured),
        tags: Array.isArray(req.body.tags) ? req.body.tags : [],
        readingTimeMinutes: Number(req.body.readingTimeMinutes || 5),
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        seoTitle: req.body.seoTitle ? String(req.body.seoTitle) : null,
        seoDescription: req.body.seoDescription ? String(req.body.seoDescription) : null
      }
    });

    await logAdminAction(req.auth.userId, "BLOG_CREATED", "BlogPost", post.id, { slug: post.slug });

    res.status(201).json({ data: post });
  })
);

router.get(
  "/admin/blogs",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").toUpperCase().trim();

    const andWhere = [];

    if (search) {
      andWhere.push({
        OR: [{ title: { contains: search, mode: "insensitive" } }, { slug: { contains: search, mode: "insensitive" } }]
      });
    }

    if (allowedBlogStatuses.includes(status)) {
      andWhere.push({ status });
    }

    const where = andWhere.length ? { AND: andWhere } : {};

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          slug: true,
          snippet: true,
          status: true,
          isFeatured: true,
          readingTimeMinutes: true,
          publishedAt: true,
          createdAt: true
        }
      }),
      prisma.blogPost.count({ where })
    ]);

    res.json({
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.patch(
  "/admin/blogs/:id",
  asyncHandler(async (req, res) => {
    const data = {};

    if ("title" in req.body) data.title = String(req.body.title || "").trim();
    if ("snippet" in req.body) data.snippet = String(req.body.snippet || "").trim();
    if ("content" in req.body) data.content = String(req.body.content || "").trim();
    if ("isFeatured" in req.body) data.isFeatured = Boolean(req.body.isFeatured);

    if ("status" in req.body) {
      const status = String(req.body.status || "").toUpperCase();
      if (!allowedBlogStatuses.includes(status)) {
        throw new HttpError(400, "Invalid blog status");
      }
      data.status = status;
      data.publishedAt = status === "PUBLISHED" ? new Date() : null;
    }

    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "No blog fields provided");
    }

    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data
    });

    await logAdminAction(req.auth.userId, "BLOG_UPDATED", "BlogPost", post.id, data);

    res.json({ data: post });
  })
);

router.get(
  "/admin/coupons",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const search = String(req.query.search || "").trim();
    const type = String(req.query.type || "").toUpperCase().trim();
    const active = String(req.query.active || "").toLowerCase().trim();

    const andWhere = [];

    if (search) {
      andWhere.push({ code: { contains: search, mode: "insensitive" } });
    }

    if (allowedCouponTypes.includes(type)) {
      andWhere.push({ type });
    }

    if (active === "true") {
      andWhere.push({ isActive: true });
    } else if (active === "false") {
      andWhere.push({ isActive: false });
    }

    const where = andWhere.length ? { AND: andWhere } : {};

    const [items, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }]
      }),
      prisma.coupon.count({ where })
    ]);

    res.json({
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.post(
  "/admin/coupons",
  asyncHandler(async (req, res) => {
    const code = requireTrimmedString(req.body.code, "Coupon code", { min: 3, max: 50 }).toUpperCase();
    const description = optionalTrimmedString(req.body.description, { max: 300 });
    const type = String(req.body.type || "").toUpperCase();
    const value = parseOptionalNumber(req.body.value, "Value");

    if (!allowedCouponTypes.includes(type)) {
      throw new HttpError(400, "Invalid coupon type");
    }

    if (value === null || value === undefined || value <= 0) {
      throw new HttpError(400, "Coupon value must be greater than 0");
    }

    if (type === "PERCENTAGE" && value > 100) {
      throw new HttpError(400, "Percentage coupon cannot exceed 100");
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        type,
        value,
        maxRedemptions: parseOptionalNumber(req.body.maxRedemptions, "Max redemptions"),
        startsAt: parseOptionalDate(req.body.startsAt, "Starts at"),
        expiresAt: parseOptionalDate(req.body.expiresAt, "Expires at"),
        isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true
      }
    });

    await logAdminAction(req.auth.userId, "COUPON_CREATED", "Coupon", coupon.id, { code });

    res.status(201).json({ data: coupon });
  })
);

router.patch(
  "/admin/coupons/:id",
  asyncHandler(async (req, res) => {
    const data = {};

    if ("code" in req.body) data.code = requireTrimmedString(req.body.code, "Coupon code", { min: 3, max: 50 }).toUpperCase();
    if ("description" in req.body) data.description = optionalTrimmedString(req.body.description, { max: 300 });
    if ("type" in req.body) {
      const type = String(req.body.type || "").toUpperCase();
      if (!allowedCouponTypes.includes(type)) {
        throw new HttpError(400, "Invalid coupon type");
      }
      data.type = type;
    }
    if ("value" in req.body) {
      const value = parseOptionalNumber(req.body.value, "Value");
      if (value === null || value === undefined || value <= 0) {
        throw new HttpError(400, "Coupon value must be greater than 0");
      }
      if ((data.type || req.body.type || "").toString().toUpperCase() === "PERCENTAGE" && value > 100) {
        throw new HttpError(400, "Percentage coupon cannot exceed 100");
      }
      data.value = value;
    }
    if ("maxRedemptions" in req.body) data.maxRedemptions = parseOptionalNumber(req.body.maxRedemptions, "Max redemptions");
    if ("startsAt" in req.body) data.startsAt = parseOptionalDate(req.body.startsAt, "Starts at");
    if ("expiresAt" in req.body) data.expiresAt = parseOptionalDate(req.body.expiresAt, "Expires at");
    if ("isActive" in req.body) data.isActive = Boolean(req.body.isActive);

    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "No coupon fields provided");
    }

    const coupon = await prisma.coupon.update({
      where: { id: req.params.id },
      data
    });

    await logAdminAction(req.auth.userId, "COUPON_UPDATED", "Coupon", coupon.id, data);

    res.json({ data: coupon });
  })
);

router.get(
  "/admin/reviews",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const courseId = String(req.query.courseId || "").trim();
    const rating = Number(req.query.rating || 0);
    const published = String(req.query.published || "").toLowerCase().trim();
    const search = String(req.query.search || "").trim();

    const andWhere = [];

    if (courseId) {
      andWhere.push({ courseId });
    }

    if (rating) {
      andWhere.push({ rating });
    }

    if (published === "true") {
      andWhere.push({ isPublished: true });
    } else if (published === "false") {
      andWhere.push({ isPublished: false });
    }

    if (search) {
      andWhere.push({
        OR: [
          { comment: { contains: search, mode: "insensitive" } },
          { user: { is: { name: { contains: search, mode: "insensitive" } } } },
          { course: { is: { title: { contains: search, mode: "insensitive" } } } }
        ]
      });
    }

    const where = andWhere.length ? { AND: andWhere } : {};

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true, slug: true } }
        }
      }),
      prisma.review.count({ where })
    ]);

    res.json({
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.patch(
  "/admin/reviews/:id",
  asyncHandler(async (req, res) => {
    const data = {};

    if ("isPublished" in req.body) data.isPublished = Boolean(req.body.isPublished);

    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "No review fields provided");
    }

    const review = await prisma.review.update({
      where: { id: req.params.id },
      data
    });

    await logAdminAction(req.auth.userId, "REVIEW_UPDATED", "Review", review.id, data);

    res.json({ data: review });
  })
);

router.get(
  "/admin/notifications",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const userId = String(req.query.userId || "").trim();
    const type = String(req.query.type || "").toUpperCase().trim();
    const isRead = String(req.query.isRead || "").toLowerCase().trim();
    const search = String(req.query.search || "").trim();

    const andWhere = [];

    if (userId) {
      andWhere.push({ userId });
    }

    if (allowedNotificationTypes.includes(type)) {
      andWhere.push({ type });
    }

    if (isRead === "true") {
      andWhere.push({ isRead: true });
    } else if (isRead === "false") {
      andWhere.push({ isRead: false });
    }

    if (search) {
      andWhere.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { message: { contains: search, mode: "insensitive" } }
        ]
      });
    }

    const where = andWhere.length ? { AND: andWhere } : {};

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        include: { user: { select: { id: true, name: true, email: true } } }
      }),
      prisma.notification.count({ where })
    ]);

    res.json({
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

router.post(
  "/admin/notifications",
  asyncHandler(async (req, res) => {
    const title = requireTrimmedString(req.body.title, "Title", { min: 3, max: 120 });
    const message = requireTrimmedString(req.body.message, "Message", { min: 3, max: 1000 });
    const type = String(req.body.type || "SYSTEM").toUpperCase();
    const linkUrl = optionalTrimmedString(req.body.linkUrl, { max: 300 });
    const userId = req.body.userId ? String(req.body.userId) : null;
    const broadcast = Boolean(req.body.broadcast);

    if (!allowedNotificationTypes.includes(type)) {
      throw new HttpError(400, "Invalid notification type");
    }

    if (broadcast) {
      const users = await prisma.user.findMany({ select: { id: true } });
      if (!users.length) {
        throw new HttpError(404, "No users found to notify");
      }
      await prisma.notification.createMany({
        data: users.map((user) => ({
          userId: user.id,
          type,
          title,
          message,
          linkUrl
        }))
      });

      await logAdminAction(req.auth.userId, "NOTIFICATION_BROADCAST", "Notification", "BROADCAST", {
        type,
        count: users.length
      });

      res.status(201).json({ data: { ok: true, sent: users.length } });
      return;
    }

    if (!userId) {
      throw new HttpError(400, "userId is required when broadcast is false");
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        linkUrl
      }
    });

    await logAdminAction(req.auth.userId, "NOTIFICATION_CREATED", "Notification", notification.id, { userId, type });

    res.status(201).json({ data: notification });
  })
);

router.patch(
  "/admin/notifications/:id",
  asyncHandler(async (req, res) => {
    const data = {};

    if ("isRead" in req.body) data.isRead = Boolean(req.body.isRead);

    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "No notification fields provided");
    }

    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data
    });

    await logAdminAction(req.auth.userId, "NOTIFICATION_UPDATED", "Notification", notification.id, data);

    res.json({ data: notification });
  })
);

router.get(
  "/admin/audit-logs",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 20 });
    const actorId = String(req.query.actorId || "").trim();
    const entityType = String(req.query.entityType || "").trim();
    const search = String(req.query.search || "").trim();

    const andWhere = [];

    if (actorId) {
      andWhere.push({ actorId });
    }

    if (entityType) {
      andWhere.push({ entityType });
    }

    if (search) {
      andWhere.push({
        OR: [
          { action: { contains: search, mode: "insensitive" } },
          { entityId: { contains: search, mode: "insensitive" } }
        ]
      });
    }

    const where = andWhere.length ? { AND: andWhere } : {};

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        include: { actor: { select: { id: true, name: true, email: true } } }
      }),
      prisma.auditLog.count({ where })
    ]);

    res.json({
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

export default router;
