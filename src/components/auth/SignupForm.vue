<template>
  <div class="flex min-h-[72vh] items-center justify-center px-4 py-8">
    <div class="section-shell glass-surface interactive-lift w-full max-w-md p-8">
      <div class="mb-6 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Start Journey</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">Create Account</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label for="signup-display-name" class="mb-1 block text-sm font-semibold text-slate-700">Display Name</label>
          <input
            id="signup-display-name"
            v-model="displayName"
            type="text"
            placeholder="Your name"
            autocomplete="name"
            required
            :aria-invalid="Boolean(localError || error)"
            aria-describedby="signup-form-error"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="signup-email" class="mb-1 block text-sm font-semibold text-slate-700">Email</label>
          <input
            id="signup-email"
            v-model="email"
            type="email"
            placeholder="your@email.com"
            autocomplete="email"
            required
            :aria-invalid="Boolean(localError || error)"
            aria-describedby="signup-form-error"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="signup-password" class="mb-1 block text-sm font-semibold text-slate-700">Password</label>
          <input
            id="signup-password"
            v-model="password"
            type="password"
            placeholder="********"
            autocomplete="new-password"
            required
            :aria-invalid="Boolean(localError || error)"
            aria-describedby="signup-form-error signup-password-help"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          />
          <p id="signup-password-help" class="mt-1 text-xs text-slate-500">Use at least 6 characters.</p>
        </div>

        <div>
          <label for="signup-role" class="mb-1 block text-sm font-semibold text-slate-700">Account Type</label>
          <select
            id="signup-role"
            v-model="role"
            aria-describedby="signup-role-help"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          >
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
          </select>
          <p id="signup-role-help" class="mt-1 text-xs text-slate-500">Choose how you want to use the platform.</p>
        </div>

        <button type="submit" :disabled="isLoading" class="btn-brand w-full rounded-xl px-4 py-2.5 text-sm disabled:opacity-70">
          {{ isLoading ? 'Creating...' : 'Sign Up' }}
        </button>

        <p id="signup-form-error" role="alert" aria-live="polite" v-if="localError || error" class="mt-2 text-center text-sm text-red-600">{{ localError || error }}</p>

        <p class="text-center text-sm text-slate-600">
          Already have an account?
          <router-link to="/login" class="font-semibold text-sky-700 hover:text-sky-900">Log in</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { validateEmail, validatePassword, validateRequired } from '@/lib/validation'

export default {
  data() {
    return {
      displayName: '',
      email: '',
      password: '',
      role: 'STUDENT',
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
      const { email, password, displayName, role } = this
      const nameError = validateRequired(displayName, 'Display name')
      if (nameError) {
        this.localError = nameError
        return
      }
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
      const result = await this.$store.dispatch('auth/signup', { email, password, displayName, role })
      if (result.success) {
        this.$router.push('/dashboard')
      }
    }
  }
}
</script>
