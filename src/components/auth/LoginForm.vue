<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Log In</h2>
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

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
        >
          {{ isLoading ? 'Logging in...' : 'Log In' }}
        </button>

        <p v-if="error" class="text-sm text-red-600 text-center mt-2">{{ error }}</p>

        <p class="text-sm text-center">
          <router-link to="/forgot-password" class="text-blue-600 hover:underline">Forgot password?</router-link>
        </p>

        <p class="text-center text-sm text-gray-600">
          Don't have an account?
          <router-link to="/signup" class="text-blue-600 hover:underline">Sign up</router-link>
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
      password: '',
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
      const { email, password } = this
      const result = await this.$store.dispatch('auth/login', { email, password })
      if (result.success) {
        const redirect = this.$route.query.redirect || '/dashboard'
        this.$router.push(redirect)
      }
    }
  }
}
</script>
<style scoped>
</style>
