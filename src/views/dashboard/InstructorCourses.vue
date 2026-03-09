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

    <DashboardState v-if="loading" type="loading" title="Loading courses..." />
    <DashboardState v-else-if="error" type="error" title="Course studio failed to load" :description="error" show-retry @retry="reload" />

    <div v-else class="grid gap-4">
      <article v-for="course in courses" :key="course.id" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div class="space-y-1">
            <h2 class="text-lg font-semibold text-slate-900">{{ course.title }}</h2>
            <p class="text-sm text-slate-500">{{ course.shortDescription }}</p>
            <p class="text-xs uppercase tracking-wide text-sky-700">Status: {{ course.status }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <a
              :href="`/courses/${course.slug || course.id}`"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-md border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Preview
            </a>
            <button class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="toggleStudio(course.id)">
              {{ expandedStudioCourseId === course.id ? "Hide Studio" : "Open Studio" }}
            </button>
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

        <div v-if="expandedStudioCourseId === course.id" class="mt-5 space-y-4 rounded-xl border border-sky-100 bg-sky-50/40 p-4">
          <div v-if="studioLoading" class="rounded-lg bg-white p-3 text-sm text-slate-600">Loading studio data...</div>

          <template v-else>
            <div class="rounded-lg border border-slate-200 bg-white p-3">
              <p class="text-sm font-semibold text-slate-900">Add Section</p>
              <div class="mt-2 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <input
                  v-model="studioSectionForm.title"
                  type="text"
                  placeholder="Section title"
                  class="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  v-model="studioSectionForm.description"
                  type="text"
                  placeholder="Section description (optional)"
                  class="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <button class="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800" :disabled="actionLoading" @click="addSection(course.id)">
                  Add Section
                </button>
              </div>
            </div>

            <div v-for="section in currentStudio.sections || []" :key="section.id" class="rounded-lg border border-slate-200 bg-white p-3">
              <p class="text-sm font-semibold text-slate-900">{{ section.position }}. {{ section.title }}</p>
              <p v-if="section.description" class="mt-1 text-xs text-slate-500">{{ section.description }}</p>

              <ul class="mt-3 space-y-2">
                <li v-for="lesson in section.lessons || []" :key="lesson.id" class="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2">
                  <div>
                    <p class="text-sm font-medium text-slate-800">{{ lesson.title }}</p>
                    <p class="text-xs text-slate-500">{{ lesson.slug }} · {{ lesson.type }} · {{ lesson.durationMinutes || 0 }} min</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span v-if="lesson.isPreview" class="rounded bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">Preview</span>
                    <button class="rounded border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="openLessonEditor(course.id, lesson)">
                      Edit Lesson
                    </button>
                  </div>
                </li>
              </ul>

              <div class="mt-3 grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-5">
                <input
                  v-model="lessonDrafts[section.id].title"
                  type="text"
                  placeholder="Lesson title"
                  class="rounded border border-slate-300 px-2.5 py-2 text-xs md:col-span-2"
                />
                <input
                  v-model="lessonDrafts[section.id].slug"
                  type="text"
                  placeholder="Lesson slug"
                  class="rounded border border-slate-300 px-2.5 py-2 text-xs"
                />
                <select v-model="lessonDrafts[section.id].type" class="rounded border border-slate-300 px-2.5 py-2 text-xs">
                  <option value="VIDEO">VIDEO</option>
                  <option value="ARTICLE">ARTICLE</option>
                  <option value="RESOURCE">RESOURCE</option>
                  <option value="ASSIGNMENT">ASSIGNMENT</option>
                </select>
                <button class="rounded bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white hover:bg-slate-800" :disabled="actionLoading" @click="addLesson(course.id, section.id)">
                  Add Lesson
                </button>
              </div>
            </div>

            <p v-if="!(currentStudio.sections || []).length" class="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
              No sections yet. Add your first section.
            </p>
          </template>
        </div>
      </article>

      <DashboardState
        v-if="courses.length === 0"
        type="empty"
        title="No instructor courses found yet."
        description="Create your first course to start building sections and lessons."
      />
    </div>

    <div v-if="lessonEditor.open" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4">
      <div class="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">Edit Lesson</h3>
          <button class="rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="closeLessonEditor">
            Close
          </button>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <input v-model="lessonEditor.form.title" type="text" placeholder="Lesson title" class="rounded border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="lessonEditor.form.slug" type="text" placeholder="Lesson slug" class="rounded border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="lessonEditor.form.videoUrl" type="url" placeholder="Video URL (optional)" class="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
          <input v-model.number="lessonEditor.form.durationMinutes" type="number" min="0" placeholder="Duration in minutes" class="rounded border border-slate-300 px-3 py-2 text-sm" />
          <label class="inline-flex items-center gap-2 text-sm text-slate-700">
            <input v-model="lessonEditor.form.isPreview" type="checkbox" />
            Preview lesson
          </label>
          <textarea
            v-model="lessonEditor.form.attachmentsText"
            rows="4"
            class="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            placeholder="Resource URLs (one per line)"
          ></textarea>
        </div>
        <button class="mt-4 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800" :disabled="actionLoading" @click="saveLessonEditor">
          {{ actionLoading ? "Saving..." : "Save Lesson" }}
        </button>
        <p v-if="formError" class="mt-2 text-sm text-red-600">{{ formError }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { apiRequest } from "@/lib/api";
import { validateCourseDraft, validateTrimmedLength } from "@/lib/validation";
import DashboardState from "@/components/dashboard/DashboardState.vue";

const loading = ref(true);
const actionLoading = ref(false);
const studioLoading = ref(false);
const error = ref(null);
const formError = ref("");
const courses = ref([]);
const editingId = ref(null);
const expandedStudioCourseId = ref(null);
const currentStudio = ref({ sections: [] });
const studioSectionForm = ref({ title: "", description: "" });
const lessonDrafts = ref({});
const lessonEditor = ref({
  open: false,
  courseId: null,
  lessonId: null,
  form: {
    title: "",
    slug: "",
    videoUrl: "",
    durationMinutes: 0,
    isPreview: false,
    attachmentsText: ""
  }
});

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

const sectionDraft = (sectionId) => {
  if (!lessonDrafts.value[sectionId]) {
    lessonDrafts.value[sectionId] = { title: "", slug: "", type: "VIDEO" };
  }
  return lessonDrafts.value[sectionId];
};

const hydrateLessonDrafts = () => {
  for (const section of currentStudio.value.sections || []) {
    sectionDraft(section.id);
  }
};

const loadStudio = async (courseId) => {
  studioLoading.value = true;
  formError.value = "";
  try {
    const response = await apiRequest(`/instructor/courses/${courseId}/studio`, { auth: true });
    currentStudio.value = response.data || { sections: [] };
    hydrateLessonDrafts();
  } catch (err) {
    error.value = err.message;
  } finally {
    studioLoading.value = false;
  }
};

const toggleStudio = async (courseId) => {
  if (expandedStudioCourseId.value === courseId) {
    expandedStudioCourseId.value = null;
    return;
  }
  expandedStudioCourseId.value = courseId;
  await loadStudio(courseId);
};

const reload = async () => {
  loading.value = true;
  error.value = null;
  formError.value = "";
  try {
    const response = await apiRequest("/instructor/courses", { auth: true });
    courses.value = response.data || [];
    if (expandedStudioCourseId.value) {
      await loadStudio(expandedStudioCourseId.value);
    }
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

const addSection = async (courseId) => {
  formError.value = validateTrimmedLength(studioSectionForm.value.title, "Section title", { min: 2, max: 180 });
  if (formError.value) return;

  actionLoading.value = true;
  try {
    await apiRequest(`/instructor/courses/${courseId}/sections`, {
      method: "POST",
      auth: true,
      body: {
        title: studioSectionForm.value.title.trim(),
        description: studioSectionForm.value.description?.trim() || ""
      }
    });
    studioSectionForm.value = { title: "", description: "" };
    await loadStudio(courseId);
  } catch (err) {
    error.value = err.message;
  } finally {
    actionLoading.value = false;
  }
};

const addLesson = async (courseId, sectionId) => {
  const draft = sectionDraft(sectionId);
  formError.value = validateTrimmedLength(draft.title, "Lesson title", { min: 2, max: 180 });
  if (formError.value) return;
  formError.value = validateTrimmedLength(draft.slug, "Lesson slug", { min: 2, max: 180 });
  if (formError.value) return;

  actionLoading.value = true;
  try {
    await apiRequest(`/instructor/sections/${sectionId}/lessons`, {
      method: "POST",
      auth: true,
      body: {
        title: draft.title.trim(),
        slug: draft.slug.trim().toLowerCase(),
        type: draft.type || "VIDEO"
      }
    });
    lessonDrafts.value[sectionId] = { title: "", slug: "", type: "VIDEO" };
    await loadStudio(courseId);
  } catch (err) {
    error.value = err.message;
  } finally {
    actionLoading.value = false;
  }
};

const openLessonEditor = (courseId, lesson) => {
  lessonEditor.value = {
    open: true,
    courseId,
    lessonId: lesson.id,
    form: {
      title: lesson.title || "",
      slug: lesson.slug || "",
      videoUrl: lesson.videoUrl || "",
      durationMinutes: Number(lesson.durationMinutes || 0),
      isPreview: Boolean(lesson.isPreview),
      attachmentsText: Array.isArray(lesson.attachments) ? lesson.attachments.join("\n") : ""
    }
  };
  formError.value = "";
};

const closeLessonEditor = () => {
  lessonEditor.value.open = false;
  formError.value = "";
};

const saveLessonEditor = async () => {
  const form = lessonEditor.value.form;
  formError.value = validateTrimmedLength(form.title, "Lesson title", { min: 2, max: 180 });
  if (formError.value) return;
  formError.value = validateTrimmedLength(form.slug, "Lesson slug", { min: 2, max: 180 });
  if (formError.value) return;

  const attachments = form.attachmentsText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  actionLoading.value = true;
  try {
    await apiRequest(`/instructor/lessons/${lessonEditor.value.lessonId}`, {
      method: "PATCH",
      auth: true,
      body: {
        title: form.title.trim(),
        slug: form.slug.trim().toLowerCase(),
        videoUrl: form.videoUrl?.trim() || null,
        durationMinutes: Number(form.durationMinutes || 0),
        isPreview: Boolean(form.isPreview),
        attachments
      }
    });
    await loadStudio(lessonEditor.value.courseId);
    closeLessonEditor();
  } catch (err) {
    error.value = err.message;
  } finally {
    actionLoading.value = false;
  }
};

onMounted(reload);
</script>
