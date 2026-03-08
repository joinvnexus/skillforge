import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

const profileFields = ["name", "avatarUrl", "headline", "bio", "phone", "timezone"];

const syncCourseMetrics = async (courseId) => {
  const aggregate = await prisma.review.aggregate({
    where: {
      courseId,
      isPublished: true
    },
    _avg: {
      rating: true
    },
    _count: {
      _all: true
    }
  });

  await prisma.course.update({
    where: {
      id: courseId
    },
    data: {
      averageRating: aggregate._avg.rating || 0,
      reviewCount: aggregate._count._all
    }
  });
};

router.use("/student", requireAuth);

router.get(
  "/student/dashboard/overview",
  asyncHandler(async (req, res) => {
    const [activeCourses, completedCourses, wishlistCount, unreadNotifications] = await Promise.all([
      prisma.enrollment.count({
        where: {
          userId: req.auth.userId,
          status: "ACTIVE"
        }
      }),
      prisma.enrollment.count({
        where: {
          userId: req.auth.userId,
          status: "COMPLETED"
        }
      }),
      prisma.wishlistItem.count({
        where: {
          userId: req.auth.userId
        }
      }),
      prisma.notification.count({
        where: {
          userId: req.auth.userId,
          isRead: false
        }
      })
    ]);

    res.json({
      data: {
        activeCourses,
        completedCourses,
        wishlistCount,
        unreadNotifications
      }
    });
  })
);

router.get(
  "/student/me/profile",
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.auth.userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatarUrl: true,
        headline: true,
        bio: true,
        phone: true,
        timezone: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    res.json({ data: user });
  })
);

router.patch(
  "/student/me/profile",
  asyncHandler(async (req, res) => {
    const updates = {};

    for (const field of profileFields) {
      if (field in req.body) {
        updates[field] = req.body[field];
      }
    }

    const user = await prisma.user.update({
      where: {
        id: req.auth.userId
      },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        headline: true,
        bio: true,
        phone: true,
        timezone: true,
        updatedAt: true
      }
    });

    res.json({ data: user });
  })
);

router.get(
  "/student/me/enrollments",
  asyncHandler(async (req, res) => {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: req.auth.userId
      },
      orderBy: [{ enrolledAt: "desc" }],
      include: {
        course: {
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
                    avatarUrl: true
                  }
                }
              }
            }
          }
        }
      }
    });

    res.json({ data: enrollments });
  })
);

router.post(
  "/student/me/enrollments",
  asyncHandler(async (req, res) => {
    const courseId = String(req.body.courseId || "").trim();

    if (!courseId) {
      throw new HttpError(400, "Course ID is required");
    }

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        status: "PUBLISHED"
      }
    });

    if (!course) {
      throw new HttpError(404, "Published course not found");
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.auth.userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.json({ data: existingEnrollment });
    }

    const [enrollment] = await prisma.$transaction([
      prisma.enrollment.create({
        data: {
          userId: req.auth.userId,
          courseId
        }
      }),
      prisma.course.update({
        where: {
          id: courseId
        },
        data: {
          studentCount: {
            increment: 1
          }
        }
      }),
      prisma.notification.create({
        data: {
          userId: req.auth.userId,
          type: "ENROLLMENT",
          title: "Enrollment confirmed",
          message: `You are now enrolled in ${course.title}.`,
          linkUrl: `/courses/${course.slug}`
        }
      })
    ]);

    res.status(201).json({ data: enrollment });
  })
);

router.get(
  "/student/me/wishlist",
  asyncHandler(async (req, res) => {
    const wishlist = await prisma.wishlistItem.findMany({
      where: {
        userId: req.auth.userId
      },
      orderBy: [{ createdAt: "desc" }],
      include: {
        course: true
      }
    });

    res.json({ data: wishlist });
  })
);

router.post(
  "/student/me/wishlist",
  asyncHandler(async (req, res) => {
    const courseId = String(req.body.courseId || "").trim();

    if (!courseId) {
      throw new HttpError(400, "Course ID is required");
    }

    const wishlistItem = await prisma.wishlistItem.upsert({
      where: {
        userId_courseId: {
          userId: req.auth.userId,
          courseId
        }
      },
      update: {},
      create: {
        userId: req.auth.userId,
        courseId
      }
    });

    res.status(201).json({ data: wishlistItem });
  })
);

router.delete(
  "/student/me/wishlist/:courseId",
  asyncHandler(async (req, res) => {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: req.auth.userId,
        courseId: req.params.courseId
      }
    });

    res.json({
      data: {
        success: true
      }
    });
  })
);

router.post(
  "/student/me/reviews",
  asyncHandler(async (req, res) => {
    const courseId = String(req.body.courseId || "").trim();
    const rating = Number(req.body.rating);
    const comment = req.body.comment ? String(req.body.comment) : null;

    if (!courseId || !Number.isInteger(rating)) {
      throw new HttpError(400, "Course ID and integer rating are required");
    }

    if (rating < 1 || rating > 5) {
      throw new HttpError(400, "Rating must be between 1 and 5");
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.auth.userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      throw new HttpError(403, "Only enrolled students can submit a review");
    }

    const review = await prisma.review.upsert({
      where: {
        userId_courseId: {
          userId: req.auth.userId,
          courseId
        }
      },
      update: {
        rating,
        comment
      },
      create: {
        userId: req.auth.userId,
        courseId,
        rating,
        comment
      }
    });

    await syncCourseMetrics(courseId);

    res.status(201).json({ data: review });
  })
);

router.patch(
  "/student/me/lessons/:lessonId/progress",
  asyncHandler(async (req, res) => {
    const lessonId = req.params.lessonId;
    const enrollmentId = String(req.body.enrollmentId || "").trim();
    const isCompleted = Boolean(req.body.isCompleted);
    const watchSeconds = Math.max(Number(req.body.watchSeconds || 0), 0);

    if (!enrollmentId) {
      throw new HttpError(400, "Enrollment ID is required");
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        userId: req.auth.userId
      }
    });

    if (!enrollment) {
      throw new HttpError(404, "Enrollment not found");
    }

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        section: {
          is: {
            courseId: enrollment.courseId
          }
        }
      }
    });

    if (!lesson) {
      throw new HttpError(404, "Lesson not found for this enrollment");
    }

    const progressEntry = await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId
        }
      },
      update: {
        isCompleted,
        watchSeconds,
        completedAt: isCompleted ? new Date() : null
      },
      create: {
        enrollmentId,
        lessonId,
        isCompleted,
        watchSeconds,
        completedAt: isCompleted ? new Date() : null
      }
    });

    const [totalLessons, completedLessons] = await Promise.all([
      prisma.lesson.count({
        where: {
          section: {
            is: {
              courseId: enrollment.courseId
            }
          }
        }
      }),
      prisma.lessonProgress.count({
        where: {
          enrollmentId,
          isCompleted: true
        }
      })
    ]);

    const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        id: enrollmentId
      },
      data: {
        progressPercent,
        lastAccessedAt: new Date(),
        status: progressPercent === 100 ? "COMPLETED" : "ACTIVE",
        completedAt: progressPercent === 100 ? new Date() : null
      }
    });

    res.json({
      data: {
        progressEntry,
        enrollment: updatedEnrollment
      }
    });
  })
);

export default router;
