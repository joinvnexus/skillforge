<template>
  <div class="min-h-screen bg-slate-50 pt-20">
    <div class="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[250px_1fr]">
      <aside class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="px-3 py-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Workspace</h2>
        <nav class="mt-2 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            active-class="bg-slate-900 text-white hover:bg-slate-900"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </aside>

      <main class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const role = computed(() => store.getters['auth/userRole'])

const navItems = computed(() => {
  const common = [
    { label: 'Overview', to: '/dashboard' },
    { label: 'Profile', to: '/dashboard/profile' },
    { label: 'Settings', to: '/dashboard/settings' }
  ]

  if (role.value === 'ADMIN') {
    return [...common, { label: 'Admin Panel', to: '/dashboard/admin-panel' }]
  }

  if (role.value === 'INSTRUCTOR') {
    return [...common, { label: 'Instructor Courses', to: '/dashboard/instructor-courses' }]
  }

  return [...common, { label: 'My Courses', to: '/dashboard/my-courses' }]
})
</script>
