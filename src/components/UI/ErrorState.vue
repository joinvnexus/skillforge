<template>
  <div class="section-shell py-10 text-center">
    <p class="text-lg font-semibold text-red-700">Something went wrong</p>
    <p class="mx-auto mt-2 max-w-xl text-sm text-red-600">{{ error }}</p>
    <button
      @click="$emit('retry')"
      class="btn-brand mt-5 rounded-xl px-5 py-2 text-sm"
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
