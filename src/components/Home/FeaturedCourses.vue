<template>
  <section class="py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Featured <span class="text-teal-700">Courses</span>
        </h2>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Learn from industry experts with our top-rated courses
        </p>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" />

      <!-- Error State -->
      <ErrorState v-else-if="error" :error="error" @retry="fetchCourses" />

      <!-- Courses Grid -->
      <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div  
          v-for="(course, index) in getFeaturedCourses" 
          :key="course.id"
          class="relative section-shell interactive-lift overflow-hidden h-full flex flex-col"
          @mouseenter="hoveredCourse = index"
          @mouseleave="hoveredCourse = null"
        >
          <!-- Course Image -->
          <div class="h-48 overflow-hidden rounded-t-xl">
            <img 
              :src="course.image" 
              :alt="course.title"
              class="w-full h-full object-cover transition-transform duration-500"
              :class="{'scale-105': hoveredCourse === index}"
            >
          </div>

          <!-- Course Content -->
          <div class="p-6 flex-grow">
            <h3 class="text-xl font-semibold text-slate-900 mb-2">{{ course.title }}</h3>
            <p class="text-slate-600 mb-1">By {{ course.instructor }}</p>
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
              <span class="text-slate-600">{{ course.rating }} ({{ course.students }} students)</span>
            </div>
            <p class="text-slate-600 mb-4">{{ course.description }}</p>
          </div>

          <!-- Quick View Overlay -->
          <div
            class="absolute inset-0 flex flex-col justify-center bg-slate-900/90 p-6 text-white opacity-0 transition-opacity duration-300 hover:opacity-100"
            v-show="hoveredCourse === index"
          >
            <h3 class="text-xl font-semibold mb-4">{{ course.title }}</h3>
            <p class="mb-4">{{ course.descriptionExtended }}</p>
            <router-link
              :to="`/courses/${course.slug || course.id}`"
              class="mt-auto inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-slate-900 transition-colors hover:bg-slate-100"
            >
              View Details
            </router-link>
          </div> 
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import LoadingSpinner from '@/components/UI/LoadingSpinner.vue'
import ErrorState from '@/components/UI/ErrorState.vue'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'CoursePreviews',
  components: {
    LoadingSpinner,
    ErrorState
  },
  data() {
    return {
      hoveredCourse: null
    }
  },
  computed: {
    ...mapState('ui', ['loading', 'error']),
    ...mapGetters('courses', ['getFeaturedCourses'])
  },
  created() {
    this.fetchCourses()
  },
  methods: {
    ...mapActions('courses', ['fetchCourses'])
  }
}
</script>
