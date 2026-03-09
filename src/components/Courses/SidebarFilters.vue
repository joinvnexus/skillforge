<template>
  <aside class="w-full lg:w-80 xl:w-96" data-aos="fade-right" data-aos-duration="500">
    <!-- Mobile Filter Toggle (Hidden on desktop) -->
    <div class="lg:hidden mb-4">
      <button
        @click="mobileFiltersOpen = !mobileFiltersOpen"
        class="w-full flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-md transition-shadow hover:shadow-lg"
      >
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span class="font-semibold">Filters</span>
          <span v-if="hasFilters" 
                class="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {{ activeFilterCount }}
          </span>
        </div>
        <svg class="w-5 h-5 transition-transform" 
             :class="{ 'rotate-180': mobileFiltersOpen }"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Filters Panel -->
    <div 
      :class="[
        'bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300',
        mobileFiltersOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
        'lg:max-h-none lg:opacity-100'
      ]"
    >
      <div class="p-6 lg:p-7">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </h2>
          <button
            v-if="hasFilters"
            @click="resetFilters"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear all
          </button>
        </div>

        <!-- Search -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Search Courses
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              :value="searchQuery"
              @input="handleSearchInput"
              type="text"
              placeholder="React, JavaScript, Python..."
            class="w-full rounded-lg border border-[var(--line)] py-3 pl-10 pr-4 placeholder-gray-400 transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Categories -->
        <div class="mb-8" v-if="allCategories.length">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-medium text-gray-700">
              Categories
            </label>
            <button
              v-if="selectedCategories.length > 0"
              @click="clearCategories"
              class="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
            <label
              v-for="(category, index) in allCategories"
              :key="category"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div class="flex items-center gap-3">
                <div class="relative">
                  <input
                    type="checkbox"
                    :value="category"
                    :checked="selectedCategories.includes(category)"
                    @change="toggleCategory(category)"
                    class="sr-only peer"
                  />
                  <div class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[var(--line)] transition-all peer-checked:border-[var(--brand)] peer-checked:bg-[var(--brand)]">
                    <svg v-if="selectedCategories.includes(category)" 
                         class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span class="text-gray-700 group-hover:text-gray-900">{{ category }}</span>
              </div>
              <span class="rounded bg-[var(--surface-soft)] px-2 py-1 text-xs text-[var(--muted)]/80">
                {{ getCategoryCount(category) }}
              </span>
            </label>
          </div>
        </div>

        <!-- Levels -->
        <div class="mb-8" v-if="allLevels.length">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-medium text-gray-700">
              Difficulty Levels
            </label>
            <button
              v-if="selectedLevels.length > 0"
              @click="clearLevels"
              class="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <label
              v-for="level in allLevels"
              :key="level"
              :class="[
                'flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all',
                selectedLevels.includes(level)
                  ? getLevelColor(level).selected
                  : getLevelColor(level).default
              ]"
            >
              <input
                type="checkbox"
                :value="level"
                :checked="selectedLevels.includes(level)"
                @change="toggleLevel(level)"
                class="sr-only"
              />
              <span class="font-medium">{{ level }}</span>
            </label>
          </div>
        </div>

        <!-- Price Range -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-medium text-gray-700">
              Price Range
            </label>
            <button
              v-if="priceRange[1] < maxPrice"
              @click="resetPriceRange"
              class="text-xs text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>
          </div>
          <div class="space-y-6">
            <!-- Range Slider -->
            <div class="relative pt-6">
              <input
                type="range"
                v-model.number="localPriceRange[1]"
                :min="0"
                :max="maxPrice"
                step="10"
                @input="handlePriceRangeInput"
                @change="handlePriceRangeChange"
                class="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-[var(--line)]"
              />
              <div class="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>${{ localPriceRange[1] }}</span>
                <span>${{ maxPrice }}+</span>
              </div>
            </div>
            
            <!-- Price Options -->
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="option in priceOptions"
                :key="option.label"
                @click="setPriceOption(option)"
                :class="[
                  'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  isPriceOptionSelected(option)
                    ? 'btn-brand text-white'
                    : 'bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--bg-alt)]'
                ]"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Rating Filter -->
        <div class="mb-8" v-if="showRatingFilter">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Minimum Rating
          </label>
          <div class="flex items-center gap-4">
            <div class="flex">
              <span v-for="star in 5" :key="star" class="text-2xl">
                <span v-if="star <= selectedRating" class="text-yellow-400">★</span>
                <span v-else class="text-gray-300">★</span>
              </span>
            </div>
            <span class="text-lg font-semibold">{{ selectedRating }}+</span>
          </div>
          <input
            type="range"
            v-model.number="selectedRating"
            :min="1"
            :max="5"
            step="1"
            @change="handleRatingChange"
            class="w-full mt-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <!-- Sort By (Optional) -->
        <div class="mb-8" v-if="showSortOptions">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Sort By
          </label>
          <select
            v-model="sortBy"
            @change="handleSortChange"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <!-- Apply Filters Button (Mobile) -->
        <div class="lg:hidden pt-4 border-t border-gray-100">
          <button
            @click="mobileFiltersOpen = false"
            class="btn-brand w-full rounded-lg px-4 py-3 font-semibold text-white shadow-md transition-colors hover:shadow-lg"
          >
            Show {{ filteredCoursesCount }} Courses
          </button>
        </div>

        <!-- Reset All Button -->
        <button
          @click="resetFilters"
          :disabled="!hasFilters"
          :class="[
            'w-full py-3 px-4 rounded-lg font-semibold transition-all mt-4',
            hasFilters
              ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md border border-red-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ]"
        >
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset All Filters
          </div>
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'CourseFilters',
  props: {
    showRatingFilter: {
      type: Boolean,
      default: true
    },
    showSortOptions: {
      type: Boolean,
      default: false
    },
    filteredCoursesCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      mobileFiltersOpen: false,
      localPriceRange: [0, 100],
      selectedRating: 0,
      sortBy: 'popularity',
      maxPrice: 500,
      priceOptions: [
        { label: 'Free', min: 0, max: 0 },
        { label: 'Under $50', min: 1, max: 50 },
        { label: 'All', min: 0, max: 500 }
      ]
    }
  },
  computed: {
    ...mapState('filters', [
      'searchQuery',
      'selectedCategories',
      'selectedLevels',
      'priceRange'
    ]),
    ...mapState('courses', ['allCourses']),
    ...mapGetters('filters', [
      'allCategories',
      'allLevels',
      'hasFilters'
    ]),
    activeFilterCount() {
      let count = 0
      if (this.searchQuery) count++
      if (this.selectedCategories.length) count++
      if (this.selectedLevels.length) count++
      if (this.priceRange[1] < this.maxPrice) count++
      if (this.selectedRating > 0) count++
      return count
    }
  },
  watch: {
    priceRange: {
      immediate: true,
      handler(newVal) {
        this.localPriceRange = [...newVal]
      }
    }
  },
  methods: {
    ...mapActions('filters', [
      'updateSearchQuery',
      'updateSelectedCategories',
      'updateSelectedLevels',
      'updatePriceRange',
      'updateRatingFilter',
      'updateSortBy',
      'resetFilters'
    ]),
    handleSearchInput(e) {
      this.updateSearchQuery(e.target.value)
    },
    clearSearch() {
      this.updateSearchQuery('')
    },
    toggleCategory(category) {
      const newCategories = this.selectedCategories.includes(category)
        ? this.selectedCategories.filter(c => c !== category)
        : [...this.selectedCategories, category]
      this.updateSelectedCategories(newCategories)
    },
    clearCategories() {
      this.updateSelectedCategories([])
    },
    toggleLevel(level) {
      const newLevels = this.selectedLevels.includes(level)
        ? this.selectedLevels.filter(l => l !== level)
        : [...this.selectedLevels, level]
      this.updateSelectedLevels(newLevels)
    },
    clearLevels() {
      this.updateSelectedLevels([])
    },
    handlePriceRangeInput() {
      // Real-time updates while dragging
      this.$emit('price-range-input', this.localPriceRange)
    },
    handlePriceRangeChange() {
      this.updatePriceRange([0, this.localPriceRange[1]])
    },
    resetPriceRange() {
      this.updatePriceRange([0, this.maxPrice])
    },
    getCategoryCount(category) {
      if (!Array.isArray(this.allCourses) || !this.allCourses.length) return 0
      return this.allCourses.filter((course) => course.category === category).length
    },
    getLevelColor(level) {
      const colors = {
        'Beginner': {
          default: 'border-green-200 bg-green-50 hover:border-green-300',
          selected: 'border-green-600 bg-green-100 text-green-800'
        },
        'Intermediate': {
          default: 'border-yellow-200 bg-yellow-50 hover:border-yellow-300',
          selected: 'border-yellow-600 bg-yellow-100 text-yellow-800'
        },
        'Advanced': {
          default: 'border-red-200 bg-red-50 hover:border-red-300',
          selected: 'border-red-600 bg-red-100 text-red-800'
        },
        'All Levels': {
          default: 'border-blue-200 bg-blue-50 hover:border-blue-300',
          selected: 'border-blue-600 bg-blue-100 text-blue-800'
        }
      }
      return colors[level] || {
        default: 'border-gray-200 bg-gray-50 hover:border-gray-300',
        selected: 'border-gray-600 bg-gray-100 text-gray-800'
      }
    },
    setPriceOption(option) {
      this.localPriceRange = [option.min, option.max]
      this.updatePriceRange([option.min, option.max])
    },
    isPriceOptionSelected(option) {
      return this.priceRange[0] === option.min && this.priceRange[1] === option.max
    },
    handleRatingChange() {
      this.updateRatingFilter(this.selectedRating)
    },
    handleSortChange() {
      this.updateSortBy(this.sortBy)
    }
  }
}
</script>

<style scoped>
/* Custom slider styles */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
