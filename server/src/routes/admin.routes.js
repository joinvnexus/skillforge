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

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } }
          ]
        }
      : {};

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
  "/admin/testimonials/pending",
  asyncHandler(async (_req, res) => {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isApproved: false
      },
      orderBy: [{ createdAt: "desc" }]
    });

    res.json({ data: testimonials });
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

export default router;
