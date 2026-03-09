<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
      <button class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" @click="reload">
        Refresh
      </button>
    </div>

    <div v-if="loading" class="rounded-xl bg-white p-5 shadow">Loading admin data...</div>
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{{ error }}</div>

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
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { apiRequest } from "@/lib/api";

const loading = ref(true);
const error = ref(null);
const users = ref([]);
const testimonials = ref([]);
const orders = ref([]);
const userEdits = reactive({});
const orderEdits = reactive({});
const usersMeta = ref({ page: 1, totalPages: 1, total: 0 });
const testimonialsMeta = ref({ page: 1, totalPages: 1, total: 0 });
const ordersMeta = ref({ page: 1, totalPages: 1, total: 0 });
const userFilters = reactive({ page: 1, limit: 12, search: "", role: "", status: "" });
const testimonialFilters = reactive({ page: 1, limit: 8, approved: "false", search: "" });
const orderFilters = reactive({ page: 1, limit: 10, status: "", search: "" });

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

const reload = async () => {
  loading.value = true;
  error.value = null;
  try {
    await Promise.all([reloadUsers(), reloadTestimonials(), reloadOrders()]);
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

onMounted(reload);
</script>
