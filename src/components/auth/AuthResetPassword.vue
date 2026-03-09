<template>
  <div class="flex min-h-[72vh] items-center justify-center px-4 py-8">
    <div class="section-shell glass-surface interactive-lift w-full max-w-md p-8">
      <div class="mb-6 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Recovery</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">Set New Password</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            placeholder="********"
            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="********"
            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <button type="submit" :disabled="isLoading || !token" class="btn-brand w-full rounded-xl px-4 py-2.5 text-sm disabled:opacity-70">
          {{ isLoading ? 'Resetting...' : 'Reset Password' }}
        </button>

        <p v-if="localError" class="text-center text-sm text-red-600">{{ localError }}</p>
        <p v-if="message" class="text-center text-sm text-emerald-600">{{ message }}</p>

        <p class="text-center text-sm text-slate-600">
          <router-link to="/login" class="font-semibold text-sky-700 hover:text-sky-900">Back to login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { validatePassword } from '@/lib/validation'

export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      message: '',
      localError: ''
    }
  },
  computed: {
    token() {
      return this.$route.query.token || ''
    },
    isLoading() {
      return this.$store.getters['auth/isLoading']
    }
  },
  methods: {
    async handleSubmit() {
      this.localError = ''
      this.message = ''

      if (!this.token) {
        this.localError = 'Missing reset token.'
        return
      }

      const passwordError = validatePassword(this.newPassword)
      if (passwordError) {
        this.localError = passwordError
        return
      }

      if (this.newPassword !== this.confirmPassword) {
        this.localError = 'Passwords do not match.'
        return
      }

      const result = await this.$store.dispatch('auth/resetPassword', {
        token: this.token,
        newPassword: this.newPassword
      })

      if (result.success) {
        this.message = 'Password updated successfully. Redirecting to login...'
        setTimeout(() => {
          this.$router.push('/login')
        }, 1200)
      } else {
        this.localError = result.error || 'Unable to reset password.'
      }
    }
  }
}
</script>
