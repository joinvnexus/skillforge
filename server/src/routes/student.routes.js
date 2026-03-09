import { Router } from "express";
import crypto from "node:crypto";

import { asyncHandler } from "../lib/async-handler.js";
import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middlewares/auth.js";
import { optionalTrimmedString, optionalUrl, requireTrimmedString } from "../lib/validators.js";

const router = Router();

const allowedPaymentMethods = ["FREE", "CARD", "BANK", "MOBILE_WALLET", "MANUAL"];
const createOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
const courseUnitPrice = (course) => Number(course.salePrice ?? course.price ?? 0);
const createPaymentReference = () => `pi_${crypto.randomBytes(10).toString("hex")}`;

const grantOrderEnrollments = async (tx, userId, order) => {
  const orderItems = await tx.orderItem.findMany({
    where: {
      orderId: order.id
    },
    select: {
      courseId: true
    }
  });

  if (!orderItems.length) {
    return;
  }

  const courseIds = orderItems.map((item) => item.courseId);
  const existingEnrollments = await tx.enrollment.findMany({
    where: {
      userId,
      courseId: {
        in: courseIds
      }
    },
    select: {
      courseId: true
    }
  });

  const enrolledCourseIdSet = new Set(existingEnrollments.map((entry) => entry.courseId));

  for (const item of orderItems) {
    if (enrolledCourseIdSet.has(item.courseId)) {
      continue;
    }

    await tx.enrollment.create({
      data: {
        userId,
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

const loadOrderWithItems = async (orderId) => {
  return prisma.order.findUnique({
    where: {
      id: orderId
    },
    include: {
      items: {
        include: {
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              thumbnailUrl: true
            }
          }
        }
      }
    }
  });
};

const loadUserOrderWithItems = async (userId, orderId) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    },
    include: {
      items: {
        include: {
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              thumbnailUrl: true,
              shortDescription: true
            }
          }
        }
      }
    }
  });
};

const finalizeOrderPayment = async ({ orderId, userId, outcome, paymentMethod, paymentReference }) => {
  const normalizedOutcome = String(outcome || "").toUpperCase();

  if (!["SUCCESS", "FAILED"].includes(normalizedOutcome)) {
    throw new HttpError(400, "Invalid payment outcome");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    }
  });

  if (!order) {
    throw new HttpError(404, "Order not found");
  }

  if (!order.paymentReference || order.paymentReference !== paymentReference) {
    throw new HttpError(400, "Payment reference mismatch");
  }

  if (order.status === "PAID" || order.status === "FAILED") {
    return loadOrderWithItems(order.id);
  }

  const paid = normalizedOutcome === "SUCCESS";
  const resolvedMethod = allowedPaymentMethods.includes(String(paymentMethod || "").toUpperCase())
    ? String(paymentMethod || "").toUpperCase()
    : order.paymentMethod;

  await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: {
        id: order.id
      },
      data: {
        status: paid ? "PAID" : "FAILED",
        paymentMethod: resolvedMethod,
        paidAt: paid ? new Date() : null
      }
    });

    if (paid) {
      await grantOrderEnrollments(tx, userId, updatedOrder);
    }

    await tx.notification.create({
      data: {
        userId,
        type: "PAYMENT",
        title: paid ? "Payment confirmed" : "Payment failed",
        message: paid
          ? `Your order ${updatedOrder.orderNumber} has been paid successfully.`
          : `Payment failed for order ${updatedOrder.orderNumber}. Please try again.`,
        linkUrl: "/dashboard/orders"
      }
    });
  });

  return loadOrderWithItems(order.id);
};

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
    if ("name" in req.body) {
      updates.name = requireTrimmedString(req.body.name, "Name", { min: 2, max: 100 });
    }
    if ("avatarUrl" in req.body) {
      updates.avatarUrl = optionalUrl(req.body.avatarUrl, "Avatar URL");
    }
    if ("headline" in req.body) {
      updates.headline = optionalTrimmedString(req.body.headline, { max: 180 });
    }
    if ("bio" in req.body) {
      updates.bio = optionalTrimmedString(req.body.bio, { max: 2000 });
    }
    if ("phone" in req.body) {
      updates.phone = optionalTrimmedString(req.body.phone, { max: 40 });
    }
    if ("timezone" in req.body) {
      updates.timezone = optionalTrimmedString(req.body.timezone, { max: 100 });
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

router.get(
  "/student/me/orders",
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.auth.userId
      },
      orderBy: [{ createdAt: "desc" }],
      include: {
        items: {
          include: {
            course: {
              select: {
                id: true,
                slug: true,
                title: true,
                thumbnailUrl: true,
                shortDescription: true
              }
            }
          }
        }
      }
    });

    res.json({ data: orders });
  })
);

