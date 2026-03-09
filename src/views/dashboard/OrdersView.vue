<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">My Orders</h1>
      <p class="text-slate-500">Track payment status and purchased courses.</p>
    </div>

    <DashboardState v-if="loading" type="loading" title="Loading orders..." />
    <DashboardState v-else-if="error" type="error" title="Orders failed to load" :description="error" show-retry @retry="reloadOrders" />
    <DashboardState v-else-if="orders.length === 0" type="empty" title="No orders yet." description="Create an order from cart to track payment status here." />

    <div v-else class="space-y-4">
      <article v-for="order in orders" :key="order.id" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">{{ order.orderNumber }}</p>
            <p class="text-xs text-slate-500">{{ formatDate(order.createdAt) }}</p>
            <p v-if="order.paymentReference" class="text-xs text-slate-500">Ref: {{ order.paymentReference }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{{ order.status }}</span>
            <span class="text-sm font-bold text-slate-900">${{ Number(order.totalAmount || 0).toFixed(2) }}</span>
            <router-link
              :to="`/dashboard/orders/${order.id}`"
              class="rounded border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Details
            </router-link>
          </div>
        </div>

        <ul class="mt-3 space-y-1 text-sm text-slate-600">
          <li v-for="item in order.items || []" :key="item.id">{{ item.course?.title || "Course" }}</li>
        </ul>

        <div v-if="order.status !== 'PAID'" class="mt-4 flex flex-wrap items-center gap-2">
          <button
            v-if="!intentByOrderId[order.id]"
            :aria-label="`Start payment for order ${order.orderNumber}`"
            class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            :disabled="paymentLoadingId === order.id"
            @click="startPayment(order.id)"
          >
            {{ paymentLoadingId === order.id ? "Preparing..." : "Start Payment" }}
          </button>
          <button
            v-if="intentByOrderId[order.id]"
            :aria-label="`Mark order ${order.orderNumber} as paid`"
            class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            :disabled="paymentLoadingId === order.id"
            @click="verifyPayment(order.id, 'SUCCESS')"
          >
            {{ paymentLoadingId === order.id ? "Confirming..." : "Mark Paid" }}
          </button>
          <button
            v-if="intentByOrderId[order.id]"
            :aria-label="`Mark order ${order.orderNumber} as failed`"
            class="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
            :disabled="paymentLoadingId === order.id"
            @click="verifyPayment(order.id, 'FAILED')"
          >
            {{ paymentLoadingId === order.id ? "Updating..." : "Mark Failed" }}
          </button>
          <span class="text-xs text-slate-500">
            {{ intentByOrderId[order.id] ? "Verify payment outcome (success/fail)." : "Initialize payment first." }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import DashboardState from "@/components/dashboard/DashboardState.vue";

const store = useStore();
const orders = computed(() => store.getters["orders/orders"]);
const loading = computed(() => store.state.orders.loading);
const error = computed(() => store.state.orders.error);
const intentByOrderId = computed(() => store.state.orders.paymentIntents || {});
const paymentLoadingId = ref(null);

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
};

onMounted(() => {
  reloadOrders();
});

const reloadOrders = () => store.dispatch("orders/fetchOrders");

const startPayment = async (orderId) => {
  paymentLoadingId.value = orderId;
  try {
    await store.dispatch("orders/createPaymentIntent", orderId);
    store.dispatch("ui/notify", { type: "success", message: "Payment initialized." });
  } catch (_error) {
    store.dispatch("ui/notify", { type: "error", message: store.state.orders.error || "Payment initialization failed." });
  } finally {
    paymentLoadingId.value = null;
  }
};

const verifyPayment = async (orderId, outcome) => {
  paymentLoadingId.value = orderId;
  try {
    const intent = intentByOrderId.value[orderId];
    if (!intent?.paymentReference) {
      await store.dispatch("orders/createPaymentIntent", orderId);
    }
    const resolvedIntent = intentByOrderId.value[orderId] || intent;
    await store.dispatch("orders/verifyPayment", {
      orderId,
      paymentReference: resolvedIntent?.paymentReference,
      outcome,
      paymentMethod: "CARD"
    });
    await Promise.all([store.dispatch("orders/fetchOrders"), store.dispatch("enrollments/fetchEnrolledCourses")]);
    store.dispatch("ui/notify", {
      type: outcome === "SUCCESS" ? "success" : "warning",
      message: outcome === "SUCCESS" ? "Payment marked as paid." : "Payment marked as failed."
    });
  } catch (_error) {
    store.dispatch("ui/notify", { type: "error", message: store.state.orders.error || "Payment verification failed." });
  } finally {
    paymentLoadingId.value = null;
  }
};
</script>
