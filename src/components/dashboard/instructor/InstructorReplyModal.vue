<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
    <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
      <div class="flex items-start justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Reply to Review</p>
          <h3 class="text-lg font-semibold text-slate-900">Instructor Reply</h3>
        </div>
        <button class="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50" @click="$emit('close')">
          Close
        </button>
      </div>

      <div class="px-6 py-5">
        <label class="text-xs font-semibold text-slate-600">Reply</label>
        <textarea
          v-model="reply"
          rows="4"
          placeholder="Write a thoughtful response..."
          class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        ></textarea>
      </div>

      <div class="border-t border-slate-200 px-6 py-4 text-right">
        <button class="rounded border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="$emit('close')">
          Cancel
        </button>
        <button class="ml-2 rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('submit', reply)">
          Send Reply
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  review: { type: Object, default: null }
});

defineEmits(["close", "submit"]);

const reply = ref("");

watch(
  () => props.open,
  (value) => {
    if (value) {
      reply.value = "";
    }
  }
);
</script>
