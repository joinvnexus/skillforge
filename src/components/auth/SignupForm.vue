<template>
  <div class="flex min-h-[72vh] items-center justify-center px-4 py-8">
    <div class="section-shell glass-surface interactive-lift w-full max-w-md p-8">
      <div class="mb-6 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Start Journey</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">Create Account</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700">Display Name</label>
          <input
            v-model="displayName"
            type="text"
            placeholder="Your name"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          />
        </div>

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

        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700">Account Type</label>
          <select
            v-model="role"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus:border-sky-500 focus:outline-none"
          >
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
          </select>
        </div>

        <button type="submit" :disabled="isLoading" class="btn-brand w-full rounded-xl px-4 py-2.5 text-sm disabled:opacity-70">
          {{ isLoading ? 'Creating...' : 'Sign Up' }}
        </button>

        <p v-if="error" class="mt-2 text-center text-sm text-red-600">{{ error }}</p>

        <p class="text-center text-sm text-slate-600">
          Already have an account?
          <router-link to="/login" class="font-semibold text-sky-700 hover:text-sky-900">Log in</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displayName: '',
      email: '',
      password: '',
      role: 'STUDENT'
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
      const { email, password, displayName, role } = this
      const result = await this.$store.dispatch('auth/signup', { email, password, displayName, role })
      if (result.success) {
        this.$router.push('/dashboard')
      }
    }
  }
}
</script>
