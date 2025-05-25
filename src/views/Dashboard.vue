<template>
  <div class="flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-100 min-h-screen p-4">
      <h2 class="text-lg font-semibold mb-4">Dashboard</h2>
      <ul class="space-y-2">
        <li><RouterLink to="/dashboard/profile">👤 Profile</RouterLink></li>
        <li><RouterLink to="/dashboard/settings">⚙️ Settings</RouterLink></li>
      </ul>
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