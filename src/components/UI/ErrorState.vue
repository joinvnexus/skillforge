<template>
  <div class="text-center py-12 text-red-500">
    {{ error }}
    <button
      @click="$emit('retry')"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: String,
      required: true
    }
  }
}
</script>