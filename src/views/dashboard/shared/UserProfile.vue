<template>
  <section class="mx-auto max-w-2xl space-y-6">
    <h1 class="text-2xl font-bold text-slate-900">Profile</h1>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-center gap-4">
        <img :src="avatar" alt="User avatar" class="h-16 w-16 rounded-full border border-slate-200 object-cover" />
        <div>
          <p class="font-semibold text-slate-900">{{ user?.displayName }}</p>
          <p class="text-sm text-slate-500">{{ user?.email }}</p>
        </div>
      </div>

      <form class="space-y-4" @submit.prevent="updateProfile">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Display Name</label>
          <input
            v-model="displayName"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
        >
          {{ isLoading ? 'Saving...' : 'Save Profile' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import { avatarDataUri } from '@/lib/avatar'

export default {
  data() {
    return {
      displayName: ''
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/currentUser']
    },
    isLoading() {
      return this.$store.getters['auth/isLoading']
    },
    avatar() {
      return this.user?.photoURL || this.user?.avatarUrl || avatarDataUri(this.user?.displayName || this.user?.name || 'User')
    }
  },
  created() {
    this.displayName = this.user?.displayName || ''
  },
  methods: {
    async updateProfile() {
      await this.$store.dispatch('auth/updateProfile', {
        displayName: this.displayName
      })
    }
  }
}
</script>
