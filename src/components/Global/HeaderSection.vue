<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <router-link to="/" class="flex items-center gap-2">
        <img src="@/assets/logo.svg" alt="Skillshare" class="h-9" />
      </router-link>

      <nav class="hidden items-center gap-6 md:flex">
        <router-link to="/" class="text-sm font-medium text-slate-700 hover:text-slate-900">Home</router-link>
        <router-link to="/courses" class="text-sm font-medium text-slate-700 hover:text-slate-900">Courses</router-link>
        <router-link to="/blog" class="text-sm font-medium text-slate-700 hover:text-slate-900">Blog</router-link>
        <router-link to="/support" class="text-sm font-medium text-slate-700 hover:text-slate-900">Support</router-link>
      </nav>

      <div class="flex items-center gap-3">
        <input
          v-model="searchQuery"
          @keyup.enter="performSearch"
          type="text"
          placeholder="Search..."
          class="hidden rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-400 focus:outline-none lg:block"
        />

        <template v-if="!isAuthenticated">
          <router-link to="/login" class="text-sm font-medium text-slate-700 hover:text-slate-900">Login</router-link>
          <router-link to="/signup" class="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Start
          </router-link>
        </template>

        <template v-else>
          <router-link to="/dashboard" class="text-sm font-medium text-slate-700 hover:text-slate-900">Dashboard</router-link>
          <button
            @click="handleLogout"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Logout
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const searchQuery = ref('')
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

const performSearch = () => {
  if (!searchQuery.value.trim()) return
  store.dispatch('filters/updateSearchQuery', searchQuery.value)
  router.push({ name: 'SearchResults', query: { q: searchQuery.value } })
  searchQuery.value = ''
}

const handleLogout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}
</script>
