<template>
  <article class="admin-card p-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Announcements</h3>
        <p class="text-xs text-slate-500">Send updates to enrolled students.</p>
      </div>
      <span class="admin-pill">Live</span>
    </div>

    <div class="mt-4 grid gap-3 md:grid-cols-2">
      <input v-model="form.title" type="text" placeholder="Announcement title" class="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
      <select v-model="form.courseId" class="rounded border border-slate-300 px-3 py-2 text-sm">
        <option value="">All courses</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>
      <select v-model="form.type" class="rounded border border-slate-300 px-3 py-2 text-sm">
        <option value="COURSE">COURSE</option>
        <option value="SYSTEM">SYSTEM</option>
        <option value="ENROLLMENT">ENROLLMENT</option>
      </select>
      <textarea v-model="form.message" rows="3" placeholder="Write announcement message" class="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"></textarea>
    </div>

    <button class="mt-4 rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800" :disabled="loading" @click="submit">
      {{ loading ? "Sending..." : "Send Announcement" }}
    </button>
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </article>
</template>

<script setup>
import { reactive, ref } from "vue";

const props = defineProps({
  courses: { type: Array, required: true }
});

const emit = defineEmits(["send"]);

const form = reactive({
  title: "",
  message: "",
  type: "COURSE",
  courseId: ""
});

const loading = ref(false);
const error = ref("");

const submit = () => {
  if (!form.title.trim() || !form.message.trim()) {
    error.value = "Title and message are required.";
    return;
  }
  error.value = "";
  loading.value = true;
  emit("send", {
    title: form.title.trim(),
    message: form.message.trim(),
    type: form.type,
    courseId: form.courseId || null
  });
  form.title = "";
  form.message = "";
  form.type = "COURSE";
  form.courseId = "";
  loading.value = false;
};
</script>
