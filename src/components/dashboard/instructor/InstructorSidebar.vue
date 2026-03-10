<template>
  <aside class="admin-surface hidden w-64 flex-col p-4 md:flex">
    <div class="mb-6">
      <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Instructor</p>
      <p class="text-lg font-semibold text-slate-900">Teaching Hub</p>
    </div>
    <nav class="admin-nav text-sm">
      <RouterLink :to="withTab('overview')" :class="linkClass(isActive('overview'))">Overview</RouterLink>
      <RouterLink :to="withTab('courses')" :class="linkClass(isActive('courses'))">Courses</RouterLink>
      <RouterLink :to="withTab('students')" :class="linkClass(isActive('students'))">Students</RouterLink>
      <RouterLink :to="withTab('revenue')" :class="linkClass(isActive('revenue'))">Revenue</RouterLink>
      <RouterLink :to="withTab('reviews')" :class="linkClass(isActive('reviews'))">Reviews</RouterLink>
      <RouterLink :to="withTab('settings')" :class="linkClass(isActive('settings'))">Settings</RouterLink>
    </nav>
    <div class="mt-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
      Next payout scheduled this week.
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const basePath = computed(() => "/dashboard/instructor-panel");
const activeTab = computed(() => String(route.query.tab || "overview"));

const withTab = (tab) => ({ path: basePath.value, query: { tab } });
const isActive = (tab) => activeTab.value === tab;
const linkClass = (active) => ["admin-nav-link", active ? "is-active" : ""].join(" ").trim();
</script>
