<template>
  <article class="admin-card p-5 lg:col-span-2">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 class="text-lg font-semibold text-slate-900">Blog Management</h2>
      <div class="grid gap-2 md:grid-cols-3">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search title/slug"
          class="rounded border border-slate-300 px-2 py-1 text-xs"
          @keyup.enter="$emit('apply-filters')"
        />
        <select v-model="filters.status" class="rounded border border-slate-300 px-2 py-1 text-xs">
          <option value="">All Status</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
        <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('apply-filters')">
          Apply
        </button>
      </div>
    </div>

    <div class="mt-3 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-6">
      <input v-model="createForm.slug" type="text" placeholder="Slug" class="rounded border border-slate-300 px-2 py-1 text-xs" />
      <input v-model="createForm.title" type="text" placeholder="Title" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
      <input v-model="createForm.snippet" type="text" placeholder="Snippet" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
      <select v-model="createForm.status" class="rounded border border-slate-300 px-2 py-1 text-xs">
        <option value="DRAFT">DRAFT</option>
        <option value="PUBLISHED">PUBLISHED</option>
        <option value="ARCHIVED">ARCHIVED</option>
      </select>
      <textarea v-model="createForm.content" rows="2" placeholder="Content" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-5"></textarea>
      <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('create-blog')">
        Create
      </button>
    </div>

    <div v-if="!blogs.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No blog posts yet. Create your first article.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="blog in blogs" :key="blog.id" class="rounded-lg border border-slate-200 p-3">
        <p class="text-sm font-semibold text-slate-800">{{ blog.title }}</p>
        <p class="text-xs text-slate-500">{{ blog.slug }}</p>
        <div class="mt-2 grid gap-2 md:grid-cols-4">
          <input v-model="edits[blog.id].title" type="text" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
          <select v-model="edits[blog.id].status" class="rounded border border-slate-300 px-2 py-1 text-xs">
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
          <button
            class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800"
            @click="$emit('save-blog', blog.id)"
          >
            Save
          </button>
        </div>
        <label class="mt-2 inline-flex items-center gap-1 text-xs text-slate-700">
          <input v-model="edits[blog.id].isFeatured" type="checkbox" />
          Featured
        </label>
      </li>
    </ul>

    <div v-if="meta.total" class="mt-4 flex items-center justify-between text-xs text-slate-600">
      <span>Page {{ meta.page }} / {{ meta.totalPages || 1 }} ({{ meta.total }} blogs)</span>
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
  blogs: { type: Array, required: true },
  edits: { type: Object, required: true },
  meta: { type: Object, required: true },
  filters: { type: Object, required: true },
  createForm: { type: Object, required: true }
});

defineEmits(["apply-filters", "change-page", "create-blog", "save-blog"]);
</script>
