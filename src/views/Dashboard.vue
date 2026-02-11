<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white min-h-screen shadow-sm">
      <div class="p-5 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>
      <nav class="p-4">
        <ul class="space-y-1">
          <li>
            <router-link 
              to="/dashboard/my-courses" 
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              active-class="bg-blue-50 text-blue-600"
            >
              <i class="fas fa-book-open w-5 mr-3"></i>
              My Courses
            </router-link>
          </li>
          <li>
            <router-link 
              to="/dashboard/profile" 
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              active-class="bg-blue-50 text-blue-600"
            >
              <i class="fas fa-user w-5 mr-3"></i>
              Profile
            </router-link>
          </li>
          <li>
            <routerLink 
              to="/dashboard/settings" 
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              active-class="bg-blue-50 text-blue-600"
            >
              <i class="fas fa-cog w-5 mr-3"></i>
              Settings
            </routerLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>

<script>
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()

    return { store }
  }
}
</script>