<template>
  <section class="py-12 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          <span class="block">Most Popular Courses</span>
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            Learn what others are taking
          </span>
        </h2>
        <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Join thousands of students in our top-rated courses
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-500">
        {{ error }}
        <button
          @click="fetchPopularCourses"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Courses Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div 
          v-for="course in popularCourses"
          :key="course.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <!-- Course Image -->
          <div class="relative h-48 w-full">
            <img 
              :src="course.image || '/placeholder-course.jpg'" 
              :alt="course.title"
              class="w-full h-full object-cover"
            >
            <!-- Badges -->
            <div class="absolute top-3 right-3 flex space-x-2">
              <span v-if="course.isPopular" class="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                Popular
              </span>
              <span v-if="course.price === 0" class="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                FREE
              </span>
            </div>
          </div>

          <!-- Course Content -->
          <div class="p-6 flex-grow flex flex-col">
            <div class="flex-grow">
              <h3 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {{ course.title }}
              </h3>
              <p class="text-gray-600 text-sm mb-3">By {{ course.instructor || 'Unknown Instructor' }}</p>
              <p class="text-gray-700 text-sm mb-4 line-clamp-2">
                {{ course.description || 'No description available' }}
              </p>
            </div>

            <!-- Rating and Price -->
            <div class="mt-auto">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <div class="flex text-yellow-400 mr-1">
                    <span v-for="star in 5" :key="star">
                      <svg
                        class="w-4 h-4"
                        :class="{ 'text-gray-300': star > Math.round(course.rating || 0) }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </span>
                  </div>
                  <span class="text-gray-600 text-sm">
                    {{ (course.rating || 0).toFixed(1) }} ({{ course.reviews || 0 }})
                  </span>
                </div>
                <span class="text-gray-900 font-semibold">
                  {{ course.price === 0 ? 'Free' : '$' + course.price }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <button
                  @click="openQuickView(course)"
                  class="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Quick View
                </button>
                <button
                  @click="enrollCourse(course)"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <div class="mt-10 text-center">
        <router-link
          to="/courses"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          View All Courses
          <svg class="ml-3 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Quick View Modal -->
    <CourseQuickView
      v-if="selectedCourse"
      :course="selectedCourse"
      @close="closeQuickView"
    />
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import CourseQuickView from './CourseQuickView.vue'

export default {
  name: 'PopularCourses',
  components: { CourseQuickView },
  computed: {
    ...mapState('courses', ['loading', 'error']),
    ...mapState('ui', ['selectedCourse']),
    ...mapGetters('courses', ['getPopularCourses']),
    popularCourses() {
      return this.getPopularCourses.slice(0, 4) // Show top 4 popular courses
    }
  },
  methods: {
    ...mapActions('courses', [
      'fetchCourses'
    ]),
    ...mapActions('ui', [
      'openQuickView',
      'closeQuickView'
    ]),
    fetchPopularCourses() {
      this.fetchCourses()
    },
    enrollCourse(course) {
      // Implement enrollment logic
      console.log('Enrolling in:', course.title)
      // this.$router.push(`/checkout/${course.id}`)
    }
  },
  created() {
    if (this.getPopularCourses.length === 0) {
      this.fetchCourses()
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>