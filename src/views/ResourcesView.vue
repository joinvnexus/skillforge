<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Resources</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Free resources to help you learn and grow as a developer.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="resource in resources" :key="resource.id" class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="resource.icon" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ resource.title }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ resource.description }}</p>
          <a href="#" class="text-blue-600 hover:text-blue-700 font-medium text-sm">Download →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourcesView',
  data() {
    return {
      resources: [
        {
          id: 1,
          title: 'Vue.js Cheat Sheet',
          description: 'Quick reference guide for Vue.js syntax and features.',
          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        },
        {
          id: 2,
          title: 'Project Templates',
          description: 'Starter templates for various Vue.js project types.',
          icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
        },
        {
          id: 3,
          title: 'Video Tutorials',
          description: 'Free video tutorials covering various topics.',
          icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
        },
        {
          id: 4,
          title: 'E-Books',
          description: 'Comprehensive guides and e-books for learning.',
          icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        }
      ]
    }
  }
}
</script>
