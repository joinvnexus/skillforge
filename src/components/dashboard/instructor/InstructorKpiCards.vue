<template>
  <div class="grid gap-4 md:grid-cols-4">
    <div class="admin-kpi">
      <p class="text-xs text-slate-500">Total Courses</p>
      <p class="mt-2 text-2xl font-semibold text-slate-900">{{ overview.totalCourses }}</p>
      <p class="mt-1 text-xs text-slate-500">All courses</p>
    </div>
    <div class="admin-kpi">
      <p class="text-xs text-slate-500">Published</p>
      <p class="mt-2 text-2xl font-semibold text-slate-900">{{ overview.publishedCourses }}</p>
      <p class="mt-1 text-xs text-slate-500">Live now</p>
    </div>
    <div class="admin-kpi">
      <p class="text-xs text-slate-500">Total Students</p>
      <p class="mt-2 text-2xl font-semibold text-slate-900">{{ overview.totalStudents }}</p>
      <p class="mt-1 text-xs text-slate-500">Across courses</p>
    </div>
    <div class="admin-kpi">
      <p class="text-xs text-slate-500">Total Reviews</p>
      <p class="mt-2 text-2xl font-semibold text-slate-900">{{ overview.totalReviews }}</p>
      <p class="mt-1 text-xs text-slate-500">Lifetime</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  overview: { type: Object, required: true }
});
</script>
