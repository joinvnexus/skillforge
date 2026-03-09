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
      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Recent Users</h2>
        <ul class="mt-4 space-y-3">
          <li v-for="user in users" :key="user.id" class="flex items-center justify-between text-sm">
            <span class="text-slate-700">{{ user.name }} ({{ user.role }})</span>
            <span class="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{{ user.status }}</span>
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

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <h2 class="text-lg font-semibold text-slate-900">Recent Orders</h2>
        <ul class="mt-4 grid gap-3 md:grid-cols-2">
          <li v-for="order in orders" :key="order.id" class="rounded-lg border border-slate-200 p-3">
            <p class="text-sm font-semibold text-slate-800">{{ order.orderNumber }}</p>
            <p class="text-xs text-slate-600">{{ order.user?.name || "User" }} - {{ order.status }}</p>
            <p class="mt-1 text-sm font-bold text-slate-900">${{ Number(order.totalAmount || 0).toFixed(2) }}</p>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { apiRequest } from "@/lib/api";

const loading = ref(true);
const error = ref(null);
const users = ref([]);
const pendingTestimonials = ref([]);
const orders = ref([]);

const reload = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [usersRes, testimonialsRes, ordersRes] = await Promise.all([
      apiRequest("/admin/users?limit=8", { auth: true }),
      apiRequest("/admin/testimonials/pending", { auth: true }),
      apiRequest("/admin/orders?limit=6", { auth: true })
    ]);
    users.value = usersRes.data || [];
    pendingTestimonials.value = testimonialsRes.data || [];
    orders.value = ordersRes.data || [];
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
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