router.get(
  "/student/me/orders/:orderId",
  asyncHandler(async (req, res) => {
    const order = await loadUserOrderWithItems(req.auth.userId, req.params.orderId);

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    res.json({ data: order });
  })
);

router.post(
  "/student/me/orders",
  asyncHandler(async (req, res) => {
    const rawCourseIds = Array.isArray(req.body.courseIds) ? req.body.courseIds : [];
    const courseIds = [...new Set(rawCourseIds.map((item) => String(item || "").trim()).filter(Boolean))];
    const markPaid = req.body.markPaid !== undefined ? Boolean(req.body.markPaid) : false;
    const requestedMethod = String(req.body.paymentMethod || "CARD").toUpperCase();
    const paymentMethod = allowedPaymentMethods.includes(requestedMethod) ? requestedMethod : "CARD";

    if (courseIds.length === 0) {
      throw new HttpError(400, "At least one course is required to create an order");
    }

    const courses = await prisma.course.findMany({
      where: {
        id: {
          in: courseIds
        },
        status: "PUBLISHED"
      },
      select: {
        id: true,
        slug: true,
        title: true,
        price: true,
        salePrice: true
      }
    });

    if (courses.length !== courseIds.length) {
      throw new HttpError(404, "Some selected courses are unavailable");
    }

    const orderItems = courses.map((course) => {
      const totalPrice = courseUnitPrice(course);
      return {
        courseId: course.id,
        unitPrice: totalPrice,
        discountAmount: 0,
        totalPrice
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalAmount = subtotal;
    const isPaid = markPaid || totalAmount === 0 || paymentMethod === "FREE";
    const orderStatus = isPaid ? "PAID" : "PENDING";

    const order = await prisma.$transaction(async (tx) => {
      const paymentReference = totalAmount > 0 && !isPaid ? createPaymentReference() : null;

      const createdOrder = await tx.order.create({
        data: {
          orderNumber: createOrderNumber(),
          userId: req.auth.userId,
          status: orderStatus,
          paymentMethod: paymentMethod === "FREE" && totalAmount > 0 ? "CARD" : paymentMethod,
          subtotal,
          discountAmount: 0,
          totalAmount,
          paymentReference,
          paidAt: isPaid ? new Date() : null
        }
      });

      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: createdOrder.id,
          ...item
        }))
      });

      if (isPaid) {
        await grantOrderEnrollments(tx, req.auth.userId, createdOrder);
      }

      await tx.notification.create({
        data: {
          userId: req.auth.userId,
          type: "PAYMENT",
          title: isPaid ? "Order completed" : "Order created",
          message: isPaid
            ? `Your order ${createdOrder.orderNumber} is paid and courses are now available.`
            : `Your order ${createdOrder.orderNumber} is pending payment.`,
          linkUrl: "/dashboard/orders"
        }
      });

      return createdOrder;
    });

    const fullOrder = await loadOrderWithItems(order.id);

    res.status(201).json({ data: fullOrder });
  })
);

router.post(
  "/student/me/orders/:orderId/payment-intent",
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.orderId,
        userId: req.auth.userId
      }
    });

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    if (order.status === "PAID") {
      throw new HttpError(400, "Order is already paid");
    }

    if (!order.paymentReference) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentReference: createPaymentReference() }
      });
    }

    const refreshedOrder = await prisma.order.findUnique({
      where: { id: order.id }
    });

    res.json({
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.totalAmount,
        currency: order.currency,
        paymentReference: refreshedOrder?.paymentReference,
        status: order.status
      }
    });
  })
);

router.post(
  "/student/me/orders/:orderId/payment-verify",
  asyncHandler(async (req, res) => {
    const paymentReference = String(req.body.paymentReference || "").trim();
    const outcome = String(req.body.outcome || "SUCCESS").toUpperCase();
    const paymentMethod = String(req.body.paymentMethod || "CARD").toUpperCase();

    if (!paymentReference) {
      throw new HttpError(400, "paymentReference is required");
    }

    const order = await finalizeOrderPayment({
      orderId: req.params.orderId,
      userId: req.auth.userId,
      outcome,
      paymentMethod,
      paymentReference
    });

    res.json({ data: order });
  })
);

router.post(
  "/student/me/orders/:orderId/pay",
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.orderId,
        userId: req.auth.userId
      },
      select: {
        paymentReference: true
      }
    });

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    if (!order.paymentReference) {
      throw new HttpError(400, "Payment intent not initialized");
    }

    const paymentMethod = String(req.body.paymentMethod || "CARD").toUpperCase();

    const paidOrder = await finalizeOrderPayment({
      orderId: req.params.orderId,
      userId: req.auth.userId,
      outcome: "SUCCESS",
      paymentMethod,
      paymentReference: order.paymentReference
    });

    res.json({ data: paidOrder });
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
