import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { optionalTrimmedString, optionalUrl, requireTrimmedString } from "../lib/validators.js";
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

const parseAttachments = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new HttpError(400, "Attachments must be an array");
  }

  const cleaned = value
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .map((item) => {
      try {
        const parsed = new URL(item);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new HttpError(400, "Attachment URLs must use HTTP(S)");
        }
      } catch (_error) {
        throw new HttpError(400, "Attachment URLs must be valid");
      }
      return item;
    });

  return cleaned.length ? cleaned : null;
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

const resolveExpertise = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new HttpError(400, "Expertise must be an array");
  }

  const expertise = value
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 20);

  return expertise;
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
  "/instructor/me/profile",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);

    res.json({
      data: {
        id: instructor.id,
        title: instructor.title,
        bio: instructor.bio,
        photoUrl: instructor.photoUrl,
        expertise: instructor.expertise || [],
        websiteUrl: instructor.websiteUrl,
        linkedinUrl: instructor.linkedinUrl,
        twitterUrl: instructor.twitterUrl,
        githubUrl: instructor.githubUrl,
        youtubeUrl: instructor.youtubeUrl
      }
    });
  })
);

router.patch(
  "/instructor/me/profile",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);
    const updates = {};

    if ("title" in req.body) {
      updates.title = requireTrimmedString(req.body.title, "Title", { min: 2, max: 120 });
    }

    if ("bio" in req.body) {
      updates.bio = requireTrimmedString(req.body.bio, "Bio", { min: 10, max: 3000 });
    }

    if ("photoUrl" in req.body) {
      updates.photoUrl = optionalUrl(req.body.photoUrl, "Photo URL");
    }

    if ("expertise" in req.body) {
      updates.expertise = resolveExpertise(req.body.expertise);
    }

    if ("websiteUrl" in req.body) updates.websiteUrl = optionalUrl(req.body.websiteUrl, "Website URL");
    if ("linkedinUrl" in req.body) updates.linkedinUrl = optionalUrl(req.body.linkedinUrl, "LinkedIn URL");
    if ("twitterUrl" in req.body) updates.twitterUrl = optionalUrl(req.body.twitterUrl, "Twitter URL");
    if ("githubUrl" in req.body) updates.githubUrl = optionalUrl(req.body.githubUrl, "GitHub URL");
    if ("youtubeUrl" in req.body) updates.youtubeUrl = optionalUrl(req.body.youtubeUrl, "YouTube URL");

    if (Object.keys(updates).length === 0) {
      throw new HttpError(400, "No instructor profile fields provided");
    }

    const updated = await prisma.instructorProfile.update({
      where: {
        id: instructor.id
      },
      data: updates
    });

    res.json({
      data: {
        id: updated.id,
        title: updated.title,
        bio: updated.bio,
        photoUrl: updated.photoUrl,
        expertise: updated.expertise || [],
        websiteUrl: updated.websiteUrl,
        linkedinUrl: updated.linkedinUrl,
        twitterUrl: updated.twitterUrl,
        githubUrl: updated.githubUrl,
        youtubeUrl: updated.youtubeUrl
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

router.get(
  "/instructor/courses/:courseId/studio",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);

    const course = await prisma.course.findFirst({
      where: {
        id: req.params.courseId,
        instructorId: instructor.id
      },
      include: {
        sections: {
          orderBy: {
            position: "asc"
          },
          include: {
            lessons: {
              orderBy: {
                position: "asc"
              }
            }
          }
        }
      }
    });

    if (!course) {
      throw new HttpError(404, "Course not found");
    }

    res.json({ data: course });
  })
);

router.post(
  "/instructor/courses",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);
    const slug = requireTrimmedString(req.body.slug, "Slug", { min: 3, max: 120 });
    const title = requireTrimmedString(req.body.title, "Title", { min: 3, max: 180 });
    const shortDescription = requireTrimmedString(req.body.shortDescription, "Short description", { min: 10, max: 400 });
    const level = requireTrimmedString(req.body.level, "Level", { min: 3, max: 40 });

    const course = await prisma.course.create({
      data: {
        ...pickFields(req.body, editableCourseFields),
        slug,
        title,
        shortDescription,
        level,
        trailerUrl: optionalUrl(req.body.trailerUrl, "Trailer URL"),
        thumbnailUrl: optionalUrl(req.body.thumbnailUrl, "Thumbnail URL"),
        subtitle: optionalTrimmedString(req.body.subtitle, { max: 220 }),
        fullDescription: optionalTrimmedString(req.body.fullDescription, { max: 10000 }),
        authorId: req.auth.userId,
        instructorId: instructor.id
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

    const data = pickFields(req.body, editableCourseFields);

    if ("slug" in data) data.slug = requireTrimmedString(data.slug, "Slug", { min: 3, max: 120 });
    if ("title" in data) data.title = requireTrimmedString(data.title, "Title", { min: 3, max: 180 });
    if ("shortDescription" in data) {
      data.shortDescription = requireTrimmedString(data.shortDescription, "Short description", { min: 10, max: 400 });
    }
    if ("level" in data) data.level = requireTrimmedString(data.level, "Level", { min: 3, max: 40 });
    if ("subtitle" in data) data.subtitle = optionalTrimmedString(data.subtitle, { max: 220 });
    if ("fullDescription" in data) data.fullDescription = optionalTrimmedString(data.fullDescription, { max: 10000 });
    if ("trailerUrl" in data) data.trailerUrl = optionalUrl(data.trailerUrl, "Trailer URL");
    if ("thumbnailUrl" in data) data.thumbnailUrl = optionalUrl(data.thumbnailUrl, "Thumbnail URL");

    const updatedCourse = await prisma.course.update({
      where: {
        id: course.id
      },
      data
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

router.patch(
  "/instructor/lessons/:lessonId",
  asyncHandler(async (req, res) => {
    const instructor = await resolveInstructorProfile(req.auth.userId);

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: req.params.lessonId,
        section: {
          is: {
            course: {
              is: {
                instructorId: instructor.id
              }
            }
          }
        }
      }
    });

    if (!lesson) {
      throw new HttpError(404, "Lesson not found");
    }

    const updates = {};

    if ("title" in req.body) {
      updates.title = requireTrimmedString(req.body.title, "Lesson title", { min: 2, max: 180 });
    }

    if ("slug" in req.body) {
      updates.slug = requireTrimmedString(req.body.slug, "Lesson slug", { min: 2, max: 180 });
    }

    if ("description" in req.body) {
      updates.description = optionalTrimmedString(req.body.description, { max: 2000 });
    }

    if ("videoUrl" in req.body) {
      updates.videoUrl = optionalUrl(req.body.videoUrl, "Video URL");
    }

    if ("articleContent" in req.body) {
      updates.articleContent = optionalTrimmedString(req.body.articleContent, { max: 20000 });
    }

    if ("durationMinutes" in req.body) {
      const duration = Number(req.body.durationMinutes);
      updates.durationMinutes = Number.isFinite(duration) && duration > 0 ? Math.floor(duration) : null;
    }

    if ("isPreview" in req.body) {
      updates.isPreview = Boolean(req.body.isPreview);
    }

    if ("attachments" in req.body) {
      updates.attachments = parseAttachments(req.body.attachments);
    }

    if (Object.keys(updates).length === 0) {
      throw new HttpError(400, "No lesson fields provided");
    }

    const updatedLesson = await prisma.lesson.update({
      where: {
        id: lesson.id
      },
      data: updates
    });

    res.json({ data: updatedLesson });
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
