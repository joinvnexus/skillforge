<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Title -->
      <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-slide-up">
        Explore Our <span class="text-blue-600">Features</span>
      </h2>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-500">
        {{ error }}
      </div>

      <!-- Features Grid -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div 
            v-for="feature in features" 
            :key="feature.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 animate-fade-in"
          >
            <div class="p-8 text-center">
              <div class="flex justify-center mb-6">
                <img 
                  :src="feature.icon" 
                  :alt="feature.title" 
                  class="h-16 w-16 object-contain"
                >
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-3">{{ feature.title }}</h3>
              <p class="text-gray-600">{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <!-- Learning Paths Section -->
        <div class="mt-16">
          <div class="text-center mb-12 animate-slide-up">
            <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Structured <span class="text-blue-600">Learning Paths</span>
            </h3>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose a path that fits your needs and start learning today.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              v-for="path in learningPaths" 
              :key="path.id"
              class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in"
            >
              <div class="p-6 text-center">
                <div class="flex justify-center mb-4">
                  <img 
                    :src="path.icon" 
                    :alt="path.title" 
                    class="h-14 w-14 object-contain"
                  >
                </div>
                <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ path.title }}</h4>
                <p class="text-gray-600 mb-4">{{ path.description }}</p>
                <router-link 
                  :to="path.link" 
                  class="inline-block px-6 py-2 text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors duration-300"
                >
                  Learn More →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'FeaturesSection',
  computed: {
    ...mapState('features', [
      'features',
      'learningPaths',
      'loading',
      'error'
    ]),
    isLoading() {
      return this.loading
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    ...mapActions('features', [
      'fetchFeatures',
      'fetchLearningPaths'
    ]),
    async fetchData() {
      await Promise.all([
        this.fetchFeatures(),
        this.fetchLearningPaths()
      ])
    }
  }
}
</script>

<style>
/* Custom animations */
.animate-slide-up {
  animation: slideUp 1s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 1.5s ease-out forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>