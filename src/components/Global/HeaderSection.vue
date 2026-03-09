<template>
  <header class="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-4">
    <div class="mx-auto max-w-7xl rounded-2xl border border-[var(--line)] bg-white/85 shadow-[0_12px_34px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div class="flex items-center justify-between px-3 py-2.5 md:px-5">
        <router-link to="/" class="flex items-center gap-3">
          <div class="rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] p-1.5">
            <img src="@/assets/logo.svg" alt="Skillshare" class="h-7 w-7 rounded-lg bg-white p-1" />
          </div>
          <div class="hidden md:block">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Learning Platform</p>
            <p class="text-base font-extrabold text-slate-900">Skillshare</p>
          </div>
        </router-link>

        <nav class="hidden items-center gap-1 rounded-xl bg-[var(--surface-soft)] p-1 md:flex">
          <router-link
            v-for="item in primaryLinks"
            :key="item.to"
            :to="item.to"
            :class="[
              'rounded-lg px-3 py-2 text-sm font-semibold transition',
              isActive(item.to)
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="flex items-center gap-2 md:gap-3">
          <form @submit.prevent="performSearch" class="relative hidden lg:block">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search courses, paths..."
              class="w-64 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none ring-[var(--accent)]/40 focus:ring"
            />
            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.65 16.65M18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </form>

          <template v-if="!isAuthenticated">
            <router-link to="/login" class="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:inline-flex">Login</router-link>
            <router-link to="/signup" class="rounded-xl px-4 py-2 text-sm font-bold text-white btn-brand">Get Started</router-link>
          </template>

          <template v-else>
            <span class="hidden rounded-full bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white lg:inline-flex">
              {{ roleLabel }}
            </span>

            <template v-if="isStudent">
              <router-link to="/dashboard/wishlist" class="hidden items-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:inline-flex">
                Wishlist
                <span v-if="wishlistCount > 0" class="ml-2 rounded-full bg-[var(--brand-strong)] px-1.5 text-xs font-bold text-white">{{ wishlistCount }}</span>
              </router-link>
              <router-link to="/dashboard/cart" class="hidden items-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:inline-flex">
                Cart
                <span v-if="cartCount > 0" class="ml-2 rounded-full bg-[var(--accent)] px-1.5 text-xs font-bold text-slate-900">{{ cartCount }}</span>
              </router-link>
            </template>

            <div class="relative hidden md:block" ref="profileMenuRef">
              <button
                @click="isProfileMenuOpen = !isProfileMenuOpen"
                type="button"
                class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 text-xs font-bold text-white">
                  {{ userInitial }}
                </span>
                <span class="max-w-24 truncate">{{ userName }}</span>
              </button>
              <transition name="fade-slide">
                <div v-if="isProfileMenuOpen" class="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <router-link @click="closeProfileMenu" to="/dashboard" class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Dashboard</router-link>
                  <router-link @click="closeProfileMenu" to="/dashboard/profile" class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Profile</router-link>
                  <router-link
                    v-if="isAdmin"
                    @click="closeProfileMenu"
                    to="/dashboard/admin-panel"
                    class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Admin Panel
                  </router-link>
                  <router-link
                    v-else-if="isInstructor"
                    @click="closeProfileMenu"
                    to="/dashboard/instructor-courses"
                    class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Instructor Courses
                  </router-link>
                  <router-link
                    v-else
                    @click="closeProfileMenu"
                    to="/dashboard/orders"
                    class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    My Orders
                  </router-link>
                  <button @click="handleLogout" type="button" class="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              </transition>
            </div>
          </template>

          <button
            class="rounded-xl border border-slate-300 bg-white p-2 text-slate-700 md:hidden"
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
        <div v-if="isMobileMenuOpen" class="border-t border-[var(--line)] bg-white px-3 py-3 md:hidden">
          <form @submit.prevent="performSearch" class="relative mb-3">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none ring-[var(--accent)]/40 focus:ring"
            />
            <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.65 16.65M18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </form>

          <nav class="grid gap-1">
            <router-link
              v-for="item in primaryLinks"
              :key="`mobile-${item.to}`"
              @click="closeMobileMenu"
              :to="item.to"
              class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <div class="mt-3 border-t border-slate-200 pt-3">
            <template v-if="isAuthenticated">
              <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{{ roleLabel }}</p>
              <router-link @click="closeMobileMenu" to="/dashboard" class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Dashboard</router-link>
              <router-link @click="closeMobileMenu" to="/dashboard/profile" class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Profile</router-link>
              <router-link
                v-if="isAdmin"
                @click="closeMobileMenu"
                to="/dashboard/admin-panel"
                class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Admin Panel
              </router-link>
              <router-link
                v-else-if="isInstructor"
                @click="closeMobileMenu"
                to="/dashboard/instructor-courses"
                class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Instructor Courses
              </router-link>
              <template v-else>
                <router-link @click="closeMobileMenu" to="/dashboard/wishlist" class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  Wishlist ({{ wishlistCount }})
                </router-link>
                <router-link @click="closeMobileMenu" to="/dashboard/cart" class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  Cart ({{ cartCount }})
                </router-link>
                <router-link @click="closeMobileMenu" to="/dashboard/orders" class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  Orders
                </router-link>
              </template>
              <button @click="handleLogout" type="button" class="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50">
                Logout
              </button>
            </template>
            <template v-else>
              <router-link @click="closeMobileMenu" to="/login" class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Login</router-link>
              <router-link @click="closeMobileMenu" to="/signup" class="mt-1 block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Signup</router-link>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()
const searchQuery = ref('')
const isMobileMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)
const profileMenuRef = ref(null)
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const userName = computed(() => store.getters['auth/userDisplayName'] || 'User')
const userInitial = computed(() => String(userName.value || 'U').charAt(0).toUpperCase())
const role = computed(() => store.getters['auth/userRole'])
const roleLabel = computed(() => role.value || 'STUDENT')
const isStudent = computed(() => role.value === 'STUDENT')
const isInstructor = computed(() => role.value === 'INSTRUCTOR')
const isAdmin = computed(() => role.value === 'ADMIN')
const cartCount = computed(() => store.getters['cart/cartCount'])
const wishlistCount = computed(() => store.getters['wishlist/wishlistCount'])
const primaryLinks = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'Blog', to: '/blog' },
  { label: 'Support', to: '/support' }
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const performSearch = () => {
  if (!searchQuery.value.trim()) return
  store.dispatch('filters/updateSearchQuery', searchQuery.value)
  router.push({ name: 'SearchResults', query: { q: searchQuery.value } })
  searchQuery.value = ''
  closeMobileMenu()
}

const handleLogout = async () => {
  closeProfileMenu()
  await store.dispatch('auth/logout')
  store.dispatch('cart/clearCart')
  store.commit('wishlist/SET_ITEMS', [])
  closeMobileMenu()
  router.push('/login')
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const closeProfileMenu = () => {
  isProfileMenuOpen.value = false
}

const handleClickOutside = (event) => {
  if (!profileMenuRef.value) return
  if (!profileMenuRef.value.contains(event.target)) {
    closeProfileMenu()
  }
}

const hydrateStudentCollections = async () => {
  if (!isAuthenticated.value || !isStudent.value) return
  try {
    await store.dispatch('wishlist/fetchWishlist')
  } catch (_error) {
    // Silent fail for navbar-only data hydration.
  }
}

watch(
  () => [isAuthenticated.value, role.value],
  () => {
    hydrateStudentCollections()
    if (!isAuthenticated.value) {
      closeProfileMenu()
    }
  },
  { immediate: true }
)

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()
    closeProfileMenu()
  }
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
