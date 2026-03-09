<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Instructor Course Studio</h1>
      <button
        class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        @click="reload"
      >
        Refresh
      </button>
    </div>

    <div v-if="loading" class="rounded-xl bg-white p-5 shadow">Loading courses...</div>
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{{ error }}</div>

    <div v-else class="grid gap-4">
      <article
        v-for="course in courses"
        :key="course.id"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">{{ course.title }}</h2>
            <p class="text-sm text-slate-500">{{ course.shortDescription }}</p>
            <p class="mt-2 text-xs uppercase tracking-wide text-sky-700">Status: {{ course.status }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              @click="setStatus(course.id, 'DRAFT')"
            >
              Move to Draft
            </button>
            <button
              class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              @click="setStatus(course.id, 'REVIEW')"
            >
              Send Review
            </button>
            <button
              class="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
              @click="deleteCourse(course.id)"
            >
              Delete
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
import { onMounted, ref } from 'vue'
import { apiRequest } from '@/lib/api'

const loading = ref(true)
const error = ref(null)
const courses = ref([])

const reload = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiRequest('/instructor/courses', { auth: true })
    courses.value = response.data || []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const setStatus = async (courseId, status) => {
  try {
    await apiRequest(`/instructor/courses/${courseId}/status`, {
      method: 'PATCH',
      auth: true,
      body: { status }
    })
    await reload()
  } catch (err) {
    error.value = err.message
  }
}

const deleteCourse = async (courseId) => {
  try {
    await apiRequest(`/instructor/courses/${courseId}`, {
      method: 'DELETE',
      auth: true
    })
    await reload()
  } catch (err) {
    error.value = err.message
  }
}

onMounted(reload)
</script>
