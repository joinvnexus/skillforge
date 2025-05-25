<template>
  <header class="fixed w-full bg-white shadow-sm z-50">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center">
        <img src="@/assets/logo.svg" alt="VueMastery Academy Logo" class="h-10">
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-8">
        <router-link to="/" class="text-gray-700 hover:text-blue-600 transition-colors"
          active-class="text-blue-600 font-medium">Home</router-link>
        <router-link to="/courses" class="text-gray-700 hover:text-blue-600 transition-colors"
          active-class="text-blue-600 font-medium">Courses</router-link>
        <router-link to="/blog" class="text-gray-700 hover:text-blue-600 transition-colors"
          active-class="text-blue-600 font-medium">Blog</router-link>
        <router-link to="/resources" class="text-gray-700 hover:text-blue-600 transition-colors"
          active-class="text-blue-600 font-medium">Resources</router-link>
        <router-link to="/contact" class="text-gray-700 hover:text-blue-600 transition-colors"
          active-class="text-blue-600 font-medium">Contact Us</router-link>
        <router-link to="/support" class="text-gray-700 hover:text-blue-600 transition-colors"
          active-class="text-blue-600 font-medium">Support</router-link>
      </nav>

      <!-- Right Side Elements -->
      <div class="flex items-center space-x-4">
        <!-- Search Bar - Hidden on mobile -->
        <div class="relative hidden lg:block">
          <input
            :value="searchQuery"
            @input="handleSearchInput"
            type="text"
            placeholder="Search courses..."
            class="py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="performSearch">
          <button @click="performSearch"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <!-- Auth Buttons -->
        <template v-if="!isAuthenticated">
          <router-link to="/login"
            class="hidden md:inline-block text-blue-600 hover:text-blue-800 px-3 py-1 transition-colors">
            Login
          </router-link>
          <router-link to="/signup"
            class="hidden md:inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Get Started
          </router-link>
        </template>

        <!-- User Profile -->
        <div v-if="isAuthenticated" class="relative" ref="dropdownRef">
          <img :src="userPhoto || defaultAvatar" alt="User Profile" @click="toggleDropdown"
            class="h-10 w-10 rounded-full border-2 border-gray-200 object-cover cursor-pointer hover:border-blue-500 transition-colors">
          <!-- Dropdown Menu -->
          <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <div class="px-4 py-2 border-b">
              <p class="font-medium text-gray-900 truncate">{{ userDisplayName }}</p>
              <p class="text-sm text-gray-500 truncate">{{ userEmail }}</p>
            </div>
            <router-link to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              @click="closeDropdown">Profile</router-link>
            <router-link to="/dashboard" class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              @click="closeDropdown">Dashboard</router-link>
            <router-link to="/notifications" class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              @click="closeDropdown">Notifications</router-link>
            <button @click="handleLogout" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
              Logout
            </button>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button @click="toggleMobileMenu" class="md:hidden text-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white shadow-md">
      <div class="container mx-auto px-4 py-2">
        <!-- Mobile Search -->
        <div class="relative mb-4">
          <input :value="searchQuery"
            @input="handleSearchInput"
            @keyup.enter="performSearch" type="text"
            placeholder="Search courses..."
            class="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <button @click="performSearch"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <nav class="flex flex-col space-y-2">
          <router-link to="/" class="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
            active-class="bg-blue-50 text-blue-600" @click="toggleMobileMenu">Home</router-link>
          <router-link to="/courses" class="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
            active-class="bg-blue-50 text-blue-600" @click="toggleMobileMenu">Courses</router-link>
          <router-link to="/blog" class="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
            active-class="bg-blue-50 text-blue-600" @click="toggleMobileMenu">Blog</router-link>
          <router-link to="/resources" class="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
            active-class="bg-blue-50 text-blue-600" @click="toggleMobileMenu">Resources</router-link>
          <router-link to="/contact" class="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
            active-class="bg-blue-50 text-blue-600" @click="toggleMobileMenu">Contact Us</router-link>
          <router-link to="/support" class="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
            active-class="bg-blue-50 text-blue-600" @click="toggleMobileMenu">Support</router-link>
        </nav>

        <!-- Mobile Auth Buttons -->
        <template v-if="!isAuthenticated">
          <router-link to="/login"
            class="mt-4 inline-block w-full text-center text-blue-600 hover:text-blue-800 px-4 py-2 transition-colors"
            @click="toggleMobileMenu">
            Login
          </router-link>
          <router-link to="/signup"
            class="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            @click="toggleMobileMenu">
            Get Started
          </router-link>
        </template>
        <template v-else>
          <div class="mt-4 px-4 py-2 border-t">
            <p class="font-medium text-gray-900 truncate">{{ userDisplayName }}</p>
            <p class="text-sm text-gray-500 truncate">{{ userEmail }}</p>
          </div>
          <router-link to="/dashboard" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            @click="toggleMobileMenu">Profile</router-link>
          <button @click="handleLogout" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
            Logout
          </button>
        </template>
      </div>
    </div>

    <!-- Search Suggestions -->
    <div class="absolute left-0 right-0 bg-white border rounded shadow z-50"
      v-if="showSuggestions && suggestions.length">
      <ul>
        <li v-for="course in suggestions" :key="course.id" @click="goToCourse(course.id)"
          class="px-4 py-2 hover:bg-blue-100 cursor-pointer">
          {{ course.title }}
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
// import defaultAvatar from '@/assets/default-avatar.png'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // Refs for UI state
    const searchQuery = ref('')
    const showDropdown = ref(false)
    const isMobileMenuOpen = ref(false)
    const showSuggestions = ref(false)
    const suggestions = ref([])
    const dropdownRef = ref(null)

    // Computed properties from Vuex
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const userPhoto = computed(() => store.state.auth.user?.photoURL)
    const userDisplayName = computed(() => store.state.auth.user?.displayName || 'User')
    const userEmail = computed(() => store.state.auth.user?.email || '')
    const isLoading = computed(() => store.getters['auth/isLoading'])

    // Methods
    const handleSearchInput = (event) => {
      searchQuery.value = event.target.value
      // You can add debounce here if needed
    }

    const performSearch = () => {
      if (!searchQuery.value.trim()) return
      store.dispatch('filters/updateSearchQuery', searchQuery.value)
      router.push({ name: 'SearchResults', query: { q: searchQuery.value } })
      searchQuery.value = ''
    }

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const closeDropdown = () => {
      showDropdown.value = false
    }

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
      if (isMobileMenuOpen.value) {
        showDropdown.value = false
      }
    }

    const handleLogout = async () => {
      try {
        await store.dispatch('auth/logout')
        closeDropdown()
        toggleMobileMenu()
        router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    // Close dropdown when clicking outside
    onClickOutside(dropdownRef, closeDropdown)

    return {
      searchQuery,
      showDropdown,
      isMobileMenuOpen,
      showSuggestions,
      suggestions,
      dropdownRef,
      // defaultAvatar,
      isAuthenticated,
      userPhoto,
      userDisplayName,
      userEmail,
      isLoading,
      handleSearchInput,
      performSearch,
      toggleDropdown,
      closeDropdown,
      toggleMobileMenu,
      handleLogout
    }
  }
}
</script>