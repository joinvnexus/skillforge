<template>
  <div class="section-shell py-12 text-center">
    <p class="text-lg font-semibold text-slate-900">No courses match your filters.</p>
    <p class="mt-1 text-sm text-slate-500">Try resetting filters and search again.</p>
    <button
      @click="$emit('reset')"
      class="btn-brand mt-5 rounded-xl px-5 py-2 text-sm"
    >
      Reset Filters
    </button>
  </div>
</template>
