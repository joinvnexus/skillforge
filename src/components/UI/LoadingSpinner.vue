<template>
  <div class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            >

    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  // Optional props for customization
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    color: {
      type: String,
      default: 'blue-500'
    }
  },
  computed: {
    spinnerClasses() {
      return {
        'small': 'h-8 w-8 border-t-2 border-b-2',
        'medium': 'h-12 w-12 border-t-2 border-b-2',
        'large': 'h-16 w-16 border-t-3 border-b-3'
      }[this.size]
    },
    spinnerColor() {
      return `border-${this.color}`
    }
  }
}
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>