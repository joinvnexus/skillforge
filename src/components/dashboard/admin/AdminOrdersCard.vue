<template>
  <article class="admin-card p-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 class="text-lg font-semibold text-slate-900">Orders (Status Management)</h2>
      <div class="grid gap-2 md:grid-cols-3">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search order/user/ref"
          class="rounded border border-slate-300 px-2 py-1 text-xs"
          @keyup.enter="$emit('apply-filters')"
        />
        <select v-model="filters.status" class="rounded border border-slate-300 px-2 py-1 text-xs">
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="FAILED">FAILED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
        <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('apply-filters')">
          Apply
        </button>
      </div>
    </div>
    <div v-if="!orders.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No orders match these filters.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="order in orders" :key="order.id" class="rounded-lg border border-slate-200 p-3">
        <p class="text-sm font-semibold text-slate-800">{{ order.orderNumber }}</p>
        <p class="text-xs text-slate-600">{{ order.user?.name || "User" }} - ${{ Number(order.totalAmount || 0).toFixed(2) }}</p>
        <div class="mt-3 flex flex-col gap-2">
          <select v-model="edits[order.id].status" class="rounded border border-slate-300 px-2 py-1 text-xs">
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
          <input
            v-model="edits[order.id].paymentReference"
            type="text"
            placeholder="Payment reference (optional)"
            class="rounded border border-slate-300 px-2 py-1 text-xs"
          />
          <button
            class="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
            @click="$emit('save-order', order.id)"
          >
            Save
          </button>
        </div>
      </li>
    </ul>
    <div v-if="meta.total" class="mt-4 flex items-center justify-between text-xs text-slate-600">
      <span>Page {{ meta.page }} / {{ meta.totalPages || 1 }} ({{ meta.total }} orders)</span>
      <div class="flex gap-2">
        <button
          class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50"
          :disabled="meta.page <= 1"
          @click="$emit('change-page', meta.page - 1)"
        >
          Prev
        </button>
        <button
          class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50"
          :disabled="meta.page >= meta.totalPages"
          @click="$emit('change-page', meta.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  orders: { type: Array, required: true },
  edits: { type: Object, required: true },
  meta: { type: Object, required: true },
  filters: { type: Object, required: true }
});

defineEmits(["apply-filters", "change-page", "save-order"]);
</script>
