<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
    <div class="relative">
      <img
        :src="course.image || '/placeholder-course.jpg'"
        :alt="course.title"
        class="w-full h-32 object-cover"
      />
      <div class="absolute top-2 right-2 flex space-x-2">
        <span
          v-if="course.price === 0"
          class="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold"
        >
          FREE
        </span>
      </div>
    </div>
    <div class="p-4 flex-grow flex flex-col">
      <h3 class="text-lg font-semibold text-gray-900 mb-1">
        <router-link
          :to="'/courses/' + course.id"
          class="hover:text-blue-600 transition-colors"
        >
          {{ course.title }}
        </router-link>
      </h3>
      <p class="text-gray-600 text-sm mb-2">By {{ course.instructor || 'Unknown Instructor' }}</p>
      <p class="text-gray-700 text-sm mb-3 line-clamp-2">
        {{ course.description || 'No description available' }}
      </p>

      <div class="mt-auto">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <div class="flex text-yellow-400 mr-1">
              <span v-for="star in 5" :key="star">
                <svg
                  class="w-4 h-4"
                  :class="{ 'text-gray-300': star > Math.round(course.rating || 0) }"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>
            <span class="text-gray-600 text-sm">
              {{ (course.rating || 0).toFixed(1) }}
            </span>
          </div>
          <span class="text-gray-900 font-semibold">
            {{ course.price === 0 ? 'Free' : '$' + course.price }}
          </span>
        </div>

        <router-link
          :to="'/courses/' + course.id"
          class="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Course
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelatedCourseCard',
  props: {
    course: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
