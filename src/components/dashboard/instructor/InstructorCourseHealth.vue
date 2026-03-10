<template>
  <article class="admin-card p-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Course Health</h3>
        <p class="text-xs text-slate-500">Top courses by engagement.</p>
      </div>
      <span class="admin-pill">Insights</span>
    </div>

    <div v-if="!courses.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No course activity yet.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="course in courses" :key="course.id" class="rounded-lg border border-slate-200 p-3">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-slate-800">{{ course.title }}</p>
          <span class="text-xs text-slate-500">{{ course._count?.enrollments || 0 }} students</span>
        </div>
        <div class="mt-2 grid gap-2 text-xs text-slate-500 md:grid-cols-3">
          <span>Reviews: {{ course._count?.reviews || 0 }}</span>
          <span>Sections: {{ course._count?.sections || 0 }}</span>
          <span>Status: {{ course.status }}</span>
        </div>
      </li>
    </ul>
  </article>
</template>

<script setup>
defineProps({
  courses: { type: Array, required: true }
});
</script>
