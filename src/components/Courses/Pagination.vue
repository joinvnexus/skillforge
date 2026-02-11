<!-- src/componentes/couses/Pagination.vue -->
<template>
  <div class="mt-8 flex justify-center" data-aos="fade-up">
    <nav class="flex items-center space-x-2">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
      >
        Previous
      </button>
      
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="changePage(page)"
        :class="{ 'bg-blue-600 text-white border-blue-600': currentPage === page }"
        class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
      >
        {{ page }}
      </button>
      
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
      >
        Next
      </button>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  computed: {
    visiblePages() {
      const range = 2
      let start = Math.max(1, this.currentPage - range)
      let end = Math.min(this.totalPages, start + range * 2)
      
      if (end === this.totalPages) {
        start = Math.max(1, end - range * 2)
      }
      
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
  },
  methods: {
    changePage(page) {
      this.$emit('page-changed', page)
    },
    prevPage() {
      this.$emit('page-changed', this.currentPage - 1)
    },
    nextPage() {
      this.$emit('page-changed', this.currentPage + 1)
    }
  }
}
</script>