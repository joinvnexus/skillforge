<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
      {{ error }}
      <button @click="retryLoading">Retry</button>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="section-shell lg:col-span-2 p-6">
        <div class="flex items-start space-x-4 mb-6">
          <img :src="currentPath.icon" :alt="currentPath.title" class="h-16 w-16 flex-shrink-0" />
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ currentPath.title }}</h1>
            <p class="mt-2 text-lg text-gray-600">{{ currentPath.description }}</p>
          </div>
        </div>

        <div class="flex space-x-6 mt-4">
          <div class="flex items-center space-x-2 text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
              </path>
            </svg>
            <span>{{ currentPath.courses }} Courses</span>
          </div>
          <div class="flex items-center space-x-2 text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
              </path>
            </svg>
            <span>{{ currentPath.duration }}</span>
          </div>
        </div>

        <div class="mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">Curriculum Overview</h2>
          <div v-for="(module, index) in currentPath.curriculum" :key="module.id" class="mb-6">
            <div class="flex items-center mb-4">
              <span class="bg-blue-100 text-blue-800 text-sm font-semibold mr-3 px-2.5 py-0.5 rounded">Module {{ index + 1 }}</span>
              <h3 class="text-xl font-semibold text-gray-800">{{ module.title }}</h3>
            </div>
            <ul v-if="module.lessons" class="space-y-3 ml-9">
              <li v-for="lesson in module.lessons" :key="lesson.id" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span class="text-blue-500 mr-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z">
                    </path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                    </path>
                  </svg>
                </span>
                {{ lesson.title }}
                <span v-if="lesson.duration" class="text-sm text-gray-500">{{ lesson.duration }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <router-link to="/signup" class="btn-brand flex w-full items-center justify-center rounded-xl px-8 py-3 text-base font-medium md:px-10 md:py-4 md:text-lg">
          Enroll in Intermediate Path
        </router-link>
        <p class="mt-3 text-center text-gray-500 text-sm">Start learning today with a 7-day free trial</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'IntermediatePath',

  computed: {
    ...mapState('learningPaths', {
      currentPath: (state) => state.currentPath,
      pathsLoading: (state) => state.isLoading,
      error: (state) => state.error
    }),
    isLoading() {
      return this.pathsLoading && !this.currentPath
    }
  },

  created() {
    this.loadPathData()
  },

  methods: {
    ...mapActions('learningPaths', ['fetchPathBySlug']),

    async loadPathData() {
      try {
        await this.fetchPathBySlug('intermediate')
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
      title: 'Intermediate Vue.js Learning Path',
      meta: [
        { name: 'description', content: 'Take your Vue.js skills to the next level with our Intermediate learning path' }
      ]
    }
  }
}
</script>

<style scoped>
/* All @apply removed — utility classes now live in the <template> */
</style>
