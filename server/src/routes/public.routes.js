import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { env } from "../config/env.js";
import { HttpError } from "../lib/http-error.js";
import { getPagination } from "../lib/pagination.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

const getIdentifierFilter = (identifier) => {
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      identifier
    )
  ) {
    return { id: identifier };
  }

  return { slug: identifier };
};

const coursePreviewInclude = {
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
      photoUrl: true,
      averageRating: true,
      totalStudents: true,
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true
        }
      }
    }
  }
};

const grantOrderEnrollments = async (tx, order) => {
  const items = await tx.orderItem.findMany({
    where: {
      orderId: order.id
    },
    select: {
      courseId: true
    }
  });

  if (!items.length) {
    return;
  }

  const courseIds = items.map((item) => item.courseId);
  const existingEnrollments = await tx.enrollment.findMany({
    where: {
      userId: order.userId,
      courseId: {
        in: courseIds
      }
    },
    select: {
      courseId: true
    }
  });

  const enrolledSet = new Set(existingEnrollments.map((entry) => entry.courseId));

  for (const item of items) {
    if (enrolledSet.has(item.courseId)) {
      continue;
    }

    await tx.enrollment.create({
      data: {
        userId: order.userId,
        courseId: item.courseId,
        orderId: order.id
      }
    });

    await tx.course.update({
      where: {
        id: item.courseId
      },
      data: {
        studentCount: {
          increment: 1
        }
      }
    });
  }
};

router.get(
  "/payments/mock-webhook",
  asyncHandler(async (_req, res) => {
    res.json({
      data: {
        ok: true,
        message: "Use POST /api/v1/payments/mock-webhook with x-payment-webhook-secret."
      }
    });
  })
);

router.post(
  "/payments/mock-webhook",
  asyncHandler(async (req, res) => {
    const secret = String(req.headers["x-payment-webhook-secret"] || "");

    if (!secret || secret !== env.PAYMENT_WEBHOOK_SECRET) {
      throw new HttpError(401, "Invalid webhook secret");
    }

    const paymentReference = String(req.body.paymentReference || "").trim();
    const outcome = String(req.body.outcome || "").toUpperCase();

    if (!paymentReference || !["SUCCESS", "FAILED"].includes(outcome)) {
      throw new HttpError(400, "paymentReference and valid outcome are required");
    }

    const order = await prisma.order.findFirst({
      where: {
        paymentReference
      }
    });

    if (!order) {
      throw new HttpError(404, "Order not found for paymentReference");
    }

    if (order.status === "PAID" || order.status === "FAILED") {
      return res.json({ data: { success: true, orderId: order.id, status: order.status } });
    }

    await prisma.$transaction(async (tx) => {
      const paid = outcome === "SUCCESS";
      const updatedOrder = await tx.order.update({
        where: {
          id: order.id
        },
        data: {
          status: paid ? "PAID" : "FAILED",
          paidAt: paid ? new Date() : null
        }
      });

      if (paid) {
        await grantOrderEnrollments(tx, updatedOrder);
      }

      await tx.notification.create({
        data: {
          userId: updatedOrder.userId,
          type: "PAYMENT",
          title: paid ? "Payment confirmed" : "Payment failed",
          message: paid
            ? `Your order ${updatedOrder.orderNumber} has been paid successfully.`
            : `Payment failed for order ${updatedOrder.orderNumber}.`,
          linkUrl: "/dashboard/orders"
        }
      });
    });

    res.json({ data: { success: true, orderId: order.id, status: outcome === "SUCCESS" ? "PAID" : "FAILED" } });
  })
);

router.get(
  "/home",
  asyncHandler(async (_req, res) => {
    const [featuredCourses, featuredInstructors, featuredTestimonials, featuredBlogs, featuredLearningPaths] =
      await Promise.all([
        prisma.course.findMany({
          where: {
            status: "PUBLISHED",
            isFeatured: true
          },
          take: 6,
          orderBy: [{ publishedAt: "desc" }],
          include: coursePreviewInclude
        }),
        prisma.instructorProfile.findMany({
          where: {
            isActive: true,
            isFeatured: true
          },
          take: 4,
          orderBy: [{ displayOrder: "asc" }, { averageRating: "desc" }],
          select: {
            id: true,
            title: true,
            bio: true,
            photoUrl: true,
            expertise: true,
            averageRating: true,
            totalStudents: true,
            totalCourses: true,
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }),
        prisma.testimonial.findMany({
          where: {
            isApproved: true,
            isFeatured: true
          },
          take: 4,
          orderBy: [{ rating: "desc" }, { createdAt: "desc" }]
        }),
        prisma.blogPost.findMany({
          where: {
            status: "PUBLISHED",
            isFeatured: true
          },
          take: 3,
          orderBy: [{ publishedAt: "desc" }],
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }),
        prisma.learningPath.findMany({
          where: {
            isPublished: true,
            isFeatured: true
          },
          take: 3,
          orderBy: [{ displayOrder: "asc" }],
          include: {
            courses: {
              take: 4,
              orderBy: [{ moduleOrder: "asc" }],
              select: {
                moduleOrder: true,
                course: {
                  select: {
                    id: true,
                    slug: true,
                    title: true,
                    thumbnailUrl: true,
                    level: true,
                    averageRating: true
                  }
                }
              }
            }
          }
        })
      ]);

    res.json({
      data: {
        featuredCourses,
        featuredInstructors,
        featuredTestimonials,
        featuredBlogs,
        featuredLearningPaths
      }
    });
  })
);

router.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: {
            courses: true
          }
        }
      }
    });

    res.json({ data: categories });
  })
);

