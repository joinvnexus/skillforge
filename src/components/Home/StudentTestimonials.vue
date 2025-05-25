<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          What Our <span class="text-blue-600">Students Say</span>
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Hear from developers who transformed their careers with our courses
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
          @click="fetchTestimonials" 
          class="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Testimonials Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="testimonial in featuredTestimonials" 
          :key="testimonial.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="p-6 text-center">
            <!-- Student Photo -->
            <div class="flex justify-center mb-4">
              <img 
                :src="testimonial.photo" 
                :alt="testimonial.name"
                class="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md mx-auto"
              >
            </div>

            <!-- Rating Stars -->
            <div class="flex justify-center mb-4 text-yellow-400">
              <span v-for="star in 5" :key="star">
                <svg 
                  class="w-5 h-5" 
                  :class="{ 'text-gray-300': star > testimonial.rating }" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>

            <!-- Testimonial Quote -->
            <p class="text-gray-600 italic mb-6">
              "{{ testimonial.quote }}"
            </p>

            <!-- Student Info -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ testimonial.name }}</h3>
              <p class="text-gray-500">{{ testimonial.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'StudentTestimonials',
  
  computed: {
    ...mapState('testimonials', ['loading', 'error']),
    ...mapGetters('testimonials', ['featuredTestimonials'])
  },
  
  created() {
    this.fetchTestimonials()
  },
  
  methods: {
    ...mapActions('testimonials', ['fetchTestimonials'])
  }
}
</script>

<style scoped>
/* Custom animations */
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
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