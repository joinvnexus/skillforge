<template>
  <article class="admin-card p-5 lg:col-span-2">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 class="text-lg font-semibold text-slate-900">Courses Moderation</h2>
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
      No courses found for the selected filters.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="course in courses" :key="course.id" class="rounded-lg border border-slate-200 p-3">
        <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-800">{{ course.title }}</p>
            <p class="text-xs text-slate-500">
              {{ course.slug }}
              <span v-if="course.category?.name"> · {{ course.category.name }}</span>
            </p>
            <p class="mt-1 text-xs text-slate-500">
              Author: {{ course.author?.name || "Unknown" }}
              <span v-if="course.instructor?.user?.name"> · Instructor: {{ course.instructor.user.name }}</span>
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{{ course.status }}</span>
            <select v-model="edits[course.id].status" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="DRAFT">DRAFT</option>
              <option value="REVIEW">REVIEW</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
            <button
              class="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              @click="$emit('preview', course)"
            >
              Preview
            </button>
            <button
              class="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              @click="$emit('edit', course)"
            >
              Edit
            </button>
            <button
              class="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
              @click="$emit('save-status', course.id)"
            >
              Save
            </button>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          <button class="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 font-semibold text-emerald-700" @click="$emit('quick-status', course.id, 'PUBLISHED')">
            Publish
          </button>
          <button class="rounded border border-sky-200 bg-sky-50 px-2 py-1 font-semibold text-sky-700" @click="$emit('quick-status', course.id, 'REVIEW')">
            Send to Review
          </button>
          <button class="rounded border border-amber-200 bg-amber-50 px-2 py-1 font-semibold text-amber-700" @click="$emit('quick-status', course.id, 'DRAFT')">
            Back to Draft
          </button>
          <button class="rounded border border-slate-200 bg-slate-50 px-2 py-1 font-semibold text-slate-700" @click="$emit('quick-status', course.id, 'ARCHIVED')">
            Archive
          </button>
          <button
            class="rounded border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-700 hover:bg-slate-50"
            @click="$emit('decision', course)"
          >
            Approve/Reject Note
          </button>
        </div>
      </li>
    </ul>

    <div v-if="meta.total" class="mt-4 flex items-center justify-between text-xs text-slate-600">
      <span>Page {{ meta.page }} / {{ meta.totalPages || 1 }} ({{ meta.total }} courses)</span>
      <div class="flex gap-2">
        <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="meta.page <= 1" @click="$emit('change-page', meta.page - 1)">
          Prev
        </button>
        <button class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50" :disabled="meta.page >= meta.totalPages" @click="$emit('change-page', meta.page + 1)">
          Next
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  courses: { type: Array, required: true },
  edits: { type: Object, required: true },
  meta: { type: Object, required: true },
  filters: { type: Object, required: true }
});

defineEmits(["apply-filters", "change-page", "save-status", "quick-status", "preview", "decision", "edit"]);
</script>
