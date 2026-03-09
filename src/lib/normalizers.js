import { avatarDataUri } from "./avatar";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatDateLabel = (value) => {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

const avatarFromName = (name) => {
  return avatarDataUri(name || "User");
};

export const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    displayName: user.name,
    photoURL: user.avatarUrl || "",
    user_metadata: {
      displayName: user.name,
      photoURL: user.avatarUrl || ""
    }
  };
};

export const normalizeReview = (review) => {
  const reviewerName = review?.user?.name || review?.name || "Student";

  return {
    id: review.id,
    name: reviewerName,
    avatar: review?.user?.avatarUrl || review?.avatar || avatarFromName(reviewerName),
    rating: toNumber(review.rating),
    date: formatDateLabel(review.createdAt || review.created_at),
    title: review.title || "Student Review",
    content: review.comment || review.content || ""
  };
};

export const normalizeCourse = (course) => {
  const sections = course.sections || [];
  const lessons = sections.reduce((total, section) => total + (section.lessons?.length || 0), 0);
  const instructorName = course.instructor?.user?.name || course.instructor?.name || course.instructor || "Unknown Instructor";
  const rating = toNumber(course.averageRating ?? course.rating);
  const salePrice = course.salePrice !== null && course.salePrice !== undefined ? toNumber(course.salePrice) : null;
  const fullPrice = toNumber(course.price);

  return {
    ...course,
    image: course.thumbnailUrl || course.image || "",
    description: course.shortDescription || course.description || "",
    descriptionExtended: course.subtitle || course.shortDescription || "",
    fullDescription: course.fullDescription || course.shortDescription || "",
    rating,
    reviewCount: course.reviewCount ?? course.reviews?.length ?? 0,
    reviews: Array.isArray(course.reviews) ? course.reviews.map(normalizeReview) : [],
    students: course.studentCount ?? course.students ?? 0,
    lessons,
    duration: course.durationText || course.duration || (course.durationMinutes ? `${course.durationMinutes} min` : "N/A"),
    price: salePrice ?? fullPrice,
    originalPrice: salePrice !== null ? fullPrice : null,
    category: course.category?.name || course.category || "",
    categorySlug: course.category?.slug || null,
    tags: course.tags || [],
    isPopular: Boolean(course.isPopular ?? course.is_popular),
    isFeatured: Boolean(course.isFeatured ?? course.is_featured),
    isNew: Boolean(course.isNew ?? course.is_new),
    createdAt: course.createdAt || course.created_at,
    instructor: instructorName,
    instructorName,
    instructorImage: course.instructor?.photoUrl || course.instructorImage || avatarFromName(instructorName),
    instructorBio: course.instructor?.bio || course.instructorBio || "",
    instructorRating: toNumber(course.instructor?.averageRating ?? course.instructorRating ?? rating),
    instructorReviews: course.instructor?.totalReviews ?? course.instructorReviews ?? 0,
    Language: course.language || "English",
    certificate: Boolean(course.certificateEnabled ?? course.certificate),
    sections: sections.map((section) => ({
      ...section,
      lessons: (section.lessons || []).map((lesson) => ({
        ...lesson,
        duration: lesson.durationMinutes ? `${lesson.durationMinutes} min` : "N/A"
      }))
    }))
  };
};

export const normalizeEnrollment = (enrollment) => {
  const course = normalizeCourse(enrollment.course);
  const completedLessonIds = new Set(
    (enrollment.lessonProgress || []).filter((entry) => entry.isCompleted).map((entry) => entry.lessonId)
  );
  const sections = (enrollment.course?.sections || []).map((section) => ({
    id: section.id,
    title: section.title,
    position: section.position,
    lessons: (section.lessons || []).map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      sectionId: lesson.sectionId,
      position: lesson.position,
      durationMinutes: lesson.durationMinutes || 0,
      duration: lesson.durationMinutes ? `${lesson.durationMinutes} min` : "N/A",
      isCompleted: completedLessonIds.has(lesson.id)
    }))
  }));

  return {
    ...course,
    enrollmentId: enrollment.id,
    progress: enrollment.progressPercent ?? 0,
    sections,
    completedLessonIds: Array.from(completedLessonIds),
    enrolled_at: enrollment.enrolledAt || enrollment.enrolled_at,
    completed_at: enrollment.completedAt || enrollment.completed_at,
    last_accessed_at: enrollment.lastAccessedAt || enrollment.last_accessed_at
  };
};

