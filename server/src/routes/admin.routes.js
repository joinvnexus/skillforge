import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { HttpError } from "../lib/http-error.js";
import { getPagination } from "../lib/pagination.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

const allowedRoles = ["STUDENT", "INSTRUCTOR", "ADMIN"];
const allowedStatuses = ["ACTIVE", "PENDING", "BLOCKED"];
const allowedCourseStatuses = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"];
const allowedOrderStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const allowedBlogStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const allowedLearningPathLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

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

export default router;
