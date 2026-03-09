<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-white/80 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <router-link to="/" class="flex items-center gap-2">
        <img src="@/assets/logo.svg" alt="Skillshare" class="h-9" />
        <span class="hidden text-sm font-extrabold uppercase tracking-[0.18em] text-slate-700 md:inline">Skillshare</span>
      </router-link>

      <nav class="hidden items-center gap-6 md:flex">
        <router-link to="/" class="text-sm font-semibold text-slate-700 hover:text-[var(--brand-strong)]">Home</router-link>
        <router-link to="/courses" class="text-sm font-semibold text-slate-700 hover:text-[var(--brand-strong)]">Courses</router-link>
        <router-link to="/blog" class="text-sm font-semibold text-slate-700 hover:text-[var(--brand-strong)]">Blog</router-link>
        <router-link to="/support" class="text-sm font-semibold text-slate-700 hover:text-[var(--brand-strong)]">Support</router-link>
      </nav>

      <div class="flex items-center gap-3">
        <input
          v-model="searchQuery"
          @keyup.enter="performSearch"
          type="text"
          placeholder="Search..."
          class="hidden rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none lg:block"
        />

        <template v-if="!isAuthenticated">
          <router-link to="/login" class="text-sm font-semibold text-slate-700 hover:text-[var(--brand-strong)]">Login</router-link>
          <router-link to="/signup" class="rounded-xl px-4 py-2 text-sm font-bold text-white btn-brand">
            Start
          </router-link>
        </template>

        <template v-else>
          <router-link to="/dashboard" class="text-sm font-semibold text-slate-700 hover:text-[var(--brand-strong)]">Dashboard</router-link>
          <button
            @click="handleLogout"
            class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Logout
          </button>
        </template>

        <button
          class="rounded-lg border border-slate-300 px-2 py-2 text-slate-700 md:hidden"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          type="button"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <transition name="fade-slide">
      <div v-if="isMobileMenuOpen" class="border-t border-[var(--line)] bg-white p-4 md:hidden">
        <nav class="grid gap-2">
          <router-link @click="closeMobileMenu" to="/" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Home</router-link>
          <router-link @click="closeMobileMenu" to="/courses" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Courses</router-link>
          <router-link @click="closeMobileMenu" to="/blog" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Blog</router-link>
          <router-link @click="closeMobileMenu" to="/support" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Support</router-link>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const searchQuery = ref('')
const isMobileMenuOpen = ref(false)
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

const performSearch = () => {
  if (!searchQuery.value.trim()) return
  store.dispatch('filters/updateSearchQuery', searchQuery.value)
  router.push({ name: 'SearchResults', query: { q: searchQuery.value } })
  searchQuery.value = ''
}

const handleLogout = async () => {
  await store.dispatch('auth/logout')
  closeMobileMenu()
  router.push('/login')
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>
