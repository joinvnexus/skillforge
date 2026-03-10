<template>
  <header class="admin-topbar rounded-2xl px-5 py-4">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <slot name="title">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Panel</p>
          <h1 class="text-2xl font-semibold text-slate-900">Overview</h1>
        </slot>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
