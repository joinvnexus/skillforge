<!-- src/views/ couserlist -->

<template>
  <div class="min-h-screen py-6">
    <HeroSection />
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="section-shell mb-8 p-7 text-center" data-aos="fade-in">
        <h1 class="mb-2 text-3xl font-bold text-slate-900 md:text-4xl">Explore Our Courses</h1>
        <p class="mx-auto max-w-2xl text-lg text-slate-600">
          Find the perfect course to advance your skills
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar Filters with fixed responsive width -->
        <SidebarFilters class="lg:w-64 xl:w-72 flex-shrink-0" />
        
        <!-- Main Content Area - takes remaining space -->
        <main class="flex-1 min-w-0">
          <!-- Sorting and Results Count -->
          <div class="section-shell mb-6 flex flex-col items-center justify-between gap-3 p-4 sm:flex-row" data-aos="fade-left">
            <p class="mb-2 text-slate-600 sm:mb-0">
              Showing {{ paginatedCourses.length }} of {{ courseCount }} courses
              <span v-if="hasFilters" class="text-sm text-slate-500">(filtered)</span>
            </p>
            <div class="flex items-center">
              <span class="mr-2 text-slate-600">Sort by:</span>
              <select 
              v-model="sortBy"
               @change="updateSort"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none">
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
