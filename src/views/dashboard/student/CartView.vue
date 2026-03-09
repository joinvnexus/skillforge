<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">My Cart</h1>
        <p class="text-slate-500">Review selected courses before checkout.</p>
      </div>
      <p class="text-sm font-semibold text-slate-700">Subtotal: ${{ subtotal.toFixed(2) }}</p>
    </div>

    <DashboardState v-if="items.length === 0" type="empty" title="Cart is empty." description="Add courses from wishlist or course pages to create an order." />

    <div v-else class="space-y-4">
      <article v-for="course in items" :key="course.id" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">{{ course.title }}</h2>
            <p class="mt-1 text-sm text-slate-500">{{ course.instructorName }}</p>
          </div>
          <p class="text-sm font-bold text-slate-900">${{ Number(course.price || 0).toFixed(2) }}</p>
        </div>
        <div class="mt-4 flex gap-2">
          <button class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="remove(course.id)">
            <span class="sr-only">Remove {{ course.title }} from cart</span>
            Remove
          </button>
        </div>
      </article>

      <div class="flex flex-col gap-2 md:flex-row">
        <button aria-label="Create order from cart" class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" :disabled="loading" @click="checkout">
          {{ loading ? "Processing..." : "Create Order (Pending Payment)" }}
        </button>
        <button aria-label="Clear all items from cart" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="clear">
          Clear Cart
        </button>
      </div>
      <p v-if="message" class="text-sm text-emerald-700">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import DashboardState from "@/components/dashboard/DashboardState.vue";

const store = useStore();
const loading = ref(false);
const error = ref(null);
const message = ref(null);
const items = computed(() => store.getters["cart/cartItems"]);
const subtotal = computed(() => store.getters["cart/cartSubtotal"]);

const remove = (courseId) => store.dispatch("cart/removeFromCart", courseId);
const clear = () => store.dispatch("cart/clearCart");

const checkout = async () => {
  loading.value = true;
  error.value = null;
  message.value = null;
  try {
    await store.dispatch("cart/checkoutCart", { markPaid: false, paymentMethod: "CARD" });
    await store.dispatch("orders/fetchOrders");
    message.value = "Order created. Complete payment from the Orders page.";
    store.dispatch("ui/notify", { type: "success", message: "Order created. Complete payment from Orders." });
  } catch (err) {
    error.value = err.message;
    store.dispatch("ui/notify", { type: "error", message: err.message });
  } finally {
    loading.value = false;
  }
};
</script>
