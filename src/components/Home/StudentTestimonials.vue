<template>
  <section class="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-14">
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          What Our <span class="text-blue-600">Students Say</span>
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Hear from developers who transformed their careers with our courses.
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
          class="ml-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Testimonials Grid -->
      <div 
        v-else 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
      >
        <div 
          v-for="testimonial in featuredTestimonials" 
          :key="testimonial.id"
          class="relative bg-white/80 backdrop-blur-md border border-gray-100  rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white"
        >
          <div class="p-8 flex flex-col items-center text-center animate-fade-in">
            <!-- Decorative Quote Mark -->
            <div class="absolute top-4 left-5 text-6xl text-blue-100 opacity-60 select-none">“</div>

            <!-- Student Photo -->
            <div class="mb-5 relative">
              <img 
                :src="testimonial.photo" 
                :alt="testimonial.name"
                class="h-24 w-24 rounded-full object-cover border-4 border-blue-100 shadow-md transition-transform duration-300 hover:scale-105"
              />
              <div class="absolute inset-0 rounded-full border-2 border-blue-300 opacity-30 animate-pulse"></div>
            </div>

            <!-- Rating -->
            <div class="flex justify-center mb-3 text-yellow-400">
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

            <!-- Quote -->
            <p class="text-gray-600 italic leading-relaxed mb-6">
              "{{ testimonial.quote }}"
            </p>

            <!-- Student Info -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ testimonial.name }}</h3>
              <p class="text-blue-600 font-medium">{{ testimonial.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Soft Gradient Decoration -->
    <div class="absolute top-0 left-0 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
    <div class="absolute bottom-10 right-10 w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
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
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
</style>
