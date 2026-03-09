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
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">{{ course.title }}</h2>
            <p class="mt-1 text-sm text-slate-500">{{ course.instructorName }}</p>
          </div>
          <button
            class="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            @click="toggleExpand(course.enrollmentId)"
          >
            {{ expandedEnrollments[course.enrollmentId] ? 'Hide Lessons' : 'Track Lessons' }}
          </button>
        </div>
        <p class="mt-3 text-sm text-slate-600">Progress: {{ course.progress || 0 }}%</p>
        <div class="mt-2 h-2 rounded-full bg-slate-100">
          <div class="h-2 rounded-full bg-sky-600 transition-all" :style="{ width: `${course.progress || 0}%` }"></div>
        </div>

        <div v-if="expandedEnrollments[course.enrollmentId]" class="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div v-for="section in course.sections || []" :key="section.id" class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ section.title }}</p>
            <ul class="space-y-2">
              <li
                v-for="lesson in section.lessons || []"
                :key="lesson.id"
                class="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
              >
                <div>
                  <p class="text-sm font-medium text-slate-800">{{ lesson.title }}</p>
                  <p class="text-xs text-slate-500">{{ lesson.duration }}</p>
                </div>
                <button
                  class="rounded-md px-2.5 py-1 text-xs font-semibold"
                  :class="isLessonCompleted(course, lesson.id) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'"
                  :disabled="updatingLessonId === lesson.id"
                  @click="toggleLesson(course.enrollmentId, lesson.id, !isLessonCompleted(course, lesson.id))"
                >
                  {{ updatingLessonId === lesson.id ? 'Saving...' : isLessonCompleted(course, lesson.id) ? 'Completed' : 'Mark Complete' }}
                </button>
              </li>
            </ul>
          </div>
          <p v-if="!hasLessons(course)" class="text-sm text-slate-500">No lessons available yet for this course.</p>
        </div>

        <div class="mt-4 flex items-center gap-2">
          <router-link
            :to="`/courses/${course.slug || course.id}`"
            class="inline-block rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Continue
          </router-link>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      expandedEnrollments: {},
      updatingLessonId: null
    }
  },
  computed: {
    ...mapState('enrollments', ['enrolledCourses', 'loading', 'error'])
  },
  methods: {
    ...mapActions('enrollments', ['fetchEnrolledCourses', 'updateProgress']),
    toggleExpand(enrollmentId) {
      this.expandedEnrollments = {
        ...this.expandedEnrollments,
        [enrollmentId]: !this.expandedEnrollments[enrollmentId]
      }
    },
    isLessonCompleted(course, lessonId) {
      return (course.completedLessonIds || []).includes(lessonId)
    },
    hasLessons(course) {
      return (course.sections || []).some((section) => (section.lessons || []).length > 0)
    },
    async toggleLesson(enrollmentId, lessonId, isCompleted) {
      this.updatingLessonId = lessonId
      try {
        await this.updateProgress({ enrollmentId, lessonId, isCompleted })
      } finally {
        this.updatingLessonId = null
      }
    }
  },
  async created() {
    await this.fetchEnrolledCourses()
  }
}
</script>
