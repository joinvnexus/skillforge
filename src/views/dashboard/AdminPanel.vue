<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
      <button class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" @click="reload">
        Refresh
      </button>
    </div>

    <DashboardState v-if="loading" type="loading" title="Loading admin data..." />
    <DashboardState v-else-if="error" type="error" title="Admin data failed to load" :description="error" show-retry @retry="reload" />

    <div v-else class="grid gap-5 lg:grid-cols-2">
      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 class="text-lg font-semibold text-slate-900">Users (Role / Status Management)</h2>
          <div class="grid gap-2 md:grid-cols-4">
            <input
              v-model="userFilters.search"
              type="text"
              placeholder="Search name/email"
              class="rounded border border-slate-300 px-2 py-1 text-xs"
              @keyup.enter="applyUserFilters"
            />
            <select v-model="userFilters.role" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="">All Roles</option>
              <option value="STUDENT">STUDENT</option>
              <option value="INSTRUCTOR">INSTRUCTOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <select v-model="userFilters.status" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PENDING">PENDING</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
            <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="applyUserFilters">Apply</button>
          </div>
        </div>
        <ul class="mt-4 space-y-3">
          <li v-for="user in users" :key="user.id" class="rounded-lg border border-slate-200 p-3">
            <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ user.name }}</p>
                <p class="text-xs text-slate-500">{{ user.email }}</p>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <select v-model="userEdits[user.id].role" class="rounded border border-slate-300 px-2 py-1 text-xs">
                  <option value="STUDENT">STUDENT</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <select v-model="userEdits[user.id].status" class="rounded border border-slate-300 px-2 py-1 text-xs">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PENDING">PENDING</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
                <button class="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="updateUser(user.id)">
                  Save
                </button>
              </div>
            </div>
          </li>
        </ul>
        <div class="mt-4 flex items-center justify-between text-xs text-slate-600">
          <span>Page {{ usersMeta.page }} / {{ usersMeta.totalPages || 1 }} ({{ usersMeta.total }} users)</span>
          <div class="flex gap-2">
            <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="usersMeta.page <= 1" @click="changeUsersPage(usersMeta.page - 1)">Prev</button>
            <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="usersMeta.page >= usersMeta.totalPages" @click="changeUsersPage(usersMeta.page + 1)">Next</button>
          </div>
        </div>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 class="text-lg font-semibold text-slate-900">Testimonials</h2>
          <div class="grid gap-2 md:grid-cols-3">
            <input
              v-model="testimonialFilters.search"
              type="text"
              placeholder="Search name/quote"
              class="rounded border border-slate-300 px-2 py-1 text-xs"
              @keyup.enter="applyTestimonialFilters"
            />
            <select v-model="testimonialFilters.approved" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="false">Pending</option>
              <option value="">All</option>
              <option value="true">Approved</option>
            </select>
            <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="applyTestimonialFilters">Apply</button>
          </div>
        </div>
        <ul class="mt-4 space-y-3">
          <li v-for="item in testimonials" :key="item.id" class="rounded-lg border border-slate-200 p-3">
            <p class="text-sm font-semibold text-slate-800">{{ item.name }}</p>
            <p class="mt-1 text-sm text-slate-600">"{{ item.quote }}"</p>
            <div class="mt-3 flex gap-2">
              <button
                v-if="!item.isApproved"
                class="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                @click="approveTestimonial(item.id)"
              >
                Approve
              </button>
              <button
                class="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                @click="toggleFeatured(item)"
              >
                {{ item.isFeatured ? "Unfeature" : "Feature" }}
              </button>
            </div>
          </li>
        </ul>
        <div class="mt-4 flex items-center justify-between text-xs text-slate-600">
          <span>Page {{ testimonialsMeta.page }} / {{ testimonialsMeta.totalPages || 1 }} ({{ testimonialsMeta.total }} items)</span>
          <div class="flex gap-2">
            <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="testimonialsMeta.page <= 1" @click="changeTestimonialsPage(testimonialsMeta.page - 1)">Prev</button>
            <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="testimonialsMeta.page >= testimonialsMeta.totalPages" @click="changeTestimonialsPage(testimonialsMeta.page + 1)">Next</button>
          </div>
        </div>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 class="text-lg font-semibold text-slate-900">Orders (Status Management)</h2>
          <div class="grid gap-2 md:grid-cols-3">
            <input
              v-model="orderFilters.search"
              type="text"
              placeholder="Search order/user/ref"
              class="rounded border border-slate-300 px-2 py-1 text-xs"
              @keyup.enter="applyOrderFilters"
            />
            <select v-model="orderFilters.status" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="FAILED">FAILED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
            <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="applyOrderFilters">Apply</button>
          </div>
        </div>
        <ul class="mt-4 space-y-3">
          <li v-for="order in orders" :key="order.id" class="rounded-lg border border-slate-200 p-3">
            <p class="text-sm font-semibold text-slate-800">{{ order.orderNumber }}</p>
            <p class="text-xs text-slate-600">{{ order.user?.name || "User" }} - ${{ Number(order.totalAmount || 0).toFixed(2) }}</p>
            <div class="mt-3 flex flex-col gap-2">
              <select v-model="orderEdits[order.id].status" class="rounded border border-slate-300 px-2 py-1 text-xs">
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="FAILED">FAILED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
              <input
                v-model="orderEdits[order.id].paymentReference"
                type="text"
                placeholder="Payment reference (optional)"
                class="rounded border border-slate-300 px-2 py-1 text-xs"
              />
              <button class="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="updateOrder(order.id)">
                Save
              </button>
            </div>
          </li>
        </ul>
        <div class="mt-4 flex items-center justify-between text-xs text-slate-600">
          <span>Page {{ ordersMeta.page }} / {{ ordersMeta.totalPages || 1 }} ({{ ordersMeta.total }} orders)</span>
          <div class="flex gap-2">
            <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="ordersMeta.page <= 1" @click="changeOrdersPage(ordersMeta.page - 1)">Prev</button>
            <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="ordersMeta.page >= ordersMeta.totalPages" @click="changeOrdersPage(ordersMeta.page + 1)">Next</button>
          </div>
        </div>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 class="text-lg font-semibold text-slate-900">Learning Paths Management</h2>
          <div class="grid gap-2 md:grid-cols-4">
            <input
              v-model="learningPathFilters.search"
              type="text"
              placeholder="Search title/slug"
              class="rounded border border-slate-300 px-2 py-1 text-xs"
              @keyup.enter="applyLearningPathFilters"
            />
            <select v-model="learningPathFilters.level" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="">All Levels</option>
              <option value="BEGINNER">BEGINNER</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="ADVANCED">ADVANCED</option>
            </select>
            <select v-model="learningPathFilters.published" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="">All</option>
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>
            <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="applyLearningPathFilters">Apply</button>
          </div>
        </div>

        <div class="mt-3 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-6">
          <input v-model="createLearningPathForm.slug" type="text" placeholder="Slug" class="rounded border border-slate-300 px-2 py-1 text-xs" />
          <input v-model="createLearningPathForm.title" type="text" placeholder="Title" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
          <input v-model="createLearningPathForm.estimatedDuration" type="text" placeholder="Duration" class="rounded border border-slate-300 px-2 py-1 text-xs" />
          <select v-model="createLearningPathForm.level" class="rounded border border-slate-300 px-2 py-1 text-xs">
            <option value="BEGINNER">BEGINNER</option>
            <option value="INTERMEDIATE">INTERMEDIATE</option>
            <option value="ADVANCED">ADVANCED</option>
          </select>
          <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="createLearningPath">Create</button>
          <textarea v-model="createLearningPathForm.description" rows="2" placeholder="Description" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-6"></textarea>
        </div>

        <ul class="mt-4 space-y-3">
          <li v-for="path in learningPaths" :key="path.id" class="rounded-lg border border-slate-200 p-3">
            <p class="text-sm font-semibold text-slate-800">{{ path.title }}</p>
            <p class="text-xs text-slate-500">{{ path.slug }} · {{ path.level }}</p>
            <div class="mt-2 grid gap-2 md:grid-cols-6">
              <input v-model="learningPathEdits[path.id].title" type="text" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
              <input v-model="learningPathEdits[path.id].estimatedDuration" type="text" class="rounded border border-slate-300 px-2 py-1 text-xs" />
              <select v-model="learningPathEdits[path.id].level" class="rounded border border-slate-300 px-2 py-1 text-xs">
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
              <input v-model.number="learningPathEdits[path.id].displayOrder" type="number" min="0" class="rounded border border-slate-300 px-2 py-1 text-xs" />
              <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="updateLearningPath(path.id)">Save</button>
            </div>
            <div class="mt-2 flex gap-3 text-xs text-slate-700">
              <label class="inline-flex items-center gap-1">
                <input v-model="learningPathEdits[path.id].isPublished" type="checkbox" />
                Published
              </label>
              <label class="inline-flex items-center gap-1">
                <input v-model="learningPathEdits[path.id].isFeatured" type="checkbox" />
                Featured
              </label>
            </div>
          </li>
        </ul>

        <div class="mt-4 flex items-center justify-between text-xs text-slate-600">
          <span>Page {{ learningPathsMeta.page }} / {{ learningPathsMeta.totalPages || 1 }} ({{ learningPathsMeta.total }} paths)</span>
          <div class="flex gap-2">
            <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="learningPathsMeta.page <= 1" @click="changeLearningPathsPage(learningPathsMeta.page - 1)">Prev</button>
            <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="learningPathsMeta.page >= learningPathsMeta.totalPages" @click="changeLearningPathsPage(learningPathsMeta.page + 1)">Next</button>
          </div>
        </div>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 class="text-lg font-semibold text-slate-900">Blog Management</h2>
          <div class="grid gap-2 md:grid-cols-3">
            <input
              v-model="blogFilters.search"
              type="text"
              placeholder="Search title/slug"
              class="rounded border border-slate-300 px-2 py-1 text-xs"
              @keyup.enter="applyBlogFilters"
            />
            <select v-model="blogFilters.status" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="">All Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
            <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="applyBlogFilters">Apply</button>
          </div>
        </div>

        <div class="mt-3 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-6">
          <input v-model="createBlogForm.slug" type="text" placeholder="Slug" class="rounded border border-slate-300 px-2 py-1 text-xs" />
          <input v-model="createBlogForm.title" type="text" placeholder="Title" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
          <input v-model="createBlogForm.snippet" type="text" placeholder="Snippet" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
          <select v-model="createBlogForm.status" class="rounded border border-slate-300 px-2 py-1 text-xs">
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
          <textarea v-model="createBlogForm.content" rows="2" placeholder="Content" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-5"></textarea>
          <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="createBlog">Create</button>
        </div>

        <ul class="mt-4 space-y-3">
          <li v-for="blog in blogs" :key="blog.id" class="rounded-lg border border-slate-200 p-3">
            <p class="text-sm font-semibold text-slate-800">{{ blog.title }}</p>
            <p class="text-xs text-slate-500">{{ blog.slug }}</p>
            <div class="mt-2 grid gap-2 md:grid-cols-4">
              <input v-model="blogEdits[blog.id].title" type="text" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
              <select v-model="blogEdits[blog.id].status" class="rounded border border-slate-300 px-2 py-1 text-xs">
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
              <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="updateBlog(blog.id)">Save</button>
            </div>
            <label class="mt-2 inline-flex items-center gap-1 text-xs text-slate-700">
              <input v-model="blogEdits[blog.id].isFeatured" type="checkbox" />
              Featured
            </label>
          </li>
        </ul>

        <div class="mt-4 flex items-center justify-between text-xs text-slate-600">
          <span>Page {{ blogsMeta.page }} / {{ blogsMeta.totalPages || 1 }} ({{ blogsMeta.total }} blogs)</span>
          <div class="flex gap-2">
            <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="blogsMeta.page <= 1" @click="changeBlogsPage(blogsMeta.page - 1)">Prev</button>
            <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="blogsMeta.page >= blogsMeta.totalPages" @click="changeBlogsPage(blogsMeta.page + 1)">Next</button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { apiRequest } from "@/lib/api";
