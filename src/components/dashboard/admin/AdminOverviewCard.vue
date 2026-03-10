<template>
  <article class="admin-card p-6 lg:col-span-2">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Overview</p>
        <h2 class="text-xl font-semibold text-slate-900">Admin Control Center</h2>
        <p class="mt-1 text-sm text-slate-500">Quick snapshot of activity and shortcuts.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <RouterLink :to="withTab('users')" class="admin-pill">
          Manage Users
        </RouterLink>
        <RouterLink :to="withTab('orders')" class="admin-pill">
          Review Orders
        </RouterLink>
        <RouterLink :to="withTab('blogs')" class="admin-pill">
          Publish Content
        </RouterLink>
      </div>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-4">
      <div class="admin-kpi">
        <p class="text-xs text-slate-500">Total Users</p>
        <p class="mt-2 text-2xl font-semibold text-slate-900">{{ usersTotal }}</p>
        <p class="mt-1 text-xs text-emerald-600">Active roles healthy</p>
      </div>
      <div class="admin-kpi">
        <p class="text-xs text-slate-500">Orders</p>
        <p class="mt-2 text-2xl font-semibold text-slate-900">{{ ordersTotal }}</p>
        <p class="mt-1 text-xs text-slate-500">Last 30 days</p>
      </div>
      <div class="admin-kpi">
        <p class="text-xs text-slate-500">Learning Paths</p>
        <p class="mt-2 text-2xl font-semibold text-slate-900">{{ pathsTotal }}</p>
        <p class="mt-1 text-xs text-slate-500">Published + draft</p>
      </div>
      <div class="admin-kpi">
        <p class="text-xs text-slate-500">Blogs</p>
        <p class="mt-2 text-2xl font-semibold text-slate-900">{{ blogsTotal }}</p>
        <p class="mt-1 text-xs text-slate-500">Content pipeline</p>
      </div>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold text-slate-500">Operational Notes</p>
        <ul class="mt-2 space-y-1 text-sm text-slate-600">
          <li>Keep approvals within 24h SLA.</li>
          <li>Monitor flagged content daily.</li>
          <li>Spot-check featured learning paths.</li>
        </ul>
      </div>
      <div class="rounded-xl border border-slate-200 p-4">
        <p class="text-xs font-semibold text-slate-500">Quick Tasks</p>
        <div class="mt-3 grid gap-2">
          <RouterLink :to="withTab('testimonials')" class="admin-pill">
            Review Testimonials
          </RouterLink>
          <RouterLink :to="withTab('paths')" class="admin-pill">
            Update Learning Paths
          </RouterLink>
          <RouterLink :to="withTab('settings')" class="admin-pill">
            Check Settings
          </RouterLink>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  usersTotal: { type: Number, default: 0 },
  ordersTotal: { type: Number, default: 0 },
  pathsTotal: { type: Number, default: 0 },
  blogsTotal: { type: Number, default: 0 }
});

const withTab = (tab) => ({ path: "/dashboard/admin-panel", query: { tab } });
</script>
