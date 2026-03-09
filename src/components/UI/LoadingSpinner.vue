<template>
  <div class="flex justify-center py-12">
    <div class="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
      <span :class="spinnerClasses" class="inline-block animate-spin rounded-full border-2 border-slate-200 border-t-sky-600"></span>
      <span>Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  },
  computed: {
    spinnerClasses() {
      return {
        small: 'h-4 w-4',
        medium: 'h-5 w-5',
        large: 'h-6 w-6'
      }[this.size]
    }
  }
}
</script>
