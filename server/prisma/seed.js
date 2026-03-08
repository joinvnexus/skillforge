import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const passwordHash = await bcrypt.hash("password123", 12);

const syncCourseStats = async (courseId) => {
  const [reviewAggregate, studentCount] = await Promise.all([
    prisma.review.aggregate({
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
    }),
    prisma.enrollment.count({
      where: {
        courseId,
        status: {
          in: ["ACTIVE", "COMPLETED"]
        }
      }
    })
  ]);

  await prisma.course.update({
    where: {
      id: courseId
    },
    data: {
      averageRating: reviewAggregate._avg.rating || 0,
      reviewCount: reviewAggregate._count._all,
      studentCount
    }
  });
};

const syncInstructorStats = async (instructorId) => {
  const courses = await prisma.course.findMany({
    where: {
      instructorId
    },
    select: {
      studentCount: true,
      reviewCount: true,
      averageRating: true
    }
  });

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((sum, course) => sum + course.studentCount, 0);
  const totalReviews = courses.reduce((sum, course) => sum + course.reviewCount, 0);
  const weightedRatingSum = courses.reduce((sum, course) => sum + Number(course.averageRating) * course.reviewCount, 0);
  const averageRating = totalReviews === 0 ? 0 : weightedRatingSum / totalReviews;

  await prisma.instructorProfile.update({
    where: {
      id: instructorId
    },
    data: {
      totalCourses,
      totalStudents,
      totalReviews,
      averageRating
    }
  });
};

