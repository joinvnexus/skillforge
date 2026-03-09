<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">My Orders</h1>
      <p class="text-slate-500">Track payment status and purchased courses.</p>
    </div>

    <div v-if="loading" class="rounded-xl bg-white p-6 shadow-sm">Loading orders...</div>
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{{ error }}</div>
    <div v-else-if="orders.length === 0" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
      No orders yet.
    </div>

    <div v-else class="space-y-4">
      <article v-for="order in orders" :key="order.id" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">{{ order.orderNumber }}</p>
            <p class="text-xs text-slate-500">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{{ order.status }}</span>
            <span class="text-sm font-bold text-slate-900">${{ Number(order.totalAmount || 0).toFixed(2) }}</span>
          </div>
        </div>

        <ul class="mt-3 space-y-1 text-sm text-slate-600">
          <li v-for="item in order.items || []" :key="item.id">{{ item.course?.title || "Course" }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const orders = computed(() => store.getters["orders/orders"]);
const loading = computed(() => store.state.orders.loading);
const error = computed(() => store.state.orders.error);

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
};

onMounted(() => {
  store.dispatch("orders/fetchOrders");
});
</script>
