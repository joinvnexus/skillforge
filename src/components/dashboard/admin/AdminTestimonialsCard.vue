<template>
  <article class="admin-card p-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 class="text-lg font-semibold text-slate-900">Testimonials</h2>
      <div class="grid gap-2 md:grid-cols-3">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search name/quote"
          class="rounded border border-slate-300 px-2 py-1 text-xs"
          @keyup.enter="$emit('apply-filters')"
        />
        <select v-model="filters.approved" class="rounded border border-slate-300 px-2 py-1 text-xs">
          <option value="false">Pending</option>
          <option value="">All</option>
          <option value="true">Approved</option>
        </select>
        <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('apply-filters')">
          Apply
        </button>
      </div>
    </div>
    <div v-if="!testimonials.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No testimonials match these filters.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="item in testimonials" :key="item.id" class="rounded-lg border border-slate-200 p-3">
        <p class="text-sm font-semibold text-slate-800">{{ item.name }}</p>
        <p class="mt-1 text-sm text-slate-600">"{{ item.quote }}"</p>
        <div class="mt-3 flex gap-2">
          <button
            v-if="!item.isApproved"
            class="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
            @click="$emit('approve', item.id)"
          >
            Approve
          </button>
          <button
            class="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            @click="$emit('toggle-featured', item)"
          >
            {{ item.isFeatured ? "Unfeature" : "Feature" }}
          </button>
        </div>
      </li>
    </ul>
    <div v-if="meta.total" class="mt-4 flex items-center justify-between text-xs text-slate-600">
      <span>Page {{ meta.page }} / {{ meta.totalPages || 1 }} ({{ meta.total }} items)</span>
      <div class="flex gap-2">
        <button
          class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50"
          :disabled="meta.page <= 1"
          @click="$emit('change-page', meta.page - 1)"
        >
          Prev
        </button>
        <button
          class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50"
          :disabled="meta.page >= meta.totalPages"
          @click="$emit('change-page', meta.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  testimonials: { type: Array, required: true },
  meta: { type: Object, required: true },
  filters: { type: Object, required: true }
});

defineEmits(["apply-filters", "change-page", "approve", "toggle-featured"]);
</script>
