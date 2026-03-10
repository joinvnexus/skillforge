<template>
  <aside class="admin-surface hidden w-64 flex-col p-4 md:flex">
    <div class="mb-6">
      <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin</p>
      <p class="text-lg font-semibold text-slate-900">Control Center</p>
    </div>
    <nav class="admin-nav text-sm">
      <RouterLink :to="withTab('overview')" :class="linkClass(isActive('overview'))">Overview</RouterLink>
      <RouterLink :to="withTab('users')" :class="linkClass(isActive('users'))">Users</RouterLink>
      <RouterLink :to="withTab('testimonials')" :class="linkClass(isActive('testimonials'))">Testimonials</RouterLink>
      <RouterLink :to="withTab('orders')" :class="linkClass(isActive('orders'))">Orders</RouterLink>
      <RouterLink :to="withTab('courses')" :class="linkClass(isActive('courses'))">Courses</RouterLink>
      <RouterLink :to="withTab('paths')" :class="linkClass(isActive('paths'))">Learning Paths</RouterLink>
      <RouterLink :to="withTab('blogs')" :class="linkClass(isActive('blogs'))">Content</RouterLink>
      <RouterLink :to="withTab('reports')" :class="linkClass(isActive('reports'))">Reports</RouterLink>
      <RouterLink :to="withTab('settings')" :class="linkClass(isActive('settings'))">Settings</RouterLink>
    </nav>
    <div class="mt-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
      System status is healthy.
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const basePath = computed(() => "/dashboard/admin-panel");
const activeTab = computed(() => String(route.query.tab || "overview"));

const withTab = (tab) => ({ path: basePath.value, query: { tab } });

const isActive = (tab) => activeTab.value === tab;

const linkClass = (active) => ["admin-nav-link", active ? "is-active" : ""].join(" ").trim();
</script>
