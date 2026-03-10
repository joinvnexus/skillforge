<template>
  <article class="admin-card p-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Revenue</h3>
        <p class="text-xs text-slate-500">Payouts & earnings overview.</p>
      </div>
      <span class="admin-pill">Coming Soon</span>
    </div>

    <div class="mt-4 grid gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs text-slate-500">Total Earnings</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">$0.00</p>
        <p class="text-xs text-slate-500">Awaiting payout setup</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs text-slate-500">Next Payout</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">Not scheduled</p>
        <p class="text-xs text-slate-500">Connect payout method</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs text-slate-500">Pending Balance</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">$0.00</p>
        <p class="text-xs text-slate-500">No payouts yet</p>
      </div>
    </div>
  </article>
</template>
