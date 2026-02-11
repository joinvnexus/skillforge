<template>
  <div class="enrolled-courses">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">My Enrolled Courses</h1>
      <p class="text-gray-600 mt-1">Continue learning where you left off</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 text-red-700 p-6 rounded-xl text-center">
      <p>{{ error }}</p>
      <button @click="fetchEnrolledCourses" class="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="enrolledCourses.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <div class="mb-4">
        <i class="fas fa-book-open text-6xl text-gray-300"></i>
      </div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">No Enrolled Courses Yet</h3>
      <p class="text-gray-600 mb-6">Start learning by enrolling in a course</p>
      <router-link to="/courses" class="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
        Browse Courses
      </router-link>
    </div>

    <!-- Enrolled Courses Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="course in enrolledCourses" 
        :key="course.id"
        class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Course Image -->
        <div class="relative">
          <img 
            :src="course.image || 'https://picsum.photos/id/28/367/267'" 
            :alt="course.title"
            class="w-full h-40 object-cover"
          >
          <div class="absolute top-3 right-3">
            <span class="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
              {{ course.progress || 0 }}% Complete
            </span>
          </div>
        </div>

        <!-- Course Content -->
        <div class="p-5">
          <span class="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded mb-2">
            {{ course.category }}
          </span>
          <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{{ course.title }}</h3>
          <p class="text-sm text-gray-600 mb-3">by {{ course.instructor }}</p>

          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{{ course.progress || 0 }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                :style="{ width: `${course.progress || 0}%` }"
              ></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <router-link 
              :to="`/courses/${course.id}`"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-center font-medium rounded hover:bg-gray-200 transition"
            >
              View Course
            </router-link>
            <button 
              @click="continueLearning(course)"
              class="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition"
            >
              Continue
            </button>
          </div>

          <!-- Enrolled Date -->
          <p class="text-xs text-gray-500 mt-3">
            Enrolled on {{ formatDate(course.enrolled_at) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { useStore } from 'vuex'

export default {
  name: 'MyEnrolledCourses',
  data() {
    return {
      loading: false,
      error: null
    }
  },
  computed: {
    ...mapState('enrollments', ['enrolledCourses', 'loading', 'error']),
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions('enrollments', ['fetchEnrolledCourses']),
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    continueLearning(course) {
      // Navigate to course with lesson view
      this.$router.push(`/courses/${course.id}?lesson=continue`)
    }
  },
  async created() {
    const store = useStore()
    const user = store.state.auth.user
    
    if (!user) {
      this.$router.push({ name: 'Login', query: { redirect: '/dashboard/my-courses' } })
      return
    }

    this.loading = true
    this.error = null
    
    try {
      await this.fetchEnrolledCourses(user.id)
    } catch (error) {
      this.error = 'Failed to load enrolled courses: ' + error.message
    } finally {
      this.loading = false
    }
  }
}
</script>
