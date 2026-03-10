<template>
  <article class="admin-card p-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Create New Course</h3>
        <p class="text-xs text-slate-500">Start a new draft for review.</p>
      </div>
    </div>

    <div class="mt-4 grid gap-3 md:grid-cols-2">
      <input v-model="form.slug" type="text" placeholder="Slug (e.g. vue-for-beginners)" class="rounded border border-slate-300 px-3 py-2 text-sm" />
      <input v-model="form.title" type="text" placeholder="Title" class="rounded border border-slate-300 px-3 py-2 text-sm" />
      <input v-model="form.shortDescription" type="text" placeholder="Short description" class="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
      <input v-model="form.level" type="text" placeholder="Level (Beginner/Intermediate/Advanced)" class="rounded border border-slate-300 px-3 py-2 text-sm" />
      <input v-model.number="form.price" type="number" min="0" step="0.01" placeholder="Price" class="rounded border border-slate-300 px-3 py-2 text-sm" />
    </div>

    <button class="mt-4 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800" :disabled="loading" @click="submit">
      {{ loading ? "Saving..." : "Create Course" }}
    </button>

    <p v-if="localError" class="mt-3 text-sm text-red-600">{{ localError }}</p>
    <p v-else-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
  </article>
</template>

<script setup>
import { ref } from "vue";
import { validateCourseDraft } from "@/lib/validation";

defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" }
});

const emit = defineEmits(["create"]);

const form = ref({
  slug: "",
  title: "",
  shortDescription: "",
  level: "Beginner",
  price: 0
});

const localError = ref("");

const submit = () => {
  localError.value = validateCourseDraft(form.value);
  if (localError.value) return;
  emit("create", { ...form.value });
  form.value = { slug: "", title: "", shortDescription: "", level: "Beginner", price: 0 };
};
</script>
