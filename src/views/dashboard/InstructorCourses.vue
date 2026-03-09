<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Instructor Course Studio</h1>
      <button class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" @click="reload">
        Refresh
      </button>
    </div>

    <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="text-lg font-semibold text-slate-900">Create New Course</h2>
      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <input v-model="createForm.slug" type="text" placeholder="Slug (e.g. vue-for-beginners)" class="rounded border border-slate-300 px-3 py-2 text-sm" />
        <input v-model="createForm.title" type="text" placeholder="Title" class="rounded border border-slate-300 px-3 py-2 text-sm" />
        <input v-model="createForm.shortDescription" type="text" placeholder="Short description" class="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
        <input v-model="createForm.level" type="text" placeholder="Level (Beginner/Intermediate/Advanced)" class="rounded border border-slate-300 px-3 py-2 text-sm" />
        <input v-model.number="createForm.price" type="number" min="0" step="0.01" placeholder="Price" class="rounded border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <button class="mt-4 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800" :disabled="actionLoading" @click="createCourse">
        {{ actionLoading ? "Saving..." : "Create Course" }}
      </button>
      <p v-if="formError" class="mt-3 text-sm text-red-600">{{ formError }}</p>
    </article>

    <div v-if="loading" class="rounded-xl bg-white p-5 shadow">Loading courses...</div>
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{{ error }}</div>

    <div v-else class="grid gap-4">
      <article v-for="course in courses" :key="course.id" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="space-y-1">
            <h2 class="text-lg font-semibold text-slate-900">{{ course.title }}</h2>
            <p class="text-sm text-slate-500">{{ course.shortDescription }}</p>
            <p class="text-xs uppercase tracking-wide text-sky-700">Status: {{ course.status }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="openEdit(course)">
              Edit
            </button>
            <button class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="setStatus(course.id, 'DRAFT')">
              Move to Draft
            </button>
            <button class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="setStatus(course.id, 'REVIEW')">
              Send Review
            </button>
            <button class="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50" @click="deleteCourse(course.id)">
              Delete
            </button>
          </div>
        </div>

        <div v-if="editingId === course.id" class="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
          <input v-model="editForm.slug" type="text" placeholder="Slug" class="rounded border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="editForm.title" type="text" placeholder="Title" class="rounded border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="editForm.shortDescription" type="text" placeholder="Short description" class="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
          <input v-model="editForm.level" type="text" placeholder="Level" class="rounded border border-slate-300 px-3 py-2 text-sm" />
          <input v-model.number="editForm.price" type="number" min="0" step="0.01" placeholder="Price" class="rounded border border-slate-300 px-3 py-2 text-sm" />
          <div class="md:col-span-2 flex gap-2">
            <button class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800" :disabled="actionLoading" @click="saveEdit(course.id)">
              Save Changes
            </button>
            <button class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100" @click="closeEdit">
              Cancel
            </button>
          </div>
        </div>
      </article>

      <div v-if="courses.length === 0" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
        No instructor courses found yet.
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { apiRequest } from "@/lib/api";
import { validateCourseDraft } from "@/lib/validation";

const loading = ref(true);
const actionLoading = ref(false);
const error = ref(null);
const formError = ref("");
const courses = ref([]);
const editingId = ref(null);
const editForm = ref({
  slug: "",
  title: "",
  shortDescription: "",
  level: "",
  price: 0
});
const createForm = ref({
  slug: "",
  title: "",
  shortDescription: "",
  level: "Beginner",
  price: 0
});

const reload = async () => {
  loading.value = true;
  error.value = null;
  formError.value = "";
  try {
    const response = await apiRequest("/instructor/courses", { auth: true });
    courses.value = response.data || [];
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const createCourse = async () => {
  actionLoading.value = true;
  error.value = null;
  formError.value = validateCourseDraft(createForm.value);
  if (formError.value) {
    actionLoading.value = false;
    return;
  }
  try {
    await apiRequest("/instructor/courses", {
      method: "POST",
      auth: true,
      body: createForm.value
    });
    createForm.value = { slug: "", title: "", shortDescription: "", level: "Beginner", price: 0 };
    await reload();
  } catch (err) {
    error.value = err.message;
  } finally {
    actionLoading.value = false;
  }
};

const openEdit = (course) => {
  formError.value = "";
  editingId.value = course.id;
  editForm.value = {
    slug: course.slug || "",
    title: course.title || "",
    shortDescription: course.shortDescription || "",
    level: course.level || "",
    price: Number(course.price || 0)
  };
};

const closeEdit = () => {
  formError.value = "";
  editingId.value = null;
};

const saveEdit = async (courseId) => {
  actionLoading.value = true;
  error.value = null;
  formError.value = validateCourseDraft(editForm.value);
  if (formError.value) {
    actionLoading.value = false;
    return;
  }
  try {
    await apiRequest(`/instructor/courses/${courseId}`, {
      method: "PATCH",
      auth: true,
      body: editForm.value
    });
    closeEdit();
    await reload();
  } catch (err) {
    error.value = err.message;
  } finally {
    actionLoading.value = false;
  }
};

const setStatus = async (courseId, status) => {
  try {
    await apiRequest(`/instructor/courses/${courseId}/status`, {
      method: "PATCH",
      auth: true,
      body: { status }
    });
    await reload();
  } catch (err) {
    error.value = err.message;
  }
};

const deleteCourse = async (courseId) => {
  try {
    await apiRequest(`/instructor/courses/${courseId}`, {
      method: "DELETE",
      auth: true
    });
    await reload();
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(reload);
</script>
