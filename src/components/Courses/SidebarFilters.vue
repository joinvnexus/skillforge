<template>
  <aside class="w-full lg:w-80 xl:w-96" data-aos="fade-right" data-aos-duration="500">
    <div class="mb-4 lg:hidden">
      <button
        @click="mobileFiltersOpen = !mobileFiltersOpen"
        class="flex w-full items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 shadow-sm"
        type="button"
      >
        <div class="flex items-center gap-3">
          <svg class="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.6a1 1 0 01-.3.7l-6.4 6.4a1 1 0 00-.3.7V17l-4 4v-6.6a1 1 0 00-.3-.7L3.3 7.3a1 1 0 01-.3-.7V4z" />
          </svg>
          <span class="text-sm font-semibold text-slate-800">Filters</span>
          <span v-if="hasFilters" class="rounded-full bg-[var(--brand)] px-2 py-0.5 text-xs font-bold text-white">
            {{ activeFilterCount }}
          </span>
        </div>
        <svg class="h-5 w-5 text-slate-600 transition-transform" :class="{ 'rotate-180': mobileFiltersOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <div
      :class="[
        'section-shell overflow-hidden transition-all duration-300 lg:sticky lg:top-24',
        mobileFiltersOpen ? 'max-h-[2200px] opacity-100' : 'max-h-0 opacity-0',
        'lg:max-h-none lg:opacity-100'
      ]"
    >
      <div class="p-5 lg:p-6">
        <div class="mb-5 rounded-2xl border border-[var(--line)] bg-gradient-to-r from-[var(--surface-soft)] to-white p-4">
          <div class="flex items-center justify-between">
            <h2 class="flex items-center gap-2 text-base font-bold text-slate-900">
              <svg class="h-5 w-5 text-[var(--brand-strong)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.6a1 1 0 01-.3.7l-6.4 6.4a1 1 0 00-.3.7V17l-4 4v-6.6a1 1 0 00-.3-.7L3.3 7.3a1 1 0 01-.3-.7V4z" />
              </svg>
              Course Filters
            </h2>
            <span class="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-slate-600">
              {{ filteredCoursesCount || allCourses.length }} results
            </span>
          </div>
          <button
            v-if="hasFilters"
            @click="resetFilters"
            class="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            type="button"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.6m14.8 2A8 8 0 004.6 9m0 0H9m11 11v-5h-.6m0 0a8 8 0 01-15.4-2m15.4 2H15" />
            </svg>
            Reset filters
          </button>
        </div>

        <div class="mb-6">
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search</label>
          <div class="relative">
            <input
              :value="searchQuery"
              @input="handleSearchInput"
              type="text"
              placeholder="Search by title, tag, topic"
              class="w-full rounded-xl border border-[var(--line)] bg-white py-2.5 pl-10 pr-9 text-sm text-slate-800 outline-none ring-[var(--accent)]/40 transition focus:ring"
            />
            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              type="button"
              aria-label="Clear search"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="mb-6" v-if="allCategories.length">
          <div class="mb-2 flex items-center justify-between">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Categories</label>
            <button
              v-if="selectedCategories.length > 0"
              @click="clearCategories"
              class="text-xs font-semibold text-slate-500 hover:text-slate-800"
              type="button"
            >
              Clear
            </button>
          </div>
          <div class="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            <label
              v-for="category in allCategories"
              :key="category"
              class="group flex cursor-pointer items-center justify-between rounded-lg border border-transparent px-2.5 py-2 hover:border-[var(--line)] hover:bg-[var(--surface-soft)]"
            >
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  :value="category"
                  :checked="selectedCategories.includes(category)"
                  @change="toggleCategory(category)"
                  class="h-4 w-4 rounded border-[var(--line)] text-[var(--brand)] focus:ring-[var(--brand)]/30"
                />
                <span class="text-sm text-slate-700 group-hover:text-slate-900">{{ category }}</span>
              </div>
              <span class="rounded-md bg-[var(--surface)] px-2 py-0.5 text-xs font-semibold text-slate-500">
                {{ getCategoryCount(category) }}
              </span>
            </label>
          </div>
        </div>

        <div class="mb-6" v-if="allLevels.length">
          <div class="mb-2 flex items-center justify-between">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty</label>
            <button
              v-if="selectedLevels.length > 0"
              @click="clearLevels"
              class="text-xs font-semibold text-slate-500 hover:text-slate-800"
              type="button"
            >
              Clear
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <label
              v-for="level in allLevels"
              :key="level"
              :class="[
                'flex cursor-pointer items-center justify-center rounded-xl border px-2 py-2 text-sm font-semibold transition',
                selectedLevels.includes(level) ? 'border-[var(--brand)] bg-teal-50 text-[var(--brand-strong)]' : 'border-[var(--line)] bg-white text-slate-700 hover:border-slate-300'
              ]"
            >
              <input
                type="checkbox"
                :value="level"
                :checked="selectedLevels.includes(level)"
                @change="toggleLevel(level)"
                class="sr-only"
              />
              {{ level }}
            </label>
          </div>
        </div>

        <div class="mb-6">
          <div class="mb-2 flex items-center justify-between">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Price</label>
            <button
              v-if="priceRange[1] < maxPrice"
              @click="resetPriceRange"
              class="text-xs font-semibold text-slate-500 hover:text-slate-800"
              type="button"
            >
              Reset
            </button>
          </div>
          <div class="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-3">
            <input
              type="range"
              v-model.number="localPriceRange[1]"
              :min="0"
              :max="maxPrice"
              step="10"
              @input="handlePriceRangeInput"
              @change="handlePriceRangeChange"
              class="slider h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--line)]"
            />
            <div class="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>$0</span>
              <span>Up to ${{ localPriceRange[1] }}</span>
              <span>${{ maxPrice }}</span>
            </div>
            <div class="mt-3 grid grid-cols-4 gap-2">
              <button
                v-for="option in priceOptions"
                :key="option.label"
                @click="setPriceOption(option)"
                :class="[
                  'rounded-lg px-2 py-1.5 text-xs font-semibold transition',
                  isPriceOptionSelected(option) ? 'btn-brand text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                ]"
                type="button"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="mb-6" v-if="showRatingFilter">
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Minimum Rating</label>
          <div class="rounded-xl border border-[var(--line)] bg-white p-3">
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center gap-0.5 text-amber-400">
                <span v-for="star in 5" :key="star">{{ star <= selectedRating ? '★' : '☆' }}</span>
              </div>
              <span class="text-sm font-semibold text-slate-700">{{ selectedRating }}+</span>
            </div>
            <input
              type="range"
              v-model.number="selectedRating"
              :min="1"
              :max="5"
              step="1"
              @change="handleRatingChange"
              class="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--line)]"
            />
          </div>
        </div>

        <div class="mb-6" v-if="showSortOptions">
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sort By</label>
          <select
            v-model="sortBy"
            @change="handleSortChange"
            class="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-[var(--accent)]/40 focus:ring"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="rated">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div class="lg:hidden">
          <button
            @click="mobileFiltersOpen = false"
            class="btn-brand w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            type="button"
          >
            Show {{ filteredCoursesCount || allCourses.length }} Courses
          </button>
        </div>
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
      default: false
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
      localPriceRange: [0, 1000],
      selectedRating: 0,
      sortBy: 'newest',
      maxPrice: 1000,
      priceOptions: [
        { label: 'Free', min: 0, max: 0 },
        { label: '< $50', min: 1, max: 50 },
        { label: '< $100', min: 1, max: 100 },
        { label: 'All', min: 0, max: 1000 }
      ]
    }
  },
  computed: {
    ...mapState('filters', ['searchQuery', 'selectedCategories', 'selectedLevels', 'priceRange']),
    ...mapState('courses', ['allCourses']),
    ...mapGetters('filters', ['allCategories', 'allLevels', 'hasFilters']),
    activeFilterCount() {
      let count = 0
      if (this.searchQuery) count += 1
      if (this.selectedCategories.length) count += 1
      if (this.selectedLevels.length) count += 1
      if (this.priceRange[1] < this.maxPrice) count += 1
      if (this.showRatingFilter && this.selectedRating > 0) count += 1
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
        ? this.selectedCategories.filter((c) => c !== category)
        : [...this.selectedCategories, category]
      this.updateSelectedCategories(newCategories)
    },
    clearCategories() {
      this.updateSelectedCategories([])
    },
    toggleLevel(level) {
      const newLevels = this.selectedLevels.includes(level)
        ? this.selectedLevels.filter((l) => l !== level)
        : [...this.selectedLevels, level]
      this.updateSelectedLevels(newLevels)
    },
    clearLevels() {
      this.updateSelectedLevels([])
    },
    handlePriceRangeInput() {
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
    setPriceOption(option) {
      this.localPriceRange = [option.min, option.max]
      this.updatePriceRange([option.min, option.max])
    },
    isPriceOptionSelected(option) {
      return this.priceRange[0] === option.min && this.priceRange[1] === option.max
    },
    handleRatingChange() {
      this.$emit('rating-change', this.selectedRating)
    },
    handleSortChange() {
      this.updateSortBy(this.sortBy)
    }
  }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--brand);
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.24);
}

.slider::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--brand);
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.24);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
