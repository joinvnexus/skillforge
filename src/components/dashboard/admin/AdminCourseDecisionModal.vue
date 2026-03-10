<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
    <div class="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
      <div class="flex items-start justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Course Decision</p>
          <h3 class="text-lg font-semibold text-slate-900">{{ course?.title || "Course" }}</h3>
          <p class="mt-1 text-xs text-slate-500">Set status and leave a reviewer note.</p>
        </div>
        <button class="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50" @click="$emit('close')">
          Close
        </button>
      </div>

      <div class="px-6 py-5">
        <label class="text-xs font-semibold text-slate-600">Decision</label>
        <div class="mt-2 flex flex-wrap gap-2">
          <button
            class="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
            @click="status = 'PUBLISHED'"
          >
            Approve & Publish
          </button>
          <button
            class="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700"
            @click="status = 'REVIEW'"
          >
            Needs Changes
          </button>
          <button
            class="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
            @click="status = 'ARCHIVED'"
          >
            Reject / Archive
          </button>
        </div>

        <div class="mt-4">
          <label class="text-xs font-semibold text-slate-600">Reviewer Note</label>
          <textarea
            v-model="note"
            rows="4"
            placeholder="Explain why you approved/rejected and what should be changed."
            class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          ></textarea>
        </div>
      </div>

      <div class="border-t border-slate-200 px-6 py-4 text-right">
        <button class="rounded border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="$emit('close')">
          Cancel
        </button>
        <button
          class="ml-2 rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          @click="$emit('submit', { status, note })"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  course: { type: Object, default: null }
});

defineEmits(["close", "submit"]);

const status = ref("REVIEW");
const note = ref("");

watch(
  () => props.open,
  (value) => {
    if (value) {
      status.value = "REVIEW";
      note.value = "";
    }
  }
);
</script>
