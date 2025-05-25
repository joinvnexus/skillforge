<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Featured <span class="text-blue-600">Courses</span>
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn from industry experts with our top-rated courses
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
          @click="fetchCourses" 
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Courses Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div  
          v-for="(course, index) in getFeaturedCourses" 
          :key="course.id"
          class="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col"
          @mouseenter="hoveredCourse = index"
          @mouseleave="hoveredCourse = null"
        >
          <!-- Course Image -->
          <div class="h-48 overflow-hidden">
            <img 
              :src="course.image" 
              :alt="course.title"
              class="w-full h-full object-cover transition-transform duration-500"
              :class="{'scale-105': hoveredCourse === index}"
            >
          </div>

          <!-- Course Content -->
          <div class="p-6 flex-grow">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ course.title }}</h3>
            <p class="text-gray-600 mb-1">By {{ course.instructor }}</p>
            <div class="flex items-center mb-3">
              <div class="flex text-yellow-400 mr-2">
                <span v-for="star in 5" :key="star">
                  <svg 
                    class="w-5 h-5" 
                    :class="{ 'text-gray-300': star > Math.round(course.rating) }" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              </div>
              <span class="text-gray-600">{{ course.rating }} ({{ course.students }} students)</span>
            </div>
            <p class="text-gray-600 mb-4">{{ course.description }}</p>
          </div>

          <!-- Quick View Overlay -->
          <div 
            class="absolute inset-0 bg-blue-600 bg-opacity-90 text-white flex flex-col justify-center p-6 opacity-0 hover:opacity-100 transition-opacity duration-300"
            v-show="hoveredCourse === index"
          >
            <h3 class="text-xl font-semibold mb-4">{{ course.title }}</h3>
            <p class="mb-4">{{ course.descriptionExtended }}</p>
            <button 
              class="mt-auto px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100 transition-colors"
              @click="openQuickView(course)"
            >
              Quick View
            </button>
          </div> 
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <CourseQuickView
      v-if="selectedCourse"
      :course="selectedCourse"
      @close="closeQuickView"
      @enroll="enrollCourse"
    />
  </section>
</template>

<script>
import CourseQuickView from './CourseQuickView.vue'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'CoursePreviews',
  components: {
    CourseQuickView
  },
  data() {
    return {
      hoveredCourse: null
    }
  },
  computed: {
    ...mapState('ui', ['loading', 'error']),
    ...mapState('ui', ['selectedCourse']),
    ...mapGetters('courses', ['getFeaturedCourses'])
  },
  created() {
    this.fetchCourses()
  },
  methods: {
    ...mapActions('courses', ['fetchCourses']),
    ...mapActions('ui', ['openQuickView', 'closeQuickView']),
    enrollCourse(course) {
      // Implement enrollment logic
      console.log('Enrolling in:', course.title)
      this.closeQuickView()
    }
  }
}
</script>