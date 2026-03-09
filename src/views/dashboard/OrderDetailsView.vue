<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Order Details</p>
        <h1 class="text-2xl font-bold text-slate-900">{{ order?.orderNumber || "Order" }}</h1>
      </div>
      <router-link to="/dashboard/orders" class="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        Back to Orders
      </router-link>
    </div>

    <DashboardState v-if="loading" type="loading" title="Loading order details..." />
    <DashboardState v-else-if="error" type="error" title="Order details failed to load" :description="error" show-retry @retry="reloadOrder" />
    <DashboardState v-else-if="!order" type="empty" title="Order not found." description="This order may not belong to your account or no longer exists." />

    <template v-else>
      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Status</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ order.status }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Total</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">${{ Number(order.totalAmount || 0).toFixed(2) }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Payment Method</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ order.paymentMethod || "N/A" }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Payment Reference</p>
            <p class="mt-1 break-all text-sm font-semibold text-slate-900">{{ order.paymentReference || "N/A" }}</p>
          </div>
        </div>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Items</h2>
        <ul class="mt-4 space-y-3">
          <li
            v-for="item in order.items || []"
            :key="item.id"
            class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3"
          >
            <div>
              <p class="text-sm font-semibold text-slate-900">{{ item.course?.title || "Course" }}</p>
              <p class="text-xs text-slate-500">{{ item.course?.shortDescription || "No description available." }}</p>
            </div>
            <span class="text-sm font-semibold text-slate-900">${{ Number(item.totalPrice || 0).toFixed(2) }}</span>
          </li>
        </ul>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Status Timeline</h2>
        <ul class="mt-4 space-y-4">
          <li v-for="step in timeline" :key="step.key" class="relative pl-5">
            <span class="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-sky-600"></span>
            <p class="text-sm font-semibold text-slate-900">{{ step.title }}</p>
            <p class="text-xs text-slate-500">{{ step.at }}</p>
          </li>
        </ul>
      </article>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import DashboardState from "@/components/dashboard/DashboardState.vue";

const route = useRoute();
const store = useStore();

const loading = computed(() => store.state.orders.loading);
const error = computed(() => store.state.orders.error);
const order = computed(() => store.getters["orders/selectedOrder"]);

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
};

const timeline = computed(() => {
  if (!order.value) return [];

  const entries = [
    {
      key: "created",
      title: "Order created",
      at: formatDate(order.value.createdAt)
    }
  ];

  if (order.value.paymentReference) {
    entries.push({
      key: "intent",
      title: "Payment initialized",
      at: formatDate(order.value.updatedAt || order.value.createdAt)
    });
  }

  if (order.value.status === "PAID") {
    entries.push({
      key: "paid",
      title: "Payment confirmed",
      at: formatDate(order.value.paidAt || order.value.updatedAt)
    });
  }

  if (order.value.status === "FAILED") {
    entries.push({
      key: "failed",
      title: "Payment failed",
      at: formatDate(order.value.updatedAt)
    });
  }

  return entries;
});

onMounted(() => {
  reloadOrder();
});

const reloadOrder = () => store.dispatch("orders/fetchOrderById", route.params.orderId);
</script>
