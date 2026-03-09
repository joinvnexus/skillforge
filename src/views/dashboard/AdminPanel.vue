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
        <h2 class="text-lg font-semibold text-slate-900">Users (Role / Status Management)</h2>
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
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Pending Testimonials</h2>
        <ul class="mt-4 space-y-3">
          <li v-for="item in pendingTestimonials" :key="item.id" class="rounded-lg border border-slate-200 p-3">
            <p class="text-sm font-semibold text-slate-800">{{ item.name }}</p>
            <p class="mt-1 text-sm text-slate-600">"{{ item.quote }}"</p>
            <button class="mt-3 rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700" @click="approveTestimonial(item.id)">
              Approve
            </button>
          </li>
        </ul>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Orders (Status Management)</h2>
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
const pendingTestimonials = ref([]);
const orders = ref([]);
const userEdits = reactive({});
const orderEdits = reactive({});

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

const reload = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [usersRes, testimonialsRes, ordersRes] = await Promise.all([
      apiRequest("/admin/users?limit=12", { auth: true }),
      apiRequest("/admin/testimonials/pending", { auth: true }),
      apiRequest("/admin/orders?limit=10", { auth: true })
    ]);
    users.value = usersRes.data || [];
    pendingTestimonials.value = testimonialsRes.data || [];
    orders.value = ordersRes.data || [];
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
    await reload();
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
    await reload();
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
    await reload();
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(reload);
</script>
