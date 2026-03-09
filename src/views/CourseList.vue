<!-- src/views/ couserlist -->

<template>
  <div class="min-h-screen py-6">
    <HeroSection />
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="section-shell mb-8 p-7 text-center" data-aos="fade-in">
        <h1 class="mb-2 text-3xl font-bold text-[var(--text)] md:text-4xl">Explore Our Courses</h1>
        <p class="mx-auto max-w-2xl text-lg text-[var(--muted)]">
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
            <p class="mb-2 text-[var(--muted)] sm:mb-0">
              Showing {{ paginatedCourses.length }} of {{ courseCount }} courses
              <span v-if="hasFilters" class="text-sm text-[var(--muted)]/80">(filtered)</span>
            </p>
            <div class="flex items-center">
              <span class="mr-2 text-[var(--muted)]">Sort by:</span>
              <select
              v-model="localSortBy"
               @change="updateSort"
                class="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none">
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
          <CourseGrid
            v-else
            :courses="paginatedCourses"
            @add-to-cart="handleAddToCart"
            @bookmark-toggle="handleWishlistToggle"
          />

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
      ...mapState('auth', ['user']),
      ...mapState('filters', ['sortBy']),
      ...mapGetters('ui', ['paginatedCourses', 'totalPages', 'courseCount']),
      ...mapGetters('filters', ['hasFilters']),

    },
    data() {
      return {
        localSortBy: 'newest'
      }
    },

    methods: {
      ...mapActions('courses', ['fetchCourses']),
      ...mapActions('filters', ['updateSortBy', 'resetFilters']),
      ...mapActions('ui', ['changePage']),
      ...mapActions('cart', ['addToCart']),
      ...mapActions('wishlist', ['addToWishlist', 'removeFromWishlist', 'fetchWishlist']),
      updateSort(e) {
        this.updateSortBy(e.target.value)
      },
      ensureAuthOrRedirect() {
        if (this.user) return true
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } })
        return false
      },
      handleAddToCart(course) {
        if (!this.ensureAuthOrRedirect()) return
        this.addToCart(course)
      },
      async handleWishlistToggle(courseId) {
        if (!this.ensureAuthOrRedirect()) return
        const course = this.paginatedCourses.find((item) => item.id === courseId)
        const inWishlist = this.$store.getters['wishlist/isWishlisted'](courseId)
        if (inWishlist) {
          await this.removeFromWishlist(courseId)
          return
        }
        if (course) {
          await this.addToWishlist(course)
        }
      }
    },
    created() {
      this.localSortBy = this.sortBy
      this.updateSortBy(this.sortBy)
      this.fetchCourses()
      if (this.user) {
        this.fetchWishlist().catch(() => {})
      }
    },
    // Initialize AOS on component mount
    mounted() {

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
      sortBy(newVal) {
        this.localSortBy = newVal
      },

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