export const normalizeBlogPost = (post) => ({
  ...post,
  image: post.coverImageUrl || post.image || "",
  excerpt: post.snippet,
  category: post.tags?.[0] || "Article",
  published_at: post.publishedAt || post.published_at,
  isFeatured: Boolean(post.isFeatured ?? post.is_featured),
  authorName: post.author?.name || post.author || "Team"
});

export const normalizeInstructor = (instructor) => {
  const name = instructor.user?.name || instructor.name || "Instructor";

  return {
    ...instructor,
    name,
    photo: instructor.photoUrl || instructor.photo || avatarFromName(name),
    isFeatured: Boolean(instructor.isFeatured ?? instructor.is_featured),
    socialLinks: [
      instructor.linkedinUrl
        ? { platform: "LinkedIn", url: instructor.linkedinUrl, iconClass: "fab fa-linkedin" }
        : null,
      instructor.githubUrl
        ? { platform: "GitHub", url: instructor.githubUrl, iconClass: "fab fa-github" }
        : null,
      instructor.twitterUrl
        ? { platform: "Twitter", url: instructor.twitterUrl, iconClass: "fab fa-twitter" }
        : null,
      instructor.websiteUrl
        ? { platform: "Website", url: instructor.websiteUrl, iconClass: "fas fa-globe" }
        : null
    ].filter(Boolean)
  };
};

export const normalizeTestimonial = (testimonial) => ({
  ...testimonial,
  photo: testimonial.photoUrl || testimonial.photo || avatarFromName(testimonial.name),
  avatar: testimonial.photoUrl || testimonial.photo || avatarFromName(testimonial.name),
  role: testimonial.title || testimonial.role || "Student",
  isFeatured: Boolean(testimonial.isFeatured ?? testimonial.is_featured)
});

const defaultPathImage = (level) => {
  const images = {
    BEGINNER: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    INTERMEDIATE: "https://images.unsplash.com/photo-1516321310764-8d5e3c1e2d60?auto=format&fit=crop&w=900&q=80",
    ADVANCED: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80"
  };

  return images[level] || images.INTERMEDIATE;
};

export const normalizeLearningPath = (path) => {
  const level = String(path.level || "").toUpperCase();
  const normalizedCourses = (path.courses || []).map((item) => ({
    ...item,
    course: normalizeCourse(item.course)
  }));
  const fallbackImage = defaultPathImage(level);

  return {
    ...path,
    level: String(path.level || "").toLowerCase(),
    icon: path.icon && path.icon.startsWith("http") ? path.icon : path.imageUrl || fallbackImage,
    image: path.imageUrl || fallbackImage,
    duration: path.estimatedDuration || path.duration || "N/A",
    courses: path._count?.courses ?? normalizedCourses.length ?? path.courseCount ?? 0,
    curriculum: normalizedCourses.map((item, index) => ({
      id: item.course.id,
      module: index + 1,
      title: item.course.title,
      lessons: item.course.sections.flatMap((section) =>
        section.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration
        }))
      )
    })),
    linkedCourses: normalizedCourses.map((item) => item.course),
    projects: path.projects || [],
    skills: path.skills || [],
    features: path.features || [],
    testimonials: (path.testimonials || []).map(normalizeTestimonial),
    isFeatured: Boolean(path.isFeatured ?? path.is_featured)
  };
};