const main = async () => {
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@skillshare.local"
    },
    update: {
      name: "Platform Admin",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      headline: "Platform administrator"
    },
    create: {
      name: "Platform Admin",
      email: "admin@skillshare.local",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      headline: "Platform administrator"
    }
  });

  const instructorUser = await prisma.user.upsert({
    where: {
      email: "instructor@skillshare.local"
    },
    update: {
      name: "Ariana Malik",
      passwordHash,
      role: "INSTRUCTOR",
      status: "ACTIVE",
      headline: "Senior Frontend Engineer and course instructor",
      bio: "Builds production Vue and design system workflows."
    },
    create: {
      name: "Ariana Malik",
      email: "instructor@skillshare.local",
      passwordHash,
      role: "INSTRUCTOR",
      status: "ACTIVE",
      headline: "Senior Frontend Engineer and course instructor",
      bio: "Builds production Vue and design system workflows."
    }
  });

  const studentUser = await prisma.user.upsert({
    where: {
      email: "student@skillshare.local"
    },
    update: {
      name: "Nafis Rahman",
      passwordHash,
      role: "STUDENT",
      status: "ACTIVE",
      headline: "Frontend learner"
    },
    create: {
      name: "Nafis Rahman",
      email: "student@skillshare.local",
      passwordHash,
      role: "STUDENT",
      status: "ACTIVE",
      headline: "Frontend learner"
    }
  });

  const instructorProfile = await prisma.instructorProfile.upsert({
    where: {
      userId: instructorUser.id
    },
    update: {
      title: "Senior Frontend Engineer",
      bio: "Teaches Vue, component architecture, API integration, and product UI systems.",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      expertise: ["Vue", "Design Systems", "API Integration", "Frontend Architecture"],
      isActive: true,
      isFeatured: true,
      displayOrder: 1
    },
    create: {
      userId: instructorUser.id,
      title: "Senior Frontend Engineer",
      bio: "Teaches Vue, component architecture, API integration, and product UI systems.",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      expertise: ["Vue", "Design Systems", "API Integration", "Frontend Architecture"],
      isActive: true,
      isFeatured: true,
      displayOrder: 1
    }
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: {
        slug: "web-development"
      },
      update: {
        name: "Web Development",
        description: "Build modern web apps with production-ready tools.",
        displayOrder: 1
      },
      create: {
        name: "Web Development",
        slug: "web-development",
        description: "Build modern web apps with production-ready tools.",
        displayOrder: 1
      }
    }),
    prisma.category.upsert({
      where: {
        slug: "ui-ux-design"
      },
      update: {
        name: "UI/UX Design",
        description: "Create usable, polished, and scalable interfaces.",
        displayOrder: 2
      },
      create: {
        name: "UI/UX Design",
        slug: "ui-ux-design",
        description: "Create usable, polished, and scalable interfaces.",
        displayOrder: 2
      }
    }),
    prisma.category.upsert({
      where: {
        slug: "data-analytics"
      },
      update: {
        name: "Data Analytics",
        description: "Turn data into dashboards, insights, and decisions.",
        displayOrder: 3
      },
      create: {
        name: "Data Analytics",
        slug: "data-analytics",
        description: "Turn data into dashboards, insights, and decisions.",
        displayOrder: 3
      }
    })
  ]);

  const categoryBySlug = Object.fromEntries(categories.map((category) => [category.slug, category]));

  const courseDefinitions = [
    {
      slug: "fullstack-vue-prisma",
      title: "Fullstack Vue With Prisma",
      subtitle: "Build a role-based learning platform from scratch",
      shortDescription: "Learn Vue frontend patterns, Express APIs, and Prisma-backed PostgreSQL workflows.",
      fullDescription:
        "This course walks through a realistic LMS build with authentication, role guards, schema design, and dashboard-driven UI architecture.",
      price: "149.00",
      salePrice: "89.00",
      level: "Intermediate",
      durationText: "8 weeks",
      durationMinutes: 960,
      language: "English",
      thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      trailerUrl: "https://example.com/trailers/fullstack-vue-prisma",
      tags: ["Vue", "Prisma", "Express", "PostgreSQL"],
      features: ["Real project build", "Auth and roles", "Dashboard architecture", "Production schema design"],
      prerequisites: ["Basic JavaScript", "Vue fundamentals", "REST API basics"],
      categorySlug: "web-development",
      isFeatured: true,
      isPopular: true,
      certificateEnabled: true,
      sections: [
        {
          title: "Platform Foundation",
          description: "Plan the product, schema, and backend boundary.",
          lessons: [
            {
              slug: "project-architecture",
              title: "Project Architecture",
              description: "Understand the frontend, API, and database split.",
              type: "VIDEO",
              durationMinutes: 18,
              isPreview: true
            },
            {
              slug: "database-planning",
              title: "Database Planning",
              description: "Map product features to normalized entities.",
              type: "VIDEO",
              durationMinutes: 26,
              isPreview: false
            }
          ]
        },
        {
          title: "Auth and Roles",
          description: "Implement login, sessions, and role checks.",
          lessons: [
            {
              slug: "jwt-session-flow",
              title: "JWT and Refresh Session Flow",
              description: "Build short-lived access tokens with persistent refresh sessions.",
              type: "VIDEO",
              durationMinutes: 29,
              isPreview: false
            },
            {
              slug: "role-protected-routes",
              title: "Role Protected Routes",
              description: "Gate student, instructor, and admin APIs cleanly.",
              type: "ARTICLE",
              durationMinutes: 22,
              isPreview: false
            }
          ]
        }
      ],
      faqs: [
        {
          question: "Is this beginner friendly?",
          answer: "This course is best for learners who already know Vue basics and want to move into fullstack product work."
        },
        {
          question: "Does this include admin and instructor roles?",
          answer: "Yes, the sample project covers student, instructor, and admin roles."
        }
      ]
    },
    {
      slug: "design-systems-for-product-teams",
      title: "Design Systems For Product Teams",
      subtitle: "Scale UI without design debt",
      shortDescription: "Structure components, tokens, and documentation for fast-moving product teams.",
      fullDescription:
        "A practical course for teams that want maintainable UI systems across dashboards, marketing pages, and shared components.",
      price: "119.00",
      salePrice: "69.00",
      level: "Beginner",
      durationText: "5 weeks",
      durationMinutes: 620,
      language: "English",
      thumbnailUrl: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
      trailerUrl: "https://example.com/trailers/design-systems",
      tags: ["Design Systems", "UI", "Figma", "Tokens"],
      features: ["Component thinking", "Token strategy", "UI governance"],
      prerequisites: ["Basic UI design knowledge"],
      categorySlug: "ui-ux-design",
      isFeatured: true,
      isPopular: false,
      certificateEnabled: true,
      sections: [
        {
          title: "Design System Basics",
          description: "Set the foundation for reusable interface systems.",
          lessons: [
            {
              slug: "ui-inventory",
              title: "UI Inventory",
              description: "Audit the repeated interface patterns in a product.",
              type: "VIDEO",
              durationMinutes: 16,
              isPreview: true
            },
            {
              slug: "token-strategy",
              title: "Token Strategy",
              description: "Create scalable tokens for typography, spacing, and color.",
              type: "VIDEO",
              durationMinutes: 21,
              isPreview: false
            }
          ]
        }
      ],
      faqs: [
        {
          question: "Do I need Figma?",
          answer: "Figma helps, but the concepts work with any design workflow."
        }
      ]
    },
    {
      slug: "practical-product-analytics",
      title: "Practical Product Analytics",
      subtitle: "Measure learner behavior and feature impact",
      shortDescription: "Learn metrics, dashboards, cohort thinking, and product reporting basics.",
      fullDescription:
        "Turn product activity into decision-ready dashboards using clean analytical thinking and practical reporting patterns.",
      price: "99.00",
      salePrice: "59.00",
      level: "Intermediate",
      durationText: "4 weeks",
      durationMinutes: 480,
      language: "English",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      trailerUrl: "https://example.com/trailers/product-analytics",
      tags: ["Analytics", "Dashboards", "KPIs", "Reporting"],
      features: ["Metrics framework", "Dashboard design", "Decision reporting"],
      prerequisites: ["Spreadsheet basics", "Comfort reading charts"],
      categorySlug: "data-analytics",
      isFeatured: false,
      isPopular: true,
      certificateEnabled: true,
      sections: [
        {
          title: "Analytics Foundations",
          description: "Choose useful metrics and avoid vanity reporting.",
          lessons: [
            {
              slug: "north-star-metric",
              title: "North Star Metric",
              description: "Choose the metric that aligns with product value.",
              type: "VIDEO",
              durationMinutes: 17,
              isPreview: true
            }
          ]
        }
      ],
      faqs: [
        {
          question: "Is SQL required?",
          answer: "Not for the conceptual modules, but it becomes useful as you go deeper."
        }
      ]
    }
  ];

  const courses = [];

  for (const definition of courseDefinitions) {
    const course = await prisma.course.upsert({
      where: {
        slug: definition.slug
      },
      update: {
        title: definition.title,
        subtitle: definition.subtitle,
        shortDescription: definition.shortDescription,
        fullDescription: definition.fullDescription,
        price: definition.price,
        salePrice: definition.salePrice,
        currency: "USD",
        level: definition.level,
        language: definition.language,
        durationText: definition.durationText,
        durationMinutes: definition.durationMinutes,
        thumbnailUrl: definition.thumbnailUrl,
        trailerUrl: definition.trailerUrl,
        tags: definition.tags,
        features: definition.features,
        prerequisites: definition.prerequisites,
        status: "PUBLISHED",
        isFeatured: definition.isFeatured,
        isPopular: definition.isPopular,
        certificateEnabled: definition.certificateEnabled,
        publishedAt: new Date("2026-03-08T00:00:00.000Z"),
        categoryId: categoryBySlug[definition.categorySlug].id,
        instructorId: instructorProfile.id,
        authorId: instructorUser.id
      },
      create: {
        slug: definition.slug,
        title: definition.title,
        subtitle: definition.subtitle,
        shortDescription: definition.shortDescription,
        fullDescription: definition.fullDescription,
        price: definition.price,
        salePrice: definition.salePrice,
        currency: "USD",
        level: definition.level,
        language: definition.language,
        durationText: definition.durationText,
        durationMinutes: definition.durationMinutes,
        thumbnailUrl: definition.thumbnailUrl,
        trailerUrl: definition.trailerUrl,
        tags: definition.tags,
        features: definition.features,
        prerequisites: definition.prerequisites,
        status: "PUBLISHED",
        isFeatured: definition.isFeatured,
        isPopular: definition.isPopular,
        certificateEnabled: definition.certificateEnabled,
        publishedAt: new Date("2026-03-08T00:00:00.000Z"),
        categoryId: categoryBySlug[definition.categorySlug].id,
        instructorId: instructorProfile.id,
        authorId: instructorUser.id
      }
    });

    await prisma.courseFaq.deleteMany({
      where: {
        courseId: course.id
      }
    });

    await prisma.courseSection.deleteMany({
      where: {
        courseId: course.id
      }
    });

    for (let index = 0; index < definition.sections.length; index += 1) {
      const sectionDefinition = definition.sections[index];

      const section = await prisma.courseSection.create({
        data: {
          courseId: course.id,
          title: sectionDefinition.title,
          description: sectionDefinition.description,
          position: index + 1
        }
      });

      for (let lessonIndex = 0; lessonIndex < sectionDefinition.lessons.length; lessonIndex += 1) {
        const lessonDefinition = sectionDefinition.lessons[lessonIndex];

        await prisma.lesson.create({
          data: {
            sectionId: section.id,
            slug: lessonDefinition.slug,
            title: lessonDefinition.title,
            description: lessonDefinition.description,
            type: lessonDefinition.type,
            durationMinutes: lessonDefinition.durationMinutes,
            isPreview: lessonDefinition.isPreview,
            position: lessonIndex + 1,
            videoUrl:
              lessonDefinition.type === "VIDEO"
                ? `https://example.com/lessons/${lessonDefinition.slug}`
                : null,
            articleContent:
              lessonDefinition.type === "ARTICLE"
                ? `Article notes for ${lessonDefinition.title}`
                : null
          }
        });
      }
    }

    await prisma.courseFaq.createMany({
      data: definition.faqs.map((faq, index) => ({
        courseId: course.id,
        question: faq.question,
        answer: faq.answer,
        position: index + 1
      }))
    });

    courses.push(course);
  }

  const [courseOne, courseTwo, courseThree] = courses;

  const learningPath = await prisma.learningPath.upsert({
    where: {
      slug: "frontend-engineer-path"
    },
    update: {
      level: "INTERMEDIATE",
      title: "Frontend Engineer Path",
      description: "A focused path covering UI systems, fullstack frontend architecture, and product delivery.",
      icon: "layers",
      imageUrl: "https://images.unsplash.com/photo-1516321310764-8d5e3c1e2d60?auto=format&fit=crop&w=1200&q=80",
      estimatedDuration: "12 weeks",
      features: ["Role-based app project", "System thinking", "Portfolio-ready build"],
      skills: ["Vue", "Component architecture", "API integration", "Design systems"],
      projects: [
        {
          title: "LMS Dashboard",
          description: "Build a multi-role learning platform dashboard."
        }
      ],
      isPublished: true,
      isFeatured: true,
      displayOrder: 1
    },
    create: {
      slug: "frontend-engineer-path",
      level: "INTERMEDIATE",
      title: "Frontend Engineer Path",
      description: "A focused path covering UI systems, fullstack frontend architecture, and product delivery.",
      icon: "layers",
      imageUrl: "https://images.unsplash.com/photo-1516321310764-8d5e3c1e2d60?auto=format&fit=crop&w=1200&q=80",
      estimatedDuration: "12 weeks",
      features: ["Role-based app project", "System thinking", "Portfolio-ready build"],
      skills: ["Vue", "Component architecture", "API integration", "Design systems"],
      projects: [
        {
          title: "LMS Dashboard",
          description: "Build a multi-role learning platform dashboard."
        }
      ],
      isPublished: true,
      isFeatured: true,
      displayOrder: 1
    }
  });

  await prisma.learningPathCourse.deleteMany({
    where: {
      learningPathId: learningPath.id
    }
  });

  await prisma.learningPathCourse.createMany({
    data: [
      {
        learningPathId: learningPath.id,
        courseId: courseTwo.id,
        moduleOrder: 1,
        isRequired: true
      },
      {
        learningPathId: learningPath.id,
        courseId: courseOne.id,
        moduleOrder: 2,
        isRequired: true
      },
      {
        learningPathId: learningPath.id,
        courseId: courseThree.id,
        moduleOrder: 3,
        isRequired: false
      }
    ]
  });

  await prisma.blogPost.upsert({
    where: {
      slug: "why-role-based-lms-architecture-matters"
    },
    update: {
      authorId: admin.id,
      title: "Why Role-Based LMS Architecture Matters",
      snippet: "Student, instructor, and admin workflows break down fast without clear backend boundaries.",
      content:
        "A production LMS needs role-aware APIs, clear ownership rules, and a schema that separates content management from learner progress.",
      coverImageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      status: "PUBLISHED",
      isFeatured: true,
      tags: ["Architecture", "LMS", "Backend"],
      readingTimeMinutes: 6,
      publishedAt: new Date("2026-03-08T00:00:00.000Z"),
      seoTitle: "Role-based LMS architecture",
      seoDescription: "Understand the backend patterns behind scalable learning platforms."
    },
    create: {
      authorId: admin.id,
      title: "Why Role-Based LMS Architecture Matters",
      slug: "why-role-based-lms-architecture-matters",
      snippet: "Student, instructor, and admin workflows break down fast without clear backend boundaries.",
      content:
        "A production LMS needs role-aware APIs, clear ownership rules, and a schema that separates content management from learner progress.",
      coverImageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      status: "PUBLISHED",
      isFeatured: true,
      tags: ["Architecture", "LMS", "Backend"],
      readingTimeMinutes: 6,
      publishedAt: new Date("2026-03-08T00:00:00.000Z"),
      seoTitle: "Role-based LMS architecture",
      seoDescription: "Understand the backend patterns behind scalable learning platforms."
    }
  });

  const order = await prisma.order.upsert({
    where: {
      orderNumber: "ORD-1001"
    },
    update: {
      userId: studentUser.id,
      status: "PAID",
      paymentMethod: "CARD",
      subtotal: "89.00",
      discountAmount: "0.00",
      totalAmount: "89.00",
      currency: "USD",
      paymentReference: "demo-payment-1001",
      paidAt: new Date("2026-03-08T10:00:00.000Z")
    },
    create: {
      orderNumber: "ORD-1001",
      userId: studentUser.id,
      status: "PAID",
      paymentMethod: "CARD",
      subtotal: "89.00",
      discountAmount: "0.00",
      totalAmount: "89.00",
      currency: "USD",
      paymentReference: "demo-payment-1001",
      paidAt: new Date("2026-03-08T10:00:00.000Z")
    }
  });

  await prisma.orderItem.upsert({
    where: {
      orderId_courseId: {
        orderId: order.id,
        courseId: courseOne.id
      }
    },
    update: {
      unitPrice: "89.00",
      discountAmount: "0.00",
      totalPrice: "89.00"
    },
    create: {
      orderId: order.id,
      courseId: courseOne.id,
      unitPrice: "89.00",
      discountAmount: "0.00",
      totalPrice: "89.00"
    }
  });

  const enrollmentOne = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: studentUser.id,
        courseId: courseOne.id
      }
    },
    update: {
      orderId: order.id,
      status: "ACTIVE",
      progressPercent: 50,
      lastAccessedAt: new Date("2026-03-08T12:00:00.000Z")
    },
    create: {
      userId: studentUser.id,
      courseId: courseOne.id,
      orderId: order.id,
      status: "ACTIVE",
      progressPercent: 50,
      lastAccessedAt: new Date("2026-03-08T12:00:00.000Z")
    }
  });

  const enrollmentTwo = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: studentUser.id,
        courseId: courseTwo.id
      }
    },
    update: {
      status: "COMPLETED",
      progressPercent: 100,
      completedAt: new Date("2026-03-06T15:00:00.000Z"),
      lastAccessedAt: new Date("2026-03-06T15:00:00.000Z")
    },
    create: {
      userId: studentUser.id,
      courseId: courseTwo.id,
      status: "COMPLETED",
      progressPercent: 100,
      completedAt: new Date("2026-03-06T15:00:00.000Z"),
      lastAccessedAt: new Date("2026-03-06T15:00:00.000Z")
    }
  });

  const firstSection = await prisma.courseSection.findFirst({
    where: {
      courseId: courseOne.id,
      position: 1
    },
    include: {
      lessons: {
        orderBy: {
          position: "asc"
        }
      }
    }
  });

  if (firstSection?.lessons[0]) {
    await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollmentOne.id,
          lessonId: firstSection.lessons[0].id
        }
      },
      update: {
        isCompleted: true,
        watchSeconds: 820,
        completedAt: new Date("2026-03-08T11:30:00.000Z")
      },
      create: {
        enrollmentId: enrollmentOne.id,
        lessonId: firstSection.lessons[0].id,
        isCompleted: true,
        watchSeconds: 820,
        completedAt: new Date("2026-03-08T11:30:00.000Z")
      }
    });
  }

  await prisma.review.upsert({
    where: {
      userId_courseId: {
        userId: studentUser.id,
        courseId: courseOne.id
      }
    },
    update: {
      rating: 5,
      comment: "Very practical course. The API and role design parts are especially useful."
    },
    create: {
      userId: studentUser.id,
      courseId: courseOne.id,
      rating: 5,
      comment: "Very practical course. The API and role design parts are especially useful."
    }
  });

  await prisma.review.upsert({
    where: {
      userId_courseId: {
        userId: studentUser.id,
        courseId: courseTwo.id
      }
    },
    update: {
      rating: 4,
      comment: "Strong foundation for building cleaner UI systems."
    },
    create: {
      userId: studentUser.id,
      courseId: courseTwo.id,
      rating: 4,
      comment: "Strong foundation for building cleaner UI systems."
    }
  });

  await prisma.wishlistItem.upsert({
    where: {
      userId_courseId: {
        userId: studentUser.id,
        courseId: courseThree.id
      }
    },
    update: {},
    create: {
      userId: studentUser.id,
      courseId: courseThree.id
    }
  });

  await prisma.notification.upsert({
    where: {
      id: "11111111-1111-1111-1111-111111111111"
    },
    update: {
      userId: studentUser.id,
      type: "ENROLLMENT",
      title: "Welcome back",
      message: "Continue your Fullstack Vue With Prisma course from the last lesson.",
      linkUrl: `/courses/${courseOne.slug}`,
      isRead: false
    },
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      userId: studentUser.id,
      type: "ENROLLMENT",
      title: "Welcome back",
      message: "Continue your Fullstack Vue With Prisma course from the last lesson.",
      linkUrl: `/courses/${courseOne.slug}`,
      isRead: false
    }
  });

  await prisma.testimonial.deleteMany({
    where: {
      OR: [
        { name: "Nafis Rahman" },
        { name: "Tania Ahmed" }
      ]
    }
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Nafis Rahman",
        title: "Frontend Learner",
        quote: "This dataset made it easy to test student dashboard, enrollments, and review flows immediately.",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        rating: 5,
        isApproved: true,
        isFeatured: true,
        courseId: courseOne.id,
        learningPathId: learningPath.id,
        instructorId: instructorProfile.id,
        userId: studentUser.id
      },
      {
        name: "Tania Ahmed",
        title: "Junior Product Designer",
        quote: "The seeded design system course is enough to test cards, details pages, and learning path UI.",
        photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
        rating: 4,
        isApproved: true,
        isFeatured: false,
        courseId: courseTwo.id,
        learningPathId: learningPath.id,
        instructorId: instructorProfile.id
      }
    ]
  });

  await Promise.all(courses.map((course) => syncCourseStats(course.id)));
  await syncInstructorStats(instructorProfile.id);

  console.log("Seed complete");
  console.log("Admin:", admin.email, "password123");
  console.log("Instructor:", instructorUser.email, "password123");
  console.log("Student:", studentUser.email, "password123");
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