router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();
    const level = String(req.query.level || "").trim();

    const where = {
      status: "PUBLISHED",
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { shortDescription: { contains: search, mode: "insensitive" } },
              { tags: { has: search } }
            ]
          }
        : {}),
      ...(category
        ? {
            category: {
              is: {
                slug: category
              }
            }
          }
        : {}),
      ...(level
        ? {
            level: {
              equals: level,
              mode: "insensitive"
            }
          }
        : {})
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
        include: coursePreviewInclude
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

router.get(
  "/courses/:slug",
  asyncHandler(async (req, res) => {
    const identifier = req.params.slug;

    const course = await prisma.course.findFirst({
      where: {
        ...getIdentifierFilter(identifier),
        status: "PUBLISHED"
      },
      include: {
        ...coursePreviewInclude,
        sections: {
          orderBy: [{ position: "asc" }],
          include: {
            lessons: {
              orderBy: [{ position: "asc" }],
              select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                type: true,
                durationMinutes: true,
                isPreview: true,
                position: true
              }
            }
          }
        },
        faqs: {
          orderBy: [{ position: "asc" }]
        },
        reviews: {
          where: {
            isPublished: true
          },
          take: 10,
          orderBy: [{ createdAt: "desc" }],
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      throw new HttpError(404, "Course not found");
    }

    const relatedCourses = course.categoryId
      ? await prisma.course.findMany({
          where: {
            status: "PUBLISHED",
            categoryId: course.categoryId,
            id: {
              not: course.id
            }
          },
          take: 4,
          orderBy: [{ isPopular: "desc" }, { publishedAt: "desc" }],
          include: coursePreviewInclude
        })
      : [];

    res.json({
      data: course,
      relatedCourses
    });
  })
);

router.get(
  "/learning-paths",
  asyncHandler(async (req, res) => {
    const level = String(req.query.level || "").trim().toUpperCase();

    const learningPaths = await prisma.learningPath.findMany({
      where: {
        isPublished: true,
        ...(level ? { level } : {})
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: {
            courses: true
          }
        }
      }
    });

    res.json({ data: learningPaths });
  })
);

router.get(
  "/learning-paths/:slug",
  asyncHandler(async (req, res) => {
    const learningPath = await prisma.learningPath.findFirst({
      where: {
        slug: req.params.slug,
        isPublished: true
      },
      include: {
        courses: {
          orderBy: [{ moduleOrder: "asc" }],
          select: {
            moduleOrder: true,
            isRequired: true,
            course: {
              include: {
                ...coursePreviewInclude,
                sections: {
                  orderBy: [{ position: "asc" }],
                  include: {
                    lessons: {
                      orderBy: [{ position: "asc" }],
                      select: {
                        id: true,
                        title: true,
                        durationMinutes: true,
                        position: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        testimonials: {
          where: {
            isApproved: true
          },
          orderBy: [{ rating: "desc" }, { createdAt: "desc" }]
        }
      }
    });

    if (!learningPath) {
      throw new HttpError(404, "Learning path not found");
    }

    res.json({ data: learningPath });
  })
);

router.get(
  "/blogs",
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { limit: 9 });

    const where = {
      status: "PUBLISHED"
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ publishedAt: "desc" }],
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
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

router.get(
  "/blogs/:slug",
  asyncHandler(async (req, res) => {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug: req.params.slug,
        status: "PUBLISHED"
      }
    });

    if (!post) {
      throw new HttpError(404, "Blog post not found");
    }

    const updatedPost = await prisma.blogPost.update({
      where: {
        id: post.id
      },
      data: {
        viewCount: {
          increment: 1
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.json({ data: updatedPost });
  })
);

router.get(
  "/instructors",
  asyncHandler(async (req, res) => {
    const featuredOnly = String(req.query.featured || "") === "true";

    const instructors = await prisma.instructorProfile.findMany({
      where: {
        isActive: true,
        ...(featuredOnly ? { isFeatured: true } : {})
      },
      orderBy: [{ displayOrder: "asc" }, { averageRating: "desc" }],
      select: {
        id: true,
        title: true,
        bio: true,
        photoUrl: true,
        expertise: true,
        averageRating: true,
        totalStudents: true,
        totalCourses: true,
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.json({ data: instructors });
  })
);

router.get(
  "/instructors/:id",
  asyncHandler(async (req, res) => {
    const instructor = await prisma.instructorProfile.findFirst({
      where: {
        id: req.params.id,
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            headline: true,
            bio: true
          }
        },
        courses: {
          where: {
            status: "PUBLISHED"
          },
          orderBy: [{ publishedAt: "desc" }],
          include: coursePreviewInclude
        },
        testimonials: {
          where: {
            isApproved: true
          },
          orderBy: [{ rating: "desc" }, { createdAt: "desc" }]
        }
      }
    });

    if (!instructor) {
      throw new HttpError(404, "Instructor not found");
    }

    res.json({ data: instructor });
  })
);

router.get(
  "/testimonials",
  asyncHandler(async (req, res) => {
    const featuredOnly = String(req.query.featured || "") === "true";
    const courseId = String(req.query.courseId || "").trim();
    const learningPathId = String(req.query.learningPathId || "").trim();

    const testimonials = await prisma.testimonial.findMany({
      where: {
        isApproved: true,
        ...(featuredOnly ? { isFeatured: true } : {}),
        ...(courseId ? { courseId } : {}),
        ...(learningPathId ? { learningPathId } : {})
      },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }]
    });

    res.json({ data: testimonials });
  })
);

router.get(
  "/testimonials/featured",
  asyncHandler(async (_req, res) => {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isApproved: true,
        isFeatured: true
      },
      take: 8,
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }]
    });

    res.json({ data: testimonials });
  })
);

export default router;
