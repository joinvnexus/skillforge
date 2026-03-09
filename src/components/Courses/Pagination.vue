<template>
  <div class="mt-8 flex justify-center" data-aos="fade-up">
    <nav class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm" aria-label="Pagination">
      <button
        @click="prevPage"
        :disabled="isPrevDisabled"
        class="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="changePage(page)"
        :aria-current="currentPage === page ? 'page' : undefined"
        :class="[
          'min-w-10 rounded-xl px-3 py-2 text-sm font-semibold transition',
          currentPage === page
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-700 hover:bg-slate-100'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="nextPage"
        :disabled="isNextDisabled"
        class="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  </div>
</template>

<script>
export default {
  name: "CoursePagination",
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
    isPrevDisabled() {
      return this.currentPage <= 1;
    },
    isNextDisabled() {
      return this.currentPage >= this.totalPages;
    },
    visiblePages() {
      const range = 2;
      let start = Math.max(1, this.currentPage - range);
      let end = Math.min(this.totalPages, start + range * 2);

      if (end === this.totalPages) {
        start = Math.max(1, end - range * 2);
      }

      return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }
  },
  methods: {
    changePage(page) {
      if (page === this.currentPage) return;
      this.$emit("page-changed", page);
    },
    prevPage() {
      if (this.isPrevDisabled) return;
      this.$emit("page-changed", this.currentPage - 1);
    },
    nextPage() {
      if (this.isNextDisabled) return;
      this.$emit("page-changed", this.currentPage + 1);
    }
  }
};
</script>
