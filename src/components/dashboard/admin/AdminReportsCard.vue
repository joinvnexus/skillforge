<template>
  <article class="admin-card p-5 lg:col-span-2">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Reports & Abuse</h2>
        <p class="text-xs text-slate-500">Pending reviews and policy flags.</p>
      </div>
      <button class="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">
        View All
      </button>
    </div>

    <div class="mt-4 grid gap-3 md:grid-cols-3">
      <div class="rounded-lg border border-slate-200 p-3">
        <p class="text-xs text-slate-500">Open Reports</p>
        <p class="mt-1 text-lg font-semibold text-slate-900">0</p>
      </div>
      <div class="rounded-lg border border-slate-200 p-3">
        <p class="text-xs text-slate-500">Escalations</p>
        <p class="mt-1 text-lg font-semibold text-slate-900">0</p>
      </div>
      <div class="rounded-lg border border-slate-200 p-3">
        <p class="text-xs text-slate-500">Resolved Today</p>
        <p class="mt-1 text-lg font-semibold text-slate-900">0</p>
      </div>
    </div>

    <div class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No active reports yet. When users submit abuse or policy flags, they will appear here.
    </div>
  </article>
</template>
