<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
    <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
      <div class="flex items-start justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Edit Course</p>
          <h3 class="text-lg font-semibold text-slate-900">{{ course?.title || "Course" }}</h3>
          <p class="mt-1 text-xs text-slate-500">{{ course?.slug }}</p>
        </div>
        <button class="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50" @click="$emit('close')">
          Close
        </button>
      </div>

      <div class="px-6 py-5">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="md:col-span-2">
            <label class="text-xs font-semibold text-slate-600">Title</label>
            <input v-model="form.title" type="text" placeholder="Course title" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">Price</label>
            <input v-model="form.price" type="number" min="0" step="0.01" placeholder="0.00" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">Sale Price (optional)</label>
            <input v-model="form.salePrice" type="number" min="0" step="0.01" placeholder="0.00" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div class="md:col-span-2">
            <label class="text-xs font-semibold text-slate-600">Thumbnail URL</label>
            <input v-model="form.thumbnailUrl" type="text" placeholder="https://..." class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <div class="border-t border-slate-200 px-6 py-4 text-right">
        <button class="rounded border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="$emit('close')">
          Cancel
        </button>
        <button class="ml-2 rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('save', form)">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  course: { type: Object, default: null }
});

defineEmits(["close", "save"]);

const form = reactive({
  title: "",
  price: "",
  salePrice: "",
  thumbnailUrl: ""
});

watch(
  () => props.open,
  (value) => {
    if (value && props.course) {
      form.title = props.course.title || "";
      form.price = props.course.price ?? "";
      form.salePrice = props.course.salePrice ?? "";
      form.thumbnailUrl = props.course.thumbnailUrl || "";
    }
  }
);
</script>
