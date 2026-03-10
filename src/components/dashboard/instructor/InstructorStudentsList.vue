<template>
  <article class="admin-card p-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Students</h3>
        <p class="text-xs text-slate-500">Pick a course to view enrollments.</p>
      </div>
      <select v-model="selectedCourseId" class="rounded border border-slate-300 px-2 py-1 text-xs">
        <option value="">Select course</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>
    </div>

    <div v-if="!selectedCourseId" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      Select a course to view enrolled students.
    </div>

    <div v-else>
      <div v-if="loading" class="mt-4 text-sm text-slate-600">Loading students...</div>
      <div v-else-if="!enrollments.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        No students enrolled yet.
      </div>
      <ul v-else class="mt-4 space-y-3">
        <li v-for="item in enrollments" :key="item.id" class="rounded-lg border border-slate-200 p-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-800">{{ item.user?.name }}</p>
              <p class="text-xs text-slate-500">{{ item.user?.email }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{{ item.status }}</span>
              <button class="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="$emit('view', item)">
                View
              </button>
            </div>
          </div>
          <div class="mt-2 text-xs text-slate-500">
            Enrolled: {{ formatDate(item.enrolledAt) }}
          </div>
        </li>
      </ul>
    </div>
  </article>
</template>

<script setup>
import { computed, watch } from "vue";

const props = defineProps({
  courses: { type: Array, required: true },
  enrollments: { type: Array, required: true },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(["load", "view"]);

const selectedCourseId = defineModel({ type: String, default: "" });

watch(selectedCourseId, (value) => {
  if (value) {
    emit("load", value);
  }
});

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
};
</script>
