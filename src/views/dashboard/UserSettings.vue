<template>
  <section class="max-w-xl space-y-6">
    <h1 class="text-2xl font-bold text-slate-900">Account Settings</h1>
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm text-slate-600">
        Security settings like password reset and email change are backend roadmap items.
      </p>
      <button
        @click="logout"
        class="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Logout
      </button>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

const logout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}
</script>
