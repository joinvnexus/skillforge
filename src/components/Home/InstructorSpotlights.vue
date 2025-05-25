<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12 animate-fade-in">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Meet Our <span class="text-blue-600">Experts</span>
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn from our top instructors who are industry professionals and experts in their fields.
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
          @click="fetchInstructors" 
          class="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Instructor Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up">
        <div 
          v-for="instructor in featuredInstructors" 
          :key="instructor.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="p-6 text-center">
            <!-- Instructor Photo -->
            <div class="flex justify-center mb-4">
              <img 
                :src="instructor.photo" 
                :alt="instructor.name"
                class="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
              >
            </div>

            <!-- Instructor Info -->
            <div class="mb-4">
              <h3 class="text-xl font-semibold text-gray-900">{{ instructor.name }}</h3>
              <p class="text-blue-600 font-medium">{{ instructor.title }}</p>
              <p class="text-gray-600 mt-2">{{ instructor.bio }}</p>
            </div>

            <!-- Social Links -->
            <div class="flex justify-center space-x-4">
              <a 
                v-for="link in instructor.socialLinks" 
                :key="link.platform"
                :href="link.url" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-500 hover:text-blue-600 transition-colors"
                :title="link.platform"
              >
                <i :class="`${link.iconClass} text-xl`"></i>
              </a>
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
  name: 'InstructorSpotlights',
  
  computed: {
    ...mapState('instructors', ['loading', 'error']),
    ...mapGetters('instructors', ['featuredInstructors'])
  },
  
  created() {
    this.fetchInstructors()
  },
  
  methods: {
    ...mapActions('instructors', ['fetchInstructors'])
  }
}
</script>

<style>
/* Font Awesome icons - make sure you have this imported in your project */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Custom animations */
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>