<template>
  <div v-if="open" class="fixed inset-0 z-50 flex justify-end bg-slate-900/60">
    <div class="h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
      <div class="border-b border-slate-200 px-6 py-4">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Student Progress</p>
            <h3 class="text-lg font-semibold text-slate-900">{{ enrollment?.user?.name || "Student" }}</h3>
            <p class="mt-1 text-xs text-slate-500">{{ enrollment?.user?.email }}</p>
          </div>
          <button class="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50" @click="$emit('close')">
            Close
          </button>
        </div>
      </div>

      <div class="px-6 py-5">
        <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Progress: {{ enrollment?.progressPercent ?? 0 }}%
        </div>

        <div class="mt-4 text-xs text-slate-600">
          Enrolled: {{ formatDate(enrollment?.enrolledAt) }}
        </div>
        <div class="mt-1 text-xs text-slate-600">
          Last Accessed: {{ formatDate(enrollment?.lastAccessedAt) }}
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold text-slate-600">Status</p>
          <span class="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
            {{ enrollment?.status || "ACTIVE" }}
          </span>
        </div>

        <div class="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Detailed lesson progress will appear here once progress tracking is integrated.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  enrollment: { type: Object, default: null }
});

defineEmits(["close"]);

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
};
</script>
