<template>
  <section class="space-y-6">
    <div class="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 p-6 text-white shadow-lg">
      <p class="text-sm uppercase tracking-widest text-sky-200">Dashboard</p>
      <h1 class="mt-2 text-2xl font-bold">{{ heading }}</h1>
      <p class="mt-2 text-slate-200">{{ subtitle }}</p>
    </div>

    <div v-if="loading" class="rounded-xl bg-white p-6 text-gray-600 shadow">Loading overview...</div>
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{{ error }}</div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in cards"
        :key="card.label"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-slate-500">{{ card.label }}</p>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ card.value }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { apiRequest } from '@/lib/api'

const store = useStore()
const loading = ref(true)
const error = ref(null)
const data = ref({})
const role = computed(() => store.getters['auth/userRole'])

const heading = computed(() => {
  if (role.value === 'ADMIN') return 'Admin Overview'
  if (role.value === 'INSTRUCTOR') return 'Instructor Overview'
  return 'Student Overview'
})

const subtitle = computed(() => {
  if (role.value === 'ADMIN') return 'Manage users, courses, testimonials, and platform quality.'
  if (role.value === 'INSTRUCTOR') return 'Track course performance and publish better content.'
  return 'Track your learning streak and continue where you left off.'
})

const cards = computed(() => {
  if (role.value === 'ADMIN') {
    return [
      { label: 'Total Users', value: data.value.users ?? 0 },
      { label: 'Courses', value: data.value.courses ?? 0 },
      { label: 'Courses In Review', value: data.value.coursesInReview ?? 0 },
      { label: 'Pending Testimonials', value: data.value.pendingTestimonials ?? 0 }
    ]
  }

  if (role.value === 'INSTRUCTOR') {
    return [
      { label: 'Total Courses', value: data.value.totalCourses ?? 0 },
      { label: 'Published Courses', value: data.value.publishedCourses ?? 0 },
      { label: 'Total Students', value: data.value.totalStudents ?? 0 },
      { label: 'Total Reviews', value: data.value.totalReviews ?? 0 }
    ]
  }

  return [
    { label: 'Active Courses', value: data.value.activeCourses ?? 0 },
    { label: 'Completed Courses', value: data.value.completedCourses ?? 0 },
    { label: 'Wishlist Items', value: data.value.wishlistCount ?? 0 },
    { label: 'Unread Notifications', value: data.value.unreadNotifications ?? 0 }
  ]
})

const endpointByRole = {
  ADMIN: '/admin/dashboard/overview',
  INSTRUCTOR: '/instructor/dashboard/overview',
  STUDENT: '/student/dashboard/overview'
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const endpoint = endpointByRole[role.value] || endpointByRole.STUDENT
    const response = await apiRequest(endpoint, { auth: true })
    data.value = response.data || {}
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
