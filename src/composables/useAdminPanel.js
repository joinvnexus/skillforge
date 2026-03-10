import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { apiRequest } from "@/lib/api";

export const useAdminPanel = () => {
  const store = useStore();
  const loading = ref(true);
  const error = ref(null);
  const users = ref([]);
  const testimonials = ref([]);
  const orders = ref([]);
  const courses = ref([]);
  const learningPaths = ref([]);
  const blogs = ref([]);
  const userEdits = reactive({});
  const orderEdits = reactive({});
  const courseEdits = reactive({});
  const learningPathEdits = reactive({});
  const blogEdits = reactive({});
  const usersMeta = ref({ page: 1, totalPages: 1, total: 0 });
  const testimonialsMeta = ref({ page: 1, totalPages: 1, total: 0 });
  const ordersMeta = ref({ page: 1, totalPages: 1, total: 0 });
  const coursesMeta = ref({ page: 1, totalPages: 1, total: 0 });
  const learningPathsMeta = ref({ page: 1, totalPages: 1, total: 0 });
  const blogsMeta = ref({ page: 1, totalPages: 1, total: 0 });
  const userFilters = reactive({ page: 1, limit: 12, search: "", role: "", status: "" });
  const testimonialFilters = reactive({ page: 1, limit: 8, approved: "false", search: "" });
  const orderFilters = reactive({ page: 1, limit: 10, status: "", search: "" });
  const courseFilters = reactive({ page: 1, limit: 10, status: "", search: "" });
  const learningPathFilters = reactive({ page: 1, limit: 8, search: "", level: "", published: "" });
  const blogFilters = reactive({ page: 1, limit: 8, search: "", status: "" });
  const createLearningPathForm = reactive({
    slug: "",
    title: "",
    description: "",
    estimatedDuration: "",
    level: "BEGINNER",
    icon: "",
    imageUrl: "",
    featuresText: "",
    skillsText: "",
    projectsJson: "",
    displayOrder: 0,
    isPublished: false,
    isFeatured: false
  });
  const createBlogForm = reactive({
    title: "",
    slug: "",
    snippet: "",
    content: "",
    status: "DRAFT",
    isFeatured: false
  });

  const notify = (type, message) => store.dispatch("ui/notify", { type, message });

  const parseList = (value) =>
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const parseJson = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  };

  const primeFormState = () => {
    for (const user of users.value) {
      userEdits[user.id] = { role: user.role, status: user.status };
    }
    for (const order of orders.value) {
      orderEdits[order.id] = {
        status: order.status,
        paymentReference: order.paymentReference || ""
      };
    }
    for (const course of courses.value) {
      courseEdits[course.id] = {
        status: course.status
      };
    }
    for (const item of learningPaths.value) {
      learningPathEdits[item.id] = {
        title: item.title,
        level: item.level,
        estimatedDuration: item.estimatedDuration || "",
        icon: item.icon || "",
        imageUrl: item.imageUrl || "",
        featuresText: (item.features || []).join(", "),
        skillsText: (item.skills || []).join(", "),
        projectsJson: item.projects ? JSON.stringify(item.projects) : "",
        isPublished: Boolean(item.isPublished),
        isFeatured: Boolean(item.isFeatured),
        displayOrder: Number(item.displayOrder || 0)
      };
    }
    for (const blog of blogs.value) {
      blogEdits[blog.id] = {
        title: blog.title,
        status: blog.status,
        isFeatured: Boolean(blog.isFeatured)
      };
    }
  };

  const buildParams = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        params.set(key, String(value));
      }
    });
    return params.toString();
  };

  const reloadUsers = async () => {
    const usersRes = await apiRequest(`/admin/users?${buildParams(userFilters)}`, { auth: true });
    users.value = usersRes.data || [];
    usersMeta.value = usersRes.meta || { page: 1, totalPages: 1, total: 0 };
  };

  const reloadTestimonials = async () => {
    const testimonialsRes = await apiRequest(`/admin/testimonials?${buildParams(testimonialFilters)}`, { auth: true });
    testimonials.value = testimonialsRes.data || [];
    testimonialsMeta.value = testimonialsRes.meta || { page: 1, totalPages: 1, total: 0 };
  };

  const reloadOrders = async () => {
    const ordersRes = await apiRequest(`/admin/orders?${buildParams(orderFilters)}`, { auth: true });
    orders.value = ordersRes.data || [];
    ordersMeta.value = ordersRes.meta || { page: 1, totalPages: 1, total: 0 };
  };

  const reloadCourses = async () => {
    const response = await apiRequest(`/admin/courses?${buildParams(courseFilters)}`, { auth: true });
    courses.value = response.data || [];
    coursesMeta.value = response.meta || { page: 1, totalPages: 1, total: 0 };
  };

  const reloadLearningPaths = async () => {
    const response = await apiRequest(`/admin/learning-paths?${buildParams(learningPathFilters)}`, { auth: true });
    learningPaths.value = response.data || [];
    learningPathsMeta.value = response.meta || { page: 1, totalPages: 1, total: 0 };
  };

  const reloadBlogs = async () => {
    const response = await apiRequest(`/admin/blogs?${buildParams(blogFilters)}`, { auth: true });
    blogs.value = response.data || [];
    blogsMeta.value = response.meta || { page: 1, totalPages: 1, total: 0 };
  };

  const reload = async () => {
    loading.value = true;
    error.value = null;
    try {
      await Promise.all([reloadUsers(), reloadTestimonials(), reloadOrders(), reloadCourses(), reloadLearningPaths(), reloadBlogs()]);
      primeFormState();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (userId) => {
    try {
      await apiRequest(`/admin/users/${userId}`, {
        method: "PATCH",
        auth: true,
        body: userEdits[userId]
      });
      await reloadUsers();
      notify("success", "User updated.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  const updateOrder = async (orderId) => {
    try {
      await apiRequest(`/admin/orders/${orderId}`, {
        method: "PATCH",
        auth: true,
        body: orderEdits[orderId]
      });
      await reloadOrders();
      notify("success", "Order updated.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  const updateCourseStatus = async (courseId, statusOverride = null) => {
    try {
      const status = statusOverride || courseEdits[courseId]?.status;
      if (!status) {
        notify("error", "Select a status first.");
        return;
      }
      await apiRequest(`/admin/courses/${courseId}/status`, {
        method: "PATCH",
        auth: true,
        body: { status }
      });
      await reloadCourses();
      primeFormState();
      notify("success", "Course status updated.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  const updateCourseDecision = async (courseId, payload) => {
    const status = payload?.status;
    const note = payload?.note;
    if (!status) {
      notify("error", "Select a decision status.");
      return;
    }
    try {
      await apiRequest(`/admin/courses/${courseId}/status`, {
        method: "PATCH",
        auth: true,
        body: { status, note }
      });
      await reloadCourses();
      primeFormState();
      notify("success", "Course decision saved.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  const updateCourseFields = async (courseId, fields) => {
    try {
      await apiRequest(`/admin/courses/${courseId}`, {
        method: "PATCH",
        auth: true,
        body: {
          title: fields.title,
          price: fields.price === "" ? null : Number(fields.price),
          salePrice: fields.salePrice === "" ? null : Number(fields.salePrice),
          thumbnailUrl: fields.thumbnailUrl || null
        }
      });
      await reloadCourses();
      primeFormState();
      notify("success", "Course updated.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  const approveTestimonial = async (id) => {
    try {
      await apiRequest(`/admin/testimonials/${id}`, {
        method: "PATCH",
        auth: true,
        body: { isApproved: true }
      });
      await reloadTestimonials();
      notify("success", "Testimonial approved.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  const toggleFeatured = async (item) => {
    try {
      await apiRequest(`/admin/testimonials/${item.id}`, {
        method: "PATCH",
        auth: true,
        body: { isFeatured: !item.isFeatured }
      });
      await reloadTestimonials();
      notify("success", item.isFeatured ? "Testimonial unfeatured." : "Testimonial featured.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  const setPageAndReload = async (filters, page, reloadFn, shouldPrime = false) => {
    filters.page = page;
    await reloadFn();
    if (shouldPrime) {
      primeFormState();
    }
  };

  const resetAndReload = async (filters, reloadFn, shouldPrime = false) => {
    filters.page = 1;
    await reloadFn();
    if (shouldPrime) {
      primeFormState();
    }
  };

  const changeUsersPage = (page) => setPageAndReload(userFilters, page, reloadUsers, true);
  const applyUserFilters = () => resetAndReload(userFilters, reloadUsers, true);

  const changeTestimonialsPage = (page) => setPageAndReload(testimonialFilters, page, reloadTestimonials);
  const applyTestimonialFilters = () => resetAndReload(testimonialFilters, reloadTestimonials);

  const changeOrdersPage = (page) => setPageAndReload(orderFilters, page, reloadOrders, true);
  const applyOrderFilters = () => resetAndReload(orderFilters, reloadOrders, true);

  const changeCoursesPage = (page) => setPageAndReload(courseFilters, page, reloadCourses, true);
  const applyCourseFilters = () => resetAndReload(courseFilters, reloadCourses, true);

  const changeLearningPathsPage = (page) => setPageAndReload(learningPathFilters, page, reloadLearningPaths, true);
  const applyLearningPathFilters = () => resetAndReload(learningPathFilters, reloadLearningPaths, true);

  const createLearningPath = async () => {
    try {
      await apiRequest("/admin/learning-paths", {
        method: "POST",
        auth: true,
        body: {
          slug: createLearningPathForm.slug.trim(),
          title: createLearningPathForm.title.trim(),
          description: createLearningPathForm.description.trim(),
          estimatedDuration: createLearningPathForm.estimatedDuration.trim(),
          level: createLearningPathForm.level,
          icon: createLearningPathForm.icon.trim() || null,
          imageUrl: createLearningPathForm.imageUrl.trim() || null,
          features: parseList(createLearningPathForm.featuresText),
          skills: parseList(createLearningPathForm.skillsText),
          projects: parseJson(createLearningPathForm.projectsJson),
          displayOrder: Number(createLearningPathForm.displayOrder || 0),
          isPublished: createLearningPathForm.isPublished,
          isFeatured: createLearningPathForm.isFeatured
        }
      });
      createLearningPathForm.slug = "";
      createLearningPathForm.title = "";
      createLearningPathForm.description = "";
      createLearningPathForm.estimatedDuration = "";
      createLearningPathForm.level = "BEGINNER";
      createLearningPathForm.icon = "";
      createLearningPathForm.imageUrl = "";
      createLearningPathForm.featuresText = "";
      createLearningPathForm.skillsText = "";
      createLearningPathForm.projectsJson = "";
      createLearningPathForm.displayOrder = 0;
      createLearningPathForm.isPublished = false;
      createLearningPathForm.isFeatured = false;
      await reloadLearningPaths();
      primeFormState();
      notify("success", "Learning path created.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  const updateLearningPath = async (id) => {
    try {
      const payload = {
        ...learningPathEdits[id],
        features: parseList(learningPathEdits[id].featuresText),
        skills: parseList(learningPathEdits[id].skillsText),
        projects: parseJson(learningPathEdits[id].projectsJson)
      };
      delete payload.featuresText;
      delete payload.skillsText;
      delete payload.projectsJson;
      await apiRequest(`/admin/learning-paths/${id}`, {
        method: "PATCH",
        auth: true,
        body: payload
      });
      await reloadLearningPaths();
      primeFormState();
      notify("success", "Learning path updated.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  const changeBlogsPage = (page) => setPageAndReload(blogFilters, page, reloadBlogs, true);
  const applyBlogFilters = () => resetAndReload(blogFilters, reloadBlogs, true);

  const createBlog = async () => {
    try {
      await apiRequest("/admin/blogs", {
        method: "POST",
        auth: true,
        body: {
          title: createBlogForm.title.trim(),
          slug: createBlogForm.slug.trim(),
          snippet: createBlogForm.snippet.trim(),
          content: createBlogForm.content.trim(),
          status: createBlogForm.status,
          isFeatured: createBlogForm.isFeatured
        }
      });
      createBlogForm.title = "";
      createBlogForm.slug = "";
      createBlogForm.snippet = "";
      createBlogForm.content = "";
      createBlogForm.status = "DRAFT";
      createBlogForm.isFeatured = false;
      await reloadBlogs();
      primeFormState();
      notify("success", "Blog created.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  const updateBlog = async (id) => {
    try {
      await apiRequest(`/admin/blogs/${id}`, {
        method: "PATCH",
        auth: true,
        body: blogEdits[id]
      });
      await reloadBlogs();
      primeFormState();
      notify("success", "Blog updated.");
    } catch (err) {
      error.value = err.message;
      notify("error", err.message);
    }
  };

  onMounted(reload);

  return {
    loading,
    error,
    users,
    testimonials,
    orders,
    courses,
    learningPaths,
    blogs,
    userEdits,
    orderEdits,
    courseEdits,
    learningPathEdits,
    blogEdits,
    usersMeta,
    testimonialsMeta,
    ordersMeta,
    coursesMeta,
    learningPathsMeta,
    blogsMeta,
    userFilters,
    testimonialFilters,
    orderFilters,
    courseFilters,
    learningPathFilters,
    blogFilters,
    createLearningPathForm,
    createBlogForm,
    reload,
    updateUser,
    updateOrder,
    updateCourseStatus,
    updateCourseDecision,
    updateCourseFields,
    approveTestimonial,
    toggleFeatured,
    changeUsersPage,
    applyUserFilters,
    changeTestimonialsPage,
    applyTestimonialFilters,
    changeOrdersPage,
    applyOrderFilters,
    changeCoursesPage,
    applyCourseFilters,
    changeLearningPathsPage,
    applyLearningPathFilters,
    createLearningPath,
    updateLearningPath,
    changeBlogsPage,
    applyBlogFilters,
    createBlog,
    updateBlog
  };
};
