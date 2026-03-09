<!-- src/components/Courses /CourseGrid.vue -->
<template>
  <div id="course-listing" class="min-h-[400px]">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center px-4 py-16">
      <div class="h-12 w-12 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--brand)]"></div>
      <p class="mt-4 text-[var(--muted)]">Loading courses...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!courses || courses.length === 0" class="py-16 px-4 text-center">
      <div class="mx-auto mb-6 h-16 w-16 text-[var(--muted)]/70">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="mb-2 text-xl font-semibold text-[var(--text)]">No courses found</h3>
      <p class="text-[var(--muted)]">Try adjusting your filters or check back later.</p>
    </div>

    <!-- Courses Grid - Adjusted breakpoints for sidebar layout -->
    <div v-else class="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <div
        v-for="(course, index) in courses"
        :key="course.id"
        class="group section-shell interactive-lift flex h-full cursor-pointer flex-col overflow-hidden border-2 border-transparent hover:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
        :data-aos="'fade-up'"
        :data-aos-delay="(index % 4) * 100"
        :aria-label="`Course: ${course.title}`"
        tabindex="0"
        @keydown.enter="navigateToCourse(course.id)"
        @click="navigateToCourse(course.id)"
      >
        <!-- Course Image Container -->
        <div class="relative overflow-hidden bg-[var(--surface-soft)] pt-[56.25%]">
          <!-- Course Image -->
          <img
            :src="course.image || '/placeholder-course.jpg'"
            :alt="course.title"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            @error="handleImageError"
          />
          
          <!-- Course Badges -->
          <div class="absolute top-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-none">
            <!-- Popular Badge -->
            <span
              v-if="course.isPopular"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/95 backdrop-blur-sm text-white"
              aria-label="Popular course"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Popular
            </span>
            
            <!-- Featured Badge -->
            <span
              v-if="course.isFeatured"
              class="inline-flex items-center gap-1 rounded-full bg-[var(--brand)]/95 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
              aria-label="Featured course"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Featured
            </span>
            
            <!-- Free Badge -->
            <span
              v-if="course.price === 0"
              class="rounded-full bg-[var(--brand-strong)]/95 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
              aria-label="Free course"
            >
              FREE
            </span>
            
            <!-- Discount Badge -->
            <span
              v-if="course.discount"
              class="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/95 backdrop-blur-sm text-white"
              aria-label="Discount available"
            >
              -{{ course.discount }}%
            </span>
            
            <!-- New Badge -->
            <span
              v-if="isCourseNew(course.createdAt)"
              class="rounded-full bg-[var(--accent)]/95 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
              aria-label="New course"
            >
              NEW
            </span>
          </div>
          
          <!-- Course Category -->
          <div v-if="course.category" 
               class="absolute bottom-3 left-3">
            <span class="px-3 py-1 rounded-lg text-xs font-medium bg-black/60 backdrop-blur-sm text-white">
              {{ course.category }}
            </span>
          </div>
        </div>

        <!-- Course Content -->
        <div class="flex flex-1 flex-col p-5">
          <!-- Title -->
          <h3 class="mb-2 line-clamp-2 text-lg font-bold text-[var(--text)] transition-colors group-hover:text-[var(--brand-strong)]">
            <router-link
              :to="'/courses/' + course.id"
              class="hover:no-underline focus:outline-none"
              :aria-label="`View ${course.title} course details`"
            >
              {{ course.title }}
            </router-link>
          </h3>
          
          <!-- Instructor -->
          <p class="mb-3 text-sm text-[var(--muted)]">
            By <span class="font-medium">{{ course.instructor || 'Unknown Instructor' }}</span>
          </p>
          
          <!-- Description -->
          <p class="mb-4 flex-1 line-clamp-2 text-sm text-[var(--muted)]"
             :title="course.description">
            {{ course.description || 'No description available' }}
          </p>
          
          <!-- Rating and Reviews -->
          <div class="flex items-center gap-2 mb-4">
            <div class="flex items-center">
              <div class="flex" :aria-label="`Rating: ${course.rating || 0} out of 5 stars`">
                <span v-for="star in 5" :key="star">
                  <svg
                    class="w-4 h-4"
                    :class="star <= Math.round(course.rating || 0) ? 'text-yellow-400' : 'text-[var(--line)]'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              </div>
              <span class="ml-2 text-sm font-semibold text-[var(--text)]">
                {{ (course.rating || 0).toFixed(1) }}
              </span>
            </div>
            
            <!-- Review Count -->
            <span v-if="course.reviewCount" 
                  class="text-sm text-[var(--muted)]">
              ({{ formatNumber(course.reviewCount) }})
            </span>
            
            <!-- Difficulty Level -->
            <span v-if="course.level" 
                  class="ml-auto text-xs px-2 py-1 rounded-full"
                  :class="getLevelClass(course.level)">
              {{ course.level }}
            </span>
          </div>
          
          <!-- Course Meta Info -->
          <div class="mb-4 flex items-center justify-between text-sm text-[var(--muted)]">
            <!-- Duration -->
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ formatDuration(course.duration) }}</span>
            </div>
            
            <!-- Students -->
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{{ formatNumber(course.students || 0) }}</span>
            </div>
            
            <!-- Lessons/Modules -->
            <div v-if="course.lessons" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{{ course.lessons }} lessons</span>
            </div>
          </div>
          
          <!-- Price and Action Button -->
          <div class="mt-auto border-t border-[var(--line)] pt-4">
            <div class="mb-4 flex items-center justify-between">
              <!-- Price -->
              <div class="flex items-baseline gap-2">
                <span v-if="course.originalPrice && course.originalPrice > course.price" 
                      class="text-sm text-[var(--muted)] line-through">
                  ${{ course.originalPrice }}
                </span>
                <span class="text-xl font-bold" 
                      :class="course.price === 0 ? 'text-[var(--brand-strong)]' : 'text-[var(--text)]'">
                  {{ course.price === 0 ? 'Free' : `$${course.price}` }}
                </span>
                <span v-if="course.price > 0 && course.price < 20" 
                      class="text-xs font-medium text-[var(--brand-strong)]">
                  Great value!
                </span>
              </div>
              
              <!-- Bookmark Button -->
              <button
                v-if="showBookmark"
                @click.stop="toggleBookmark(course.id)"
                class="rounded-full p-2 transition-colors hover:bg-[var(--bg-alt)]"
                :aria-label="course.bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'"
              >
                <svg class="h-5 w-5" :class="course.bookmarked ? 'fill-red-500 text-red-500' : 'text-[var(--muted)]/70'"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            <!-- Action Button -->
            <router-link
              :to="'/courses/' + course.id"
              class="btn-brand flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-center font-semibold text-white transition-all duration-200"
              :class="course.price === 0 
                ? 'opacity-95' 
                : ''"
              :aria-label="course.price === 0 ? `Enroll in ${course.title} for free` : `View ${course.title} course details`"
            >
              <span>{{ course.price === 0 ? 'Enroll for Free' : 'View Course' }}</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
            
            <!-- Quick Action -->
            <div v-if="course.price > 0" 
                 class="mt-3 text-center">
              <button
                @click.stop="addToCart(course)"
                class="text-sm font-medium text-[var(--brand-strong)] transition-colors hover:text-[var(--brand)]"
              >
                + Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseListing',
  props: {
    courses: {
      type: Array,
      required: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    showBookmark: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    navigateToCourse(courseId) {
      this.$router.push(`/courses/${courseId}`);
    },
    
    handleImageError(event) {
      event.target.src = '/placeholder-course.jpg';
    },
    
    formatDuration(duration) {
      if (!duration) return 'N/A';
      return duration;
    },
    
    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
      }
      return num.toString();
    },
    
    getLevelClass(level) {
      const classes = {
        'Beginner': 'bg-[var(--bg-alt)] text-[var(--brand-strong)]',
        'Intermediate': 'bg-yellow-100 text-yellow-800',
        'Advanced': 'bg-red-100 text-red-700',
        'All Levels': 'bg-[var(--surface-soft)] text-[var(--brand-strong)]'
      };
      return classes[level] || 'bg-[var(--surface-soft)] text-[var(--muted)]';
    },
    
    isCourseNew(createdAt) {
      if (!createdAt) return false;
      const createdDate = new Date(createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
      return diffDays <= 30; // New if created within last 30 days
    },
    
    toggleBookmark(courseId) {
      this.$emit('bookmark-toggle', courseId);
    },
    
    addToCart(course) {
      this.$emit('add-to-cart', course);
    }
  }
}
</script>

<style scoped>
/* Custom animations */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Custom scrollbar for course descriptions if needed */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Focus styles for accessibility */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Custom animation for skeleton loading */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
