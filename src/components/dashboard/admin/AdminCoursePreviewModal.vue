<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
    <div class="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
      <div class="flex items-start justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Course Preview</p>
          <h3 class="text-lg font-semibold text-slate-900">{{ course?.title || "Course" }}</h3>
          <p class="mt-1 text-xs text-slate-500">{{ course?.slug }}</p>
        </div>
        <button class="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50" @click="$emit('close')">
          Close
        </button>
      </div>

      <div class="grid gap-4 px-6 py-5 md:grid-cols-2">
        <div>
          <p class="text-xs font-semibold text-slate-600">Summary</p>
          <p class="mt-2 text-sm text-slate-600">{{ course?.shortDescription || "No short description." }}</p>
          <div class="mt-4 space-y-2 text-xs text-slate-600">
            <p><span class="font-semibold text-slate-700">Status:</span> {{ course?.status }}</p>
            <p><span class="font-semibold text-slate-700">Level:</span> {{ course?.level }}</p>
            <p><span class="font-semibold text-slate-700">Language:</span> {{ course?.language }}</p>
            <p><span class="font-semibold text-slate-700">Duration:</span> {{ course?.durationText || "Not set" }}</p>
          </div>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-600">Owner & Pricing</p>
          <div class="mt-2 space-y-2 text-xs text-slate-600">
            <p><span class="font-semibold text-slate-700">Author:</span> {{ course?.author?.name || "Unknown" }}</p>
            <p><span class="font-semibold text-slate-700">Instructor:</span> {{ course?.instructor?.user?.name || "N/A" }}</p>
            <p><span class="font-semibold text-slate-700">Category:</span> {{ course?.category?.name || "Uncategorized" }}</p>
            <p><span class="font-semibold text-slate-700">Price:</span> ${{ Number(course?.price || 0).toFixed(2) }}</p>
            <p v-if="course?.salePrice"><span class="font-semibold text-slate-700">Sale:</span> ${{ Number(course?.salePrice || 0).toFixed(2) }}</p>
          </div>
          <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            Ratings: {{ Number(course?.averageRating || 0).toFixed(1) }} ({{ course?.reviewCount || 0 }} reviews)
          </div>
        </div>
      </div>

      <div class="border-t border-slate-200 px-6 py-4 text-right">
        <button class="rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('close')">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  course: { type: Object, default: null }
});

defineEmits(["close"]);
</script>
