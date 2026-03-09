<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
      {{ error }}
      <button @click="retryLoading" class="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Retry</button>
    </div>

    <!-- Content -->
    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div class="space-y-6">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">{{ currentPath.title }}</h1>
          <p class="text-xl text-gray-600">{{ currentPath.description }}</p>
          <div class="flex space-x-6">
            <div class="flex items-center space-x-2 text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span>{{ currentPath.courses }} In-Depth Courses</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ currentPath.duration }} Intensive Training</span>
            </div>
          </div>
        </div>
        <div class="order-first lg:order-last">
          <img :src="currentPath.image" :alt="currentPath.title" class="w-full h-auto rounded-lg shadow-xl">
        </div>
      </div>

      <div class="space-y-16">
        <!-- Skills Section -->
        <div class="space-y-8">
          <h2 class="text-3xl font-bold text-gray-900 border-b pb-2 mb-6">Master Advanced Vue.js Concepts</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="skill in currentPath.skills" :key="skill" class="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ skill }}
            </div>
          </div>
        </div>

        <!-- Projects Section -->
        <div class="space-y-8">
          <h2 class="text-3xl font-bold text-gray-900 border-b pb-2 mb-6">Real-World Projects</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="project in currentPath.projects" :key="project.id" class="p-6 bg-white rounded-lg shadow-sm border border-gray-100 space-y-4">
              <h3 class="text-xl font-semibold text-gray-900">{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="flex flex-wrap gap-2 mt-4">
                <span v-for="tech in project.technologies" :key="tech" class="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Testimonials Section -->
        <div class="space-y-8">
          <h2 class="text-3xl font-bold text-gray-900 border-b pb-2 mb-6">What Our Advanced Students Say</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="testimonial in currentPath.testimonials" :key="testimonial.id" class="p-6 bg-white rounded-lg shadow-sm border border-gray-100 space-y-4">
              <div class="text-gray-700 italic">
                "{{ testimonial.quote }}"
              </div>
              <div class="flex items-center space-x-3">
                <img :src="testimonial.avatar" :alt="testimonial.name" class="h-10 w-10 rounded-full">
                <div class="text-sm">
                  <strong class="block text-gray-900">{{ testimonial.name }}</strong>
                  <span class="text-gray-500">{{ testimonial.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enrollment CTA -->
        <div class="bg-blue-50 rounded-xl p-8 md:p-12">
          <div class="max-w-3xl mx-auto text-center space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Ready to Master Vue.js?</h2>
            <p class="text-lg text-gray-600">Join thousands of developers who've advanced their careers with our comprehensive training program.</p>
            <router-link to="/signup" class="btn-brand inline-flex items-center justify-center rounded-xl px-8 py-3 text-base font-medium md:px-10 md:py-4 md:text-lg">
              Enroll in Advanced Path
            </router-link>
            <p class="flex items-center justify-center space-x-2 text-gray-600 text-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>30-day money-back guarantee</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AdvancedPath',
  
  computed: {
    ...mapState('learningPaths', ['currentPath', 'loading', 'error']),
    
    isLoading() {
      return this.loading && !this.currentPath
    }
  },
  
  created() {
    this.loadPathData()
  },
  
  methods: {
    ...mapActions('learningPaths', ['fetchPathBySlug']),
    
    async loadPathData() {
      try {
        await this.fetchPathBySlug('advanced')
      } catch (error) {
        console.error('Failed to load path:', error)
      }
    },
    
    retryLoading() {
      this.loadPathData()
    }
  },
  
  metaInfo() {
    return {
      title: 'Advanced Vue.js Mastery Path',
      meta: [
        { name: 'description', content: 'Master advanced Vue.js concepts and architecture patterns with our comprehensive training path' }
      ]
    }
  }
}
</script>
