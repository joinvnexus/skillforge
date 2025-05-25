<template>
  <div class="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
    <div class="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">Your Profile</h2>

      <div v-if="user" class="space-y-8">
        <!-- Avatar Upload -->
        <div class="flex flex-col items-center gap-4">
          <img
            :src="user.photoURL || defaultAvatar"
            class="w-24 h-24 rounded-full object-cover border"
            alt="Avatar"
          />
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="text-sm text-gray-600"
          />
        </div>

        <!-- Profile Form -->
        <form @submit.prevent="updateProfile" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700">Display Name</label>
            <input
              v-model="displayName"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="email"
              type="email"
              disabled
              class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {{ isLoading ? 'Updating...' : 'Update Profile' }}
          </button>
        </form>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            @click="changeEmail"
            class="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md transition"
          >
            Change Email
          </button>
          <button
            @click="changePassword"
            class="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md transition"
          >
            Change Password
          </button>
          <button
            @click="logout"
            class="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>

      <Notification />
    </div>
  </div>
</template>

<script>
// import defaultAvatar from '@/assets/default-avatar.png'

export default {
  data() {
    return {
      // Uncomment if you're using a default avatar
      // defaultAvatar,
      displayName: '',
      email: '',
      newEmail: '',
      photoFile: null
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/currentUser']
    },
    isLoading() {
      return this.$store.getters['auth/isLoading']
    }
  },
  created() {
    if (this.user) {
      this.displayName = this.user.displayName || ''
      this.email = this.user.email || ''
    }
  },
  methods: {
    handleImageUpload(event) {
      this.photoFile = event.target.files[0]
    },
    async updateProfile() {
      const updates = {
        displayName: this.displayName
      }

      if (this.photoFile) {
        // Example: upload photo and get URL
        // const uploadedUrl = await uploadToStorage(this.photoFile)
        // updates.photoURL = uploadedUrl
      }

      await this.$store.dispatch('auth/updateProfile', updates)
    },
    changeEmail() {
      const newEmail = prompt('Enter your new email address:')
      if (newEmail) {
        this.$store.dispatch('auth/updateEmail', newEmail)
      }
    },
    changePassword() {
      this.$router.push('/forgot-password')
    },
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>
