<template>
  <div class="flex min-h-[72vh] items-center justify-center px-4 py-8">
    <div class="section-shell glass-surface interactive-lift w-full max-w-md p-8">
      <div class="mb-6 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Welcome Back</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">Log In</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="********"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="btn-brand w-full rounded-xl px-4 py-2.5 text-sm disabled:opacity-70">
          {{ isLoading ? 'Logging in...' : 'Log In' }}
        </button>

        <p v-if="localError || error" class="mt-2 text-center text-sm text-red-600">{{ localError || error }}</p>

        <p class="text-center text-sm">
          <router-link to="/forgot-password" class="font-semibold text-sky-700 hover:text-sky-900">Forgot password?</router-link>
        </p>

        <p class="text-center text-sm text-slate-600">
          Don't have an account?
          <router-link to="/signup" class="font-semibold text-sky-700 hover:text-sky-900">Sign up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { validateEmail, validatePassword } from '@/lib/validation'

export default {
  data() {
    return {
      email: '',
      password: '',
      localError: ''
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
      this.localError = ''
      const { email, password } = this
      const emailError = validateEmail(email)
      if (emailError) {
        this.localError = emailError
        return
      }
      const passwordError = validatePassword(password)
      if (passwordError) {
        this.localError = passwordError
        return
      }
      const result = await this.$store.dispatch('auth/login', { email, password })
      if (result.success) {
        const redirect = this.$route.query.redirect || '/dashboard'
        this.$router.push(redirect)
      }
    }
  }
}
</script>
