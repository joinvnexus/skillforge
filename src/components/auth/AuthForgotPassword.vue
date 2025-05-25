<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
        >
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>

        <p v-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>
        <p v-if="message" class="text-sm text-green-600 text-center">{{ message }}</p>

        <p class="text-center text-sm text-gray-600">
          <router-link to="/login" class="text-blue-600 hover:underline">Back to login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      message: ''
    }
  },
  computed: {
    isLoading() {
      return this.$store.getters['auth/isLoading']
    },
    error() {
      return this.$store.getters['auth/authError']
    }
  },
  methods: {
    async handleSubmit() {
      this.message = ''
      const result = await this.$store.dispatch('auth/forgotPassword', this.email)
      if (result.success) {
        this.message = 'Password reset email sent. Please check your inbox.'
      }
    }
  }
}
</script>
