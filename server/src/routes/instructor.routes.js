import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

const editableCourseFields = [
  "slug",
  "title",
  "subtitle",
  "shortDescription",
  "fullDescription",
  "price",
  "salePrice",
  "currency",
  "level",
  "language",
  "durationText",
  "durationMinutes",
  "thumbnailUrl",
  "trailerUrl",
  "tags",
  "features",
  "prerequisites",
  "categoryId",
  "isFeatured",
  "isPopular",
  "certificateEnabled"
];

const pickFields = (input, fields) => {
  return fields.reduce((accumulator, field) => {
    if (field in input) {
      accumulator[field] = input[field];
    }

    return accumulator;
  }, {});
};

const resolveInstructorProfile = async (userId) => {
  const instructor = await prisma.instructorProfile.findUnique({
    where: {
      userId
    }
  });

  if (!instructor) {
    throw new HttpError(404, "Instructor profile not found");
  }

  return instructor;
};

router.use("/instructor", requireAuth, requireRole("INSTRUCTOR"));

router.get(
  "/instructor/dashboard/overview",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);

    const [totalCourses, publishedCourses, courseTotals] = await Promise.all([
      prisma.course.count({
        where: {
          instructorId: instructor.id
        }
      }),
      prisma.course.count({
        where: {
          instructorId: instructor.id,
          status: "PUBLISHED"
        }
      }),
      prisma.course.aggregate({
        where: {
          instructorId: instructor.id
        },
        _sum: {
          studentCount: true,
          reviewCount: true
        }
      })
    ]);

    res.json({
      data: {
        totalCourses,
        publishedCourses,
        totalStudents: courseTotals._sum.studentCount || 0,
        totalReviews: courseTotals._sum.reviewCount || 0
      }
    });
  })
);

router.get(
  "/instructor/courses",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);

    const courses = await prisma.course.findMany({
      where: {
        instructorId: instructor.id
      },
      orderBy: [{ updatedAt: "desc" }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            sections: true,
            enrollments: true,
            reviews: true
          }
        }
      }
    });

    res.json({ data: courses });
  })
);

router.post(
  "/instructor/courses",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);
    const slug = String(req.body.slug || "").trim();
    const title = String(req.body.title || "").trim();
    const shortDescription = String(req.body.shortDescription || "").trim();
    const level = String(req.body.level || "").trim();

    if (!slug || !title || !shortDescription || !level) {
      throw new HttpError(400, "Slug, title, shortDescription, and level are required");
    }

    const course = await prisma.course.create({
      data: {
        slug,
        title,
        shortDescription,
        level,
        authorId: req.auth.userId,
        instructorId: instructor.id,
        ...pickFields(req.body, editableCourseFields)
      }
    });

    await prisma.instructorProfile.update({
      where: {
        id: instructor.id
      },
      data: {
        totalCourses: {
          increment: 1
        }
      }
    });

    res.status(201).json({ data: course });
  })
);

router.patch(
  "/instructor/courses/:courseId",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);

    const course = await prisma.course.findFirst({
      where: {
        id: req.params.courseId,
        instructorId: instructor.id
      }
    });

    if (!course) {
      throw new HttpError(404, "Course not found");
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: course.id
      },
      data: pickFields(req.body, editableCourseFields)
    });

    res.json({ data: updatedCourse });
  })
);

router.delete(
  "/instructor/courses/:courseId",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);

    const course = await prisma.course.findFirst({
      where: {
        id: req.params.courseId,
        instructorId: instructor.id
      },
      select: {
        id: true
      }
    });

    if (!course) {
      throw new HttpError(404, "Course not found");
    }

    await prisma.course.delete({
      where: {
        id: course.id
      }
    });

    const totalCourses = await prisma.course.count({
      where: {
        instructorId: instructor.id
      }
    });

    await prisma.instructorProfile.update({
      where: {
        id: instructor.id
      },
      data: {
        totalCourses
      }
    });

    res.json({
      data: {
        success: true
      }
    });
  })
);

router.patch(
  "/instructor/courses/:courseId/status",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);
    const status = String(req.body.status || "").toUpperCase();

    if (!["DRAFT", "REVIEW"].includes(status)) {
      throw new HttpError(400, "Instructors can only move courses to DRAFT or REVIEW");
    }

    const course = await prisma.course.findFirst({
      where: {
        id: req.params.courseId,
        instructorId: instructor.id
      }
    });

    if (!course) {
      throw new HttpError(404, "Course not found");
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: course.id
      },
      data: {
        status
      }
    });

    res.json({ data: updatedCourse });
  })
);

router.post(
  "/instructor/courses/:courseId/sections",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);
    const title = String(req.body.title || "").trim();

    if (!title) {
      throw new HttpError(400, "Section title is required");
    }

    const course = await prisma.course.findFirst({
      where: {
        id: req.params.courseId,
        instructorId: instructor.id
      }
    });

    if (!course) {
      throw new HttpError(404, "Course not found");
    }

    const existingSections = await prisma.courseSection.count({
      where: {
        courseId: course.id
      }
    });

    const section = await prisma.courseSection.create({
      data: {
        courseId: course.id,
        title,
        description: req.body.description ? String(req.body.description) : null,
        position: Number(req.body.position || existingSections + 1)
      }
    });

    res.status(201).json({ data: section });
  })
);

router.post(
  "/instructor/sections/:sectionId/lessons",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);
    const title = String(req.body.title || "").trim();
    const slug = String(req.body.slug || "").trim();

    if (!title || !slug) {
      throw new HttpError(400, "Lesson title and slug are required");
    }

    const section = await prisma.courseSection.findFirst({
      where: {
        id: req.params.sectionId,
        course: {
          is: {
            instructorId: instructor.id
          }
        }
      }
    });

    if (!section) {
      throw new HttpError(404, "Section not found");
    }

    const existingLessons = await prisma.lesson.count({
      where: {
        sectionId: section.id
      }
    });

    const lesson = await prisma.lesson.create({
      data: {
        sectionId: section.id,
        title,
        slug,
        description: req.body.description ? String(req.body.description) : null,
        type: String(req.body.type || "VIDEO").toUpperCase(),
        videoUrl: req.body.videoUrl ? String(req.body.videoUrl) : null,
        articleContent: req.body.articleContent ? String(req.body.articleContent) : null,
        durationMinutes: req.body.durationMinutes ? Number(req.body.durationMinutes) : null,
        isPreview: Boolean(req.body.isPreview),
        attachments: req.body.attachments || null,
        position: Number(req.body.position || existingLessons + 1)
      }
    });

    res.status(201).json({ data: lesson });
  })
);

router.get(
  "/instructor/courses/:courseId/enrollments",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);

    const course = await prisma.course.findFirst({
      where: {
        id: req.params.courseId,
        instructorId: instructor.id
      }
    });

    if (!course) {
      throw new HttpError(404, "Course not found");
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId: course.id
      },
      orderBy: [{ enrolledAt: "desc" }],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    res.json({ data: enrollments });
  })
);

export default router;
