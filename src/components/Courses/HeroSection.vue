<!-- src/components/Courses /HeroSection.vue -->

<template>
  <div class="relative bg-white overflow-hidden" id="hero-section">
    <!-- Grid background -->
    <div class="absolute inset-0 bg-grid-pattern"></div>

    <div class="relative max-w-5xl mx-auto px-6 py-28 md:py-36 text-center">
      <!-- Headline -->
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        <span class="block">Education Without</span>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
          Boundaries
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
        Access 5,000+ courses across all devices, anytime, anywhere.
      </p>

      <!-- Category Tabs -->
      <div class="inline-flex flex-wrap justify-center bg-gray-100 rounded-full p-1 mb-14">
        <button 
          v-for="category in allCategories" 
          :key="category"
          @click="filterCourses(category)"
          class="px-5 py-2 text-sm font-medium rounded-full transition"
          :class="activeCategory === category 
            ? 'bg-white text-indigo-600 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'"
        >
          {{ category }}
        </button>
      </div>

      <!-- Stats -->
      <div class="flex justify-center gap-8">
        <div v-for="stat in stats" :key="stat.label" class="text-center">
          <div class="text-3xl font-bold text-indigo-600">{{ stat.value }}</div>
          <div class="text-sm text-gray-500">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      activeCategory: 'All',
      stats: [
        { value: '5K+', label: 'Courses' },
        { value: '10K+', label: 'Students' },
        { value: '200+', label: 'Experts' }
      ]
    }
  },

  computed: {
  allCategories() {
    return ['All', ...this.$store.getters['filters/allCategories']].slice(0, 9)
  }
},
  methods: {
  ...mapActions('filters', ['updateSelectedCategories', 'filterCourses']),
  
  filterCourses(category) {
    this.activeCategory = category
    const categories = category === 'All' ? [] : [category]
    this.updateSelectedCategories(categories)
    this.$store.dispatch('filters/filterCourses')
    
    // Smooth scroll to course listing
    const courseSection = document.getElementById('course-listing')
    if (courseSection) {
      courseSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
 
}
</script>

<style>
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f7f7f7' fill-rule='evenodd'%3E%3Crect width='40' height='40'/%3E%3Cpath d='M0 0h40v40H0z' stroke='%23e5e5e5'/%3E%3C/g%3E%3C/svg%3E");
}
</style>