<template>
  <div class="flex min-h-[72vh] items-center justify-center px-4 py-8">
    <div class="section-shell glass-surface interactive-lift w-full max-w-md p-8">
      <div class="mb-6 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Recovery</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">Reset Password</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="btn-brand w-full rounded-xl px-4 py-2.5 text-sm disabled:opacity-70">
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>

        <p v-if="error" class="text-center text-sm text-red-600">{{ error }}</p>
        <p v-if="message" class="text-center text-sm text-emerald-600">{{ message }}</p>
        <div v-if="resetUrl" class="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
          <p class="font-semibold">Dev reset link</p>
          <router-link :to="resetPath" class="break-all font-medium text-emerald-800 underline">
            {{ resetUrl }}
          </router-link>
        </div>

        <p class="text-center text-sm text-slate-600">
          <router-link to="/login" class="font-semibold text-sky-700 hover:text-sky-900">Back to login</router-link>
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
      message: '',
      resetUrl: '',
      resetPath: ''
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
      this.resetUrl = ''
      this.resetPath = ''
      const result = await this.$store.dispatch('auth/forgotPassword', this.email)
      if (result.success) {
        this.message = result.data?.message || 'Password reset link sent. Please check your inbox.'
        if (result.data?.debug?.resetUrl) {
          this.resetUrl = result.data.debug.resetUrl
          try {
            const parsed = new URL(result.data.debug.resetUrl)
            this.resetPath = `${parsed.pathname}${parsed.search}`
          } catch (_error) {
            this.resetPath = `/reset-password?token=${encodeURIComponent(result.data.debug.resetToken || '')}`
          }
        }
      }
    }
  }
}
</script>
