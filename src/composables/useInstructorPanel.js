import { computed, onMounted, ref } from "vue";
import { apiRequest } from "@/lib/api";

export const useInstructorPanel = () => {
  const loading = ref(true);
  const error = ref(null);
  const overview = ref({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalReviews: 0
  });
  const courses = ref([]);
  const profile = ref({
    title: "",
    bio: "",
    photoUrl: "",
    expertise: "",
    websiteUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    githubUrl: "",
    youtubeUrl: ""
  });
  const courseFilters = ref({ search: "", status: "" });
  const courseEdits = ref({});
  const enrollments = ref([]);
  const enrollmentsLoading = ref(false);
  const selectedCourseId = ref("");

  const reloadOverview = async () => {
    const response = await apiRequest("/instructor/dashboard/overview", { auth: true });
    overview.value = response.data || overview.value;
  };

  const reloadProfile = async () => {
    const response = await apiRequest("/instructor/me/profile", { auth: true });
    const data = response.data || {};
    profile.value = {
      title: data.title || "",
      bio: data.bio || "",
      photoUrl: data.photoUrl || "",
      expertise: Array.isArray(data.expertise) ? data.expertise.join(", ") : "",
      websiteUrl: data.websiteUrl || "",
      linkedinUrl: data.linkedinUrl || "",
      twitterUrl: data.twitterUrl || "",
      githubUrl: data.githubUrl || "",
      youtubeUrl: data.youtubeUrl || ""
    };
  };

  const reloadCourses = async () => {
    const response = await apiRequest("/instructor/courses", { auth: true });
    courses.value = response.data || [];
    courseEdits.value = courses.value.reduce((acc, course) => {
      acc[course.id] = { status: course.status };
      return acc;
    }, {});
  };

  const loadEnrollments = async (courseId) => {
    if (!courseId) return;
    enrollmentsLoading.value = true;
    selectedCourseId.value = courseId;
    try {
      const response = await apiRequest(`/instructor/courses/${courseId}/enrollments`, { auth: true });
      enrollments.value = response.data || [];
    } catch (err) {
      error.value = err.message;
    } finally {
      enrollmentsLoading.value = false;
    }
  };

  const reload = async () => {
    loading.value = true;
    error.value = null;
    try {
      await Promise.all([reloadOverview(), reloadCourses(), reloadProfile()]);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const updateCourseStatus = async (courseId) => {
    const status = courseEdits.value[courseId]?.status;
    if (!status) return;
    try {
      await apiRequest(`/instructor/courses/${courseId}/status`, {
        method: "PATCH",
        auth: true,
        body: { status }
      });
      await reloadCourses();
    } catch (err) {
      error.value = err.message;
    }
  };

  const updateCourseFields = async (courseId, fields) => {
    try {
      await apiRequest(`/instructor/courses/${courseId}`, {
        method: "PATCH",
        auth: true,
        body: {
          title: fields.title,
          shortDescription: fields.shortDescription,
          level: fields.level,
          price: fields.price === "" ? null : Number(fields.price),
          thumbnailUrl: fields.thumbnailUrl || null
        }
      });
      await reloadCourses();
    } catch (err) {
      error.value = err.message;
    }
  };

  const createCourse = async (payload) => {
    await apiRequest("/instructor/courses", {
      method: "POST",
      auth: true,
      body: payload
    });
    await reloadCourses();
  };


  const updateProfile = async (payload) => {
    try {
      await apiRequest("/instructor/me/profile", {
        method: "PATCH",
        auth: true,
        body: {
          title: payload.title,
          bio: payload.bio,
          photoUrl: payload.photoUrl || null,
          expertise: payload.expertise
            ? payload.expertise.split(",").map((item) => item.trim()).filter(Boolean)
            : [],
          websiteUrl: payload.websiteUrl || null,
          linkedinUrl: payload.linkedinUrl || null,
          twitterUrl: payload.twitterUrl || null,
          githubUrl: payload.githubUrl || null,
          youtubeUrl: payload.youtubeUrl || null
        }
      });
      await reloadProfile();
    } catch (err) {
      error.value = err.message;
    }
  };

  const recentCourses = computed(() => courses.value.slice(0, 5));
  const healthCourses = computed(() => courses.value.slice(0, 3));
  const filteredCourses = computed(() => {
    const search = courseFilters.value.search.trim().toLowerCase();
    const status = courseFilters.value.status;
    return courses.value.filter((course) => {
      const matchesSearch =
        !search ||
        course.title?.toLowerCase().includes(search) ||
        course.slug?.toLowerCase().includes(search);
      const matchesStatus = !status || course.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  onMounted(reload);

  return {
    loading,
    error,
    overview,
    courses,
    profile,
    courseFilters,
    courseEdits,
    filteredCourses,
    enrollments,
    enrollmentsLoading,
    selectedCourseId,
    recentCourses,
    healthCourses,
    reload,
    updateCourseStatus,
    loadEnrollments,
    updateCourseFields,
    updateProfile,
    createCourse
  };
};
