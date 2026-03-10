<template>
  <article class="admin-card p-5 lg:col-span-2">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 class="text-lg font-semibold text-slate-900">Learning Paths Management</h2>
      <div class="grid gap-2 md:grid-cols-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search title/slug"
          class="rounded border border-slate-300 px-2 py-1 text-xs"
          @keyup.enter="$emit('apply-filters')"
        />
        <select v-model="filters.level" class="rounded border border-slate-300 px-2 py-1 text-xs">
          <option value="">All Levels</option>
          <option value="BEGINNER">BEGINNER</option>
          <option value="INTERMEDIATE">INTERMEDIATE</option>
          <option value="ADVANCED">ADVANCED</option>
        </select>
        <select v-model="filters.published" class="rounded border border-slate-300 px-2 py-1 text-xs">
          <option value="">All</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>
        <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('apply-filters')">
          Apply
        </button>
      </div>
    </div>

    <div class="mt-3 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-6">
      <input v-model="createForm.slug" type="text" placeholder="Slug (e.g. frontend-foundations)" class="rounded border border-slate-300 px-2 py-1 text-xs" />
      <input v-model="createForm.title" type="text" placeholder="Title (e.g. Frontend Foundations)" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
      <input v-model="createForm.estimatedDuration" type="text" placeholder="Estimated Duration (e.g. 6 weeks)" class="rounded border border-slate-300 px-2 py-1 text-xs" />
      <select v-model="createForm.level" class="rounded border border-slate-300 px-2 py-1 text-xs">
        <option value="BEGINNER">BEGINNER</option>
        <option value="INTERMEDIATE">INTERMEDIATE</option>
        <option value="ADVANCED">ADVANCED</option>
      </select>
      <input v-model="createForm.icon" type="text" placeholder="Icon (emoji or name, e.g. 🚀)" class="rounded border border-slate-300 px-2 py-1 text-xs" />
      <input v-model="createForm.imageUrl" type="text" placeholder="Image URL (https://...)" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
      <input v-model="createForm.featuresText" type="text" placeholder="Features (comma separated, e.g. Quizzes, Projects)" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
      <input v-model="createForm.skillsText" type="text" placeholder="Skills (comma separated, e.g. HTML, CSS)" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
      <input v-model.number="createForm.displayOrder" type="number" min="0" placeholder="Display Order (0)" class="rounded border border-slate-300 px-2 py-1 text-xs" />
      <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('create-path')">
        Create
      </button>
      <textarea v-model="createForm.description" rows="2" placeholder="Description (what learners will achieve)" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-6"></textarea>
      <textarea
        v-model="createForm.projectsJson"
        rows="2"
        placeholder='Projects JSON (optional) e.g. [{"title":"Portfolio","description":"Build a site"}]'
        class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-6"
      ></textarea>
    </div>

    <div v-if="!paths.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No learning paths found. Create the first path to get started.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="path in paths" :key="path.id" class="rounded-lg border border-slate-200 p-3">
        <p class="text-sm font-semibold text-slate-800">{{ path.title }}</p>
        <p class="text-xs text-slate-500">{{ path.slug }} · {{ path.level }}</p>
        <div class="mt-2 grid gap-2 md:grid-cols-6">
          <input v-model="edits[path.id].title" type="text" placeholder="Title" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
          <input v-model="edits[path.id].estimatedDuration" type="text" placeholder="Estimated Duration" class="rounded border border-slate-300 px-2 py-1 text-xs" />
          <select v-model="edits[path.id].level" class="rounded border border-slate-300 px-2 py-1 text-xs">
            <option value="BEGINNER">BEGINNER</option>
            <option value="INTERMEDIATE">INTERMEDIATE</option>
            <option value="ADVANCED">ADVANCED</option>
          </select>
          <input v-model="edits[path.id].icon" type="text" placeholder="Icon" class="rounded border border-slate-300 px-2 py-1 text-xs" />
          <input v-model.number="edits[path.id].displayOrder" type="number" min="0" placeholder="Display Order" class="rounded border border-slate-300 px-2 py-1 text-xs" />
          <button
            class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800"
            @click="$emit('save-path', path.id)"
          >
            Save
          </button>
        </div>
        <div class="mt-2 grid gap-2 md:grid-cols-6">
          <input v-model="edits[path.id].imageUrl" type="text" placeholder="Image URL (https://...)" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
          <input v-model="edits[path.id].featuresText" type="text" placeholder="Features (comma separated)" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
          <input v-model="edits[path.id].skillsText" type="text" placeholder="Skills (comma separated)" class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-2" />
          <textarea
            v-model="edits[path.id].projectsJson"
            rows="2"
            placeholder='Projects JSON (optional) e.g. [{"title":"Capstone","description":"Build app"}]'
            class="rounded border border-slate-300 px-2 py-1 text-xs md:col-span-6"
          ></textarea>
        </div>
        <div class="mt-2 flex gap-3 text-xs text-slate-700">
          <label class="inline-flex items-center gap-1">
            <input v-model="edits[path.id].isPublished" type="checkbox" />
            Published
          </label>
          <label class="inline-flex items-center gap-1">
            <input v-model="edits[path.id].isFeatured" type="checkbox" />
            Featured
          </label>
        </div>
      </li>
    </ul>

    <div v-if="meta.total" class="mt-4 flex items-center justify-between text-xs text-slate-600">
      <span>Page {{ meta.page }} / {{ meta.totalPages || 1 }} ({{ meta.total }} paths)</span>
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
  paths: { type: Array, required: true },
  edits: { type: Object, required: true },
  meta: { type: Object, required: true },
  filters: { type: Object, required: true },
  createForm: { type: Object, required: true }
});

defineEmits(["apply-filters", "change-page", "create-path", "save-path"]);
</script>
