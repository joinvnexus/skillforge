<template>
  <!-- Quick View Modal -->
  <div 
    v-if="course" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Course Image -->
      <div class="relative">
        <img 
          :src="course.image" 
          :alt="course.title"
          class="w-full h-64 object-cover rounded-t-xl"
        >
        <!-- Close Button -->
        <button 
          class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          @click="closeModal"
          aria-label="Close quick view"
        >
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Course Details -->
      <div class="p-6">
        <!-- Title -->
        <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ course.title }}</h2>
        
        <!-- Meta Info -->
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex items-center text-gray-700">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ course.instructor || 'Unknown Instructor' }}
          </div>
          <div class="flex items-center text-gray-700">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ course.duration || 'N/A' }}
          </div>
          <div class="flex items-center text-gray-700">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ course.lessons || 0 }} lessons
          </div>
        </div>
        
        <!-- Rating -->
        <div class="flex items-center mb-6">
          <div class="flex text-yellow-400 mr-2">
            <span v-for="star in 5" :key="star">
              <svg 
                class="w-6 h-6" 
                :class="{ 'text-gray-300': star > Math.round(course.rating || 0) }" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          </div>
          <span class="text-gray-700">
            {{ (course.rating || 0).toFixed(1) }} ({{ course.students || 0 }} students)
          </span>
        </div>
        
        <!-- Description -->
        <div class="prose max-w-none text-gray-700 mb-6">
          <p>{{ course.fullDescription || course.description || 'No description available' }}</p>
        </div>
        
        <!-- Price & CTA -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-2xl font-bold text-gray-900">
            {{ course.price === 0 ? 'Free' : `$${course.price}` }}
          </div>
          <button 
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            @click="enrollCourse"
          >
            Enroll Now
          </button>
        </div>
        
        <!-- Curriculum Preview (Optional) -->
        <div v-if="course.curriculum" class="mb-6">
          <h3 class="text-lg font-semibold mb-3">What You'll Learn</h3>
          <ul class="space-y-2">
            <li 
              v-for="(item, index) in course.curriculum.slice(0, 5)" 
              :key="index"
              class="flex items-start"
            >
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseQuickView',
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    enrollCourse() {
      this.$emit('enroll', this.course)
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

.prose p {
  margin-bottom: 1em;
}

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>