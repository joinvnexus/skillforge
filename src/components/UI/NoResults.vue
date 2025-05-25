<template>
  <div class="text-center py-12 bg-white rounded-lg shadow-sm">
    <p class="text-gray-600 text-lg">No courses match your filters.</p>
    <button
      @click="$emit('reset')"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Reset Filters
    </button>
  </div>
</template>