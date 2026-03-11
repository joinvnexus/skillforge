<template>
  <article class="admin-card p-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Payout History</h3>
        <p class="text-xs text-slate-500">Recent payouts and status.</p>
      </div>
      <span class="admin-pill">Live</span>
    </div>

    <div v-if="!payouts.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No payout records available yet.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="item in payouts" :key="item.id" class="rounded-lg border border-slate-200 p-3 text-xs text-slate-600">
        <div class="flex items-center justify-between">
          <span>{{ formatDate(item.date) }}</span>
          <span class="font-semibold">${{ formatMoney(item.amount) }}</span>
        </div>
        <p class="mt-1 text-xs text-slate-500">Status: {{ item.status }}</p>
      </li>
    </ul>
  </article>
</template>

<script setup>
defineProps({
  payouts: { type: Array, required: true }
});

const formatMoney = (value) => Number(value || 0).toFixed(2);
const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "N/A");
</script>
