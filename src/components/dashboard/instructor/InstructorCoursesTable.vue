<template>
  <article class="admin-card p-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h3 class="text-sm font-semibold text-slate-900">My Courses</h3>
      <div class="grid gap-2 md:grid-cols-3">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search title/slug"
          class="rounded border border-slate-300 px-2 py-1 text-xs"
          @keyup.enter="$emit('apply-filters')"
        />
        <select v-model="filters.status" class="rounded border border-slate-300 px-2 py-1 text-xs">
          <option value="">All Statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="REVIEW">REVIEW</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
        <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('apply-filters')">
          Apply
        </button>
      </div>
    </div>

    <div v-if="!courses.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No courses found.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="course in courses" :key="course.id" class="rounded-lg border border-slate-200 p-3">
        <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-800">{{ course.title }}</p>
            <p class="text-xs text-slate-500">{{ course.slug }}</p>
            <div class="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
              <span>Enrollments: {{ course._count?.enrollments || 0 }}</span>
              <span>Reviews: {{ course._count?.reviews || 0 }}</span>
              <span>Sections: {{ course._count?.sections || 0 }}</span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{{ course.status }}</span>
            <select v-model="edits[course.id].status" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="DRAFT">DRAFT</option>
              <option value="REVIEW">REVIEW</option>
            </select>
            <button
              class="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              @click="$emit('edit', course)"
            >
              Edit
            </button>
            <button
              class="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              @click="$emit('preview', course)"
            >
              Preview
            </button>
            <button class="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('save-status', course.id)">
              Save
            </button>
          </div>
        </div>
      </li>
    </ul>
  </article>
</template>

<script setup>
defineProps({
  courses: { type: Array, required: true },
  edits: { type: Object, required: true },
  filters: { type: Object, required: true }
});

defineEmits(["apply-filters", "save-status", "edit", "preview"]);
</script>
