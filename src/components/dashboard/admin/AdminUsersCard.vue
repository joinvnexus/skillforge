<template>
  <article class="admin-card p-5 lg:col-span-2">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 class="text-lg font-semibold text-slate-900">Users (Role / Status Management)</h2>
      <div class="grid gap-2 md:grid-cols-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search name/email"
          class="rounded border border-slate-300 px-2 py-1 text-xs"
          @keyup.enter="$emit('apply-filters')"
        />
        <select v-model="filters.role" class="rounded border border-slate-300 px-2 py-1 text-xs">
          <option value="">All Roles</option>
          <option value="STUDENT">STUDENT</option>
          <option value="INSTRUCTOR">INSTRUCTOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <select v-model="filters.status" class="rounded border border-slate-300 px-2 py-1 text-xs">
          <option value="">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="PENDING">PENDING</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>
        <button class="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('apply-filters')">
          Apply
        </button>
      </div>
    </div>
    <div v-if="!users.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No users found for the selected filters.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="user in users" :key="user.id" class="rounded-lg border border-slate-200 p-3">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-800">{{ user.name }}</p>
            <p class="text-xs text-slate-500">{{ user.email }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <select v-model="edits[user.id].role" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="STUDENT">STUDENT</option>
              <option value="INSTRUCTOR">INSTRUCTOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <select v-model="edits[user.id].status" class="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="ACTIVE">ACTIVE</option>
              <option value="PENDING">PENDING</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
            <button
              class="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
              @click="$emit('save-user', user.id)"
            >
              Save
            </button>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="meta.total" class="mt-4 flex items-center justify-between text-xs text-slate-600">
      <span>Page {{ meta.page }} / {{ meta.totalPages || 1 }} ({{ meta.total }} users)</span>
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
  users: { type: Array, required: true },
  edits: { type: Object, required: true },
  meta: { type: Object, required: true },
  filters: { type: Object, required: true }
});

defineEmits(["apply-filters", "change-page", "save-user"]);
</script>