import DashboardState from "@/components/dashboard/DashboardState.vue";

const loading = ref(true);
const error = ref(null);
const users = ref([]);
const testimonials = ref([]);
const orders = ref([]);
const learningPaths = ref([]);
const blogs = ref([]);
const userEdits = reactive({});
const orderEdits = reactive({});
const learningPathEdits = reactive({});
const blogEdits = reactive({});
const usersMeta = ref({ page: 1, totalPages: 1, total: 0 });
const testimonialsMeta = ref({ page: 1, totalPages: 1, total: 0 });
const ordersMeta = ref({ page: 1, totalPages: 1, total: 0 });
const learningPathsMeta = ref({ page: 1, totalPages: 1, total: 0 });
const blogsMeta = ref({ page: 1, totalPages: 1, total: 0 });
const userFilters = reactive({ page: 1, limit: 12, search: "", role: "", status: "" });
const testimonialFilters = reactive({ page: 1, limit: 8, approved: "false", search: "" });
const orderFilters = reactive({ page: 1, limit: 10, status: "", search: "" });
const learningPathFilters = reactive({ page: 1, limit: 8, search: "", level: "", published: "" });
const blogFilters = reactive({ page: 1, limit: 8, search: "", status: "" });
const createLearningPathForm = reactive({
  slug: "",
  title: "",
  description: "",
  estimatedDuration: "",
  level: "BEGINNER",
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
  for (const item of learningPaths.value) {
    learningPathEdits[item.id] = {
      title: item.title,
      level: item.level,
      estimatedDuration: item.estimatedDuration || "",
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
    await Promise.all([reloadUsers(), reloadTestimonials(), reloadOrders(), reloadLearningPaths(), reloadBlogs()]);
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
  } catch (err) {
    error.value = err.message;
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
  } catch (err) {
    error.value = err.message;
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
  } catch (err) {
    error.value = err.message;
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
  } catch (err) {
    error.value = err.message;
  }
};

const changeUsersPage = async (page) => {
  userFilters.page = page;
  await reloadUsers();
  primeFormState();
};

const applyUserFilters = async () => {
  userFilters.page = 1;
  await reloadUsers();
  primeFormState();
};

const changeTestimonialsPage = async (page) => {
  testimonialFilters.page = page;
  await reloadTestimonials();
};

const applyTestimonialFilters = async () => {
  testimonialFilters.page = 1;
  await reloadTestimonials();
};

const changeOrdersPage = async (page) => {
  orderFilters.page = page;
  await reloadOrders();
  primeFormState();
};

const applyOrderFilters = async () => {
  orderFilters.page = 1;
  await reloadOrders();
  primeFormState();
};

const changeLearningPathsPage = async (page) => {
  learningPathFilters.page = page;
  await reloadLearningPaths();
  primeFormState();
};

const applyLearningPathFilters = async () => {
  learningPathFilters.page = 1;
  await reloadLearningPaths();
  primeFormState();
};

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
        isPublished: createLearningPathForm.isPublished,
        isFeatured: createLearningPathForm.isFeatured
      }
    });
    createLearningPathForm.slug = "";
    createLearningPathForm.title = "";
    createLearningPathForm.description = "";
    createLearningPathForm.estimatedDuration = "";
    createLearningPathForm.level = "BEGINNER";
    createLearningPathForm.isPublished = false;
    createLearningPathForm.isFeatured = false;
    await reloadLearningPaths();
    primeFormState();
  } catch (err) {
    error.value = err.message;
  }
};

const updateLearningPath = async (id) => {
  try {
    await apiRequest(`/admin/learning-paths/${id}`, {
      method: "PATCH",
      auth: true,
      body: learningPathEdits[id]
    });
    await reloadLearningPaths();
    primeFormState();
  } catch (err) {
    error.value = err.message;
  }
};

const changeBlogsPage = async (page) => {
  blogFilters.page = page;
  await reloadBlogs();
  primeFormState();
};

const applyBlogFilters = async () => {
  blogFilters.page = 1;
  await reloadBlogs();
  primeFormState();
};

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
  } catch (err) {
    error.value = err.message;
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
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(reload);
</script>
