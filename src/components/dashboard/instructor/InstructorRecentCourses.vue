<template>
  <article class="admin-card p-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Recent Courses</h3>
        <p class="text-xs text-slate-500">Latest updated courses.</p>
      </div>
      <button class="rounded border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
        View All
      </button>
    </div>

    <div v-if="!courses.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No courses yet. Start by creating your first course.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="course in courses" :key="course.id" class="rounded-lg border border-slate-200 p-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-800">{{ course.title }}</p>
            <p class="text-xs text-slate-500">{{ course.slug }}</p>
          </div>
          <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{{ course.status }}</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
          <span>Enrollments: {{ course._count?.enrollments || 0 }}</span>
          <span>Reviews: {{ course._count?.reviews || 0 }}</span>
          <span>Sections: {{ course._count?.sections || 0 }}</span>
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
