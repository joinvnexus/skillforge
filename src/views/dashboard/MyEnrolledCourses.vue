<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">My Enrolled Courses</h1>
      <p class="text-slate-500">Track your active learning progress.</p>
    </div>

    <div v-if="loading" class="rounded-xl bg-white p-6 shadow-sm">Loading enrollments...</div>
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{{ error }}</div>
    <div
      v-else-if="enrolledCourses.length === 0"
      class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600"
    >
      You have no active enrollments yet.
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <article v-for="course in enrolledCourses" :key="course.enrollmentId" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">{{ course.title }}</h2>
        <p class="mt-1 text-sm text-slate-500">{{ course.instructorName }}</p>
        <p class="mt-3 text-sm text-slate-600">Progress: {{ course.progress || 0 }}%</p>
        <div class="mt-2 h-2 rounded-full bg-slate-100">
          <div class="h-2 rounded-full bg-sky-600" :style="{ width: `${course.progress || 0}%` }"></div>
        </div>
        <router-link
          :to="`/courses/${course.id}`"
          class="mt-4 inline-block rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Continue
        </router-link>
      </article>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('enrollments', ['enrolledCourses', 'loading', 'error'])
  },
  methods: {
    ...mapActions('enrollments', ['fetchEnrolledCourses'])
  },
  async created() {
    await this.fetchEnrolledCourses()
  }
}
</script>
