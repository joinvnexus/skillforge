<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <HeroSection />
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8 text-center" data-aos="fade-in">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Explore Our Courses</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Find the perfect course to advance your skills
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <SidebarFilters />

        <main class="w-full lg:w-3/4">
          <!-- Sorting and Results Count -->
          <div class="flex flex-col sm:flex-row justify-between items-center mb-6" data-aos="fade-left">
            <p class="text-gray-600 mb-2 sm:mb-0">
              Showing {{ paginatedCourses.length }} of {{ courseCount }} courses
              <span v-if="hasFilters" class="text-sm text-gray-500">(filtered)</span>
            </p>
            <div class="flex items-center">
              <span class="mr-2 text-gray-600">Sort by:</span>
              <select 
              v-model="sortBy"
               @change="updateSort"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="rated">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          <!-- Default -->
          <LoadingSpinner v-if="loading" />
          <ErrorState v-else-if="error" :error="error" @retry="fetchCourses" />
          <NoResults v-else-if="courseCount === 0" @reset="resetFilters" />
          <CourseGrid v-else :courses="paginatedCourses" />

          <!-- Pagination -->
          <Pagination 
          :current-page="currentPage" 
          :total-pages="totalPages" 
          @page-changed="changePage"
          :loading="loading"
          :error="error"
           />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import AOS from 'aos'
  import 'aos/dist/aos.css'

  // Import components
  import HeroSection from '@/components/Courses/HeroSection.vue'
  import SidebarFilters from '@/components/Courses/SidebarFilters.vue'
  import CourseGrid from '@/components/Courses/CourseGrid.vue'
  import Pagination from '@/components/Courses/Pagination.vue'
  import ErrorState from '@/components/UI/ErrorState.vue'
  import NoResults from '@/components/UI/NoResults.vue'
  import LoadingSpinner from '@/components/UI/LoadingSpinner.vue'

  export default {
    components: {
      HeroSection,
      SidebarFilters,
      CourseGrid,
      Pagination,
      ErrorState,
      NoResults,
      LoadingSpinner
    },
    // Updated computed and methods
    computed: {
      ...mapState('ui', ['loading', 'error', 'currentPage']),
      ...mapState('filters', ['sortBy']),
      ...mapGetters('ui', ['paginatedCourses', 'totalPages', 'courseCount']),
      ...mapGetters('filters', ['hasFilters']),
      ...mapGetters('courses', ['allCategories']),

    },

    methods: {
      ...mapActions('courses', ['fetchCourses']),
      ...mapActions('filters', ['updateSortBy', 'resetFilters']),
      ...mapActions('ui', ['changePage']),
      updateSort(e) {
        this.updateSortBy(e.target.value)
      }
    },
    created() {
      this.updateSortBy(this.sortBy)
      this.fetchCourses()
    },
    // Initialize AOS on component mount
    mounted() {

      this.fetchCourses()
      // Initialize AOS for animations
      AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-in-out',
        offset: 10,
        delay: 100
      })
    },
    watch: {

      '$store.state.ui.loading': function (newVal) {
        if (newVal) {
          AOS.refresh()
        }
      },
      '$store.state.ui.error': function (newVal) {
        if (newVal) {
          AOS.refresh()
        }
      }
    }
  }
</script>
