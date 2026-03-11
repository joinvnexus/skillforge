<template>
  <article class="admin-card p-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Revenue</h3>
        <p class="text-xs text-slate-500">Payouts & earnings overview.</p>
      </div>
      <span class="admin-pill">Live</span>
    </div>

    <div class="mt-4 grid gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs text-slate-500">Total Earnings</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">${{ formatMoney(revenue.totalRevenue) }}</p>
        <p class="text-xs text-slate-500">All time</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs text-slate-500">Next Payout</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">{{ revenue.lastPayout ? formatDate(revenue.lastPayout) : "Not scheduled" }}</p>
        <p class="text-xs text-slate-500">Based on platform schedule</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs text-slate-500">Pending Balance</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">${{ formatMoney(revenue.pendingBalance) }}</p>
        <p class="text-xs text-slate-500">Awaiting payout</p>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  revenue: { type: Object, required: true }
});

const formatMoney = (value) => Number(value || 0).toFixed(2);
const formatDate = (value) => new Date(value).toLocaleDateString();
</script>
