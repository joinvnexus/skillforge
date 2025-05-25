<!-- src/views/dashboard/UserSettings.vue -->
<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">⚙️ User Settings</h1>
    <form @submit.prevent="update" class="space-y-4 max-w-md">
      <div>
        <label class="block text-sm font-medium">Display Name</label>
        <input
          v-model="name"
          type="text"
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Save Changes
      </button>
      <p v-if="success" class="text-green-500">✅ Profile updated!</p>
      <p v-else class="text-gray-500">Make changes to your profile.</p>
      <p class="text-sm text-gray-500">
        Current User: {{ user?.displayName || 'Guest' }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const user = computed(() => store.getters['auth/currentUser'])
const name = ref(user.value?.displayName || '')
const success = ref(false)

const update = async () => {
  // You need to implement an action to update the user profile in your Vuex module if not present
  await store.dispatch('auth/updateUserProfile', { displayName: name.value })
  success.value = true
}
</script>
