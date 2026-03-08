<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl pt-20">
    <!-- Search Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
          Results for "{{ searchQuery }}"
        </h1>
        <p class="text-gray-500 mt-1">
          {{ filteredCourses.length }} {{ filteredCourses.length === 1 ? 'result' : 'results' }} found
        </p>
      </div>
      <!-- Sort Options -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <label for="sort" class="sr-only">Sort by</label>
          <select 
            :value="sortBy"
            @change="onSortChange"
            id="sort"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="newest">Sort by: Relevance</option>
            <option value="createdAt">Sort by: Newest</option>
            <option value="popular">Sort by: Popularity</option>
            <option value="rating">Sort by: Highest Rated</option>
          </select>
        </div>
        <button 
          @click="clearSearch"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Clear Search
        </button>
      </div>
    </div>

    <!-- Filters Sidebar + Results -->
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Filters Sidebar -->
      <div class="lg:w-64 space-y-6">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="font-medium text-gray-900 mb-3">Filters</h3>
          
          <!-- Category Filter -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Category</h4>
            <div class="space-y-2">
              <div v-for="category in allCategories"
               :key="category" class="flex items-center">
                <input 
                  :checked="selectedCategories.includes(category)"
                  @change="toggleCategory(category)"
                  :value="category"
                  type="checkbox"
                  id="category-${category}"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label :for="`category-${category}`" class="ml-3 text-sm text-gray-600">
                  {{ category }}
                </label>
              </div>
            </div>
          </div>
          
          <!-- Level Filter -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Level</h4>
            <div class="space-y-2">
              <div v-for="level in allLevels"
               :key="level" class="flex items-center">
                <input
                  type="checkbox"
                  :id="`level-${level}`"
                  :value="level"
                  :checked="selectedLevels.includes(level)"
                  @change="toggleLevel(level)"
                  class="rounded text-blue-600"
                />
                <label :for="`level-${level}`" class="ml-3 text-sm text-gray-600">
                  {{ level }}
                </label>
              </div>
            </div>
          </div>
          
          <!-- Price Range Slider -->
          <div class="px-2 mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Price Range (up to ${{ priceRange[1] }})<br>
            </label>
            <vue-slider
              v-model="priceRange"
              :min="0"
              :max="1000"
              :interval="10"
              :tooltip="'always'"
              :tooltip-formatter="value => '$' + value"
              :height="6"
              :dot-size="20"
              :process-style="{ backgroundColor: '#3b82f6' }"
              :tooltip-style="{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }"
              @change="handlePriceRangeChange"
              class="mb-2"
            />
            <div class="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$1000</span>
            </div>
          </div>
        </div>
        
        <!-- Reset Filters -->
        <button 
          @click="resetFilters"
          class="w-full text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Reset all filters
        </button>
      </div>
      
      <!-- Results Section -->
      <div class="flex-1">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p class="mt-3 text-gray-500">Loading courses...</p>
          </div>
        </div>
        
        <!-- No Results -->
        <div v-else-if="!filteredCourses.length" class="text-center py-20">
          <div class="mx-auto max-w-md">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
            <p class="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <div class="mt-6">
              <button 
                @click="clearSearch"
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear search
              </button>
            </div>
          </div>
        </div>
        
      <!-- Results Grid -->
        <div v-else class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="course in paginatedCourses" 
            :key="course.id" 
            class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col"
          >
            <div class="relative">
              <img 
                :src="course.image" 
                :alt="course.title" 
                class="h-48 w-full object-cover"
                loading="lazy"
              >
              <div class="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                {{ course.price === 0 ? 'FREE' : `$${course.price}` }}
              </div>
            </div>
            
            <div class="p-4 flex flex-col flex-1">
              <div class="flex items-center mb-2">
                <div class="flex items-center text-yellow-400">
                  <svg v-for="i in 5" :key="i" class="h-4 w-4" :class="{ 'text-gray-300': i > course.rating }" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-xs text-gray-500 ml-1">({{ course.rating }})</span>
              </div>
              
              <h3 class="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
                {{ course.title }}
              </h3>
              
              <p class="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                {{ course.description }}
              </p>
              
              <div class="flex flex-wrap gap-1 mb-3">
                <span 
                  v-for="tag in course.tags.slice(0, 3)" 
                  :key="tag" 
                  class="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs"
                >
                  {{ tag }}
                </span>
                <span v-if="course.tags.length > 3" class="text-gray-400 text-xs">
                  +{{ course.tags.length - 3 }} more
                </span>
              </div>
              
              <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <div class="flex items-center">
                  <img 
                    :src="course.instructorImage" 
                    :alt="course.instructorName" 
                    class="h-8 w-8 rounded-full object-cover mr-2"
                    loading="lazy"
                  >
                  <span class="text-sm text-gray-600">{{ course.instructorName }}</span>
                </div>
                <span class="text-xs text-gray-500">{{ course.duration }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between mt-8">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button 
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to 
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredCourses.length) }}</span> of 
                <span class="font-medium">{{ filteredCourses.length }}</span> results
              </p>
            </div>
            
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                   @click="changePage(currentPage - 1)"
                   :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </button>
                
                <button 
                  v-for="page in visiblePages"
                  :key="page"
                   @click="changePage(page)"
                  :class="[page === currentPage ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50', 'relative inline-flex items-center px-4 py-2 border text-sm font-medium']"
                >
                  {{ page }}
                </button>
                
                <button 
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  name: 'SearchResults',
  
  components: {
    VueSlider
  },
  
  computed: {
    ...mapState('filters', [
      'searchQuery',
      'selectedCategories', 
      'selectedLevels',
      'priceRange',
      'sortBy'
    ]),
    ...mapState('ui', [
      'loading',
      'currentPage',
      'itemsPerPage'
    ]),
    ...mapGetters('filters', [
      'filteredCourses',
      'allCategories',
      'allLevels',
      'hasFilters'
    ]),
    ...mapGetters('ui', [
      'totalPages',
      'paginatedCourses'
    ]),
    
    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)
      
      // Adjust if we're at the beginning or end
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }
  },
  
  methods: {
    ...mapActions('filters', [
      'filterCourses',
      'updateSearchQuery',
      'updateSelectedCategories',
      'updateSelectedLevels', 
      'updatePriceRange',
      'updateSortBy',
      'resetFilters'
    ]),
    ...mapActions('ui', [
      'changePage'
    ]),
    
    onSortChange(e) {
      this.updateSortBy(e.target.value)
      this.changePage(1)
    },
    
    clearSearch() {
      this.updateSearchQuery('')
      this.$router.push({ name: 'SearchResults', query: { q: '' } })
    },
    
    toggleCategory(category) {
      const updatedCategories = this.selectedCategories.includes(category)
        ? this.selectedCategories.filter(c => c !== category)
        : [...this.selectedCategories, category]
      this.updateSelectedCategories(updatedCategories)
      this.changePage(1)
    },
    
    toggleLevel(level) {
      const updatedLevels = this.selectedLevels.includes(level)
        ? this.selectedLevels.filter(l => l !== level)
        : [...this.selectedLevels, level]
      this.updateSelectedLevels(updatedLevels)
      this.changePage(1)
    },
    
    handlePriceRangeChange(value) {
      this.updatePriceRange(value)
      this.changePage(1)
    }
  },
  
  created() {
    if (this.$route.query.q) {
      this.updateSearchQuery(this.$route.query.q)
    }
    this.filterCourses()
  },
  
  watch: {
    searchQuery() {
      this.changePage(1)
    },
    sortBy() {
      this.changePage(1)
    }
  }
}
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
