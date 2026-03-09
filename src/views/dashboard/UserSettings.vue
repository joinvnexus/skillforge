<template>
  <section class="max-w-2xl space-y-6">
    <h1 class="text-2xl font-bold text-slate-900">Account Settings</h1>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-5 flex items-center gap-4">
        <img
          v-if="displayPhotoUrl && !avatarLoadError"
          :src="displayPhotoUrl"
          alt="Profile"
          class="h-14 w-14 rounded-full border border-slate-200 object-cover"
          @error="avatarLoadError = true"
        />
        <div
          v-else
          class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white"
        >
          {{ userInitial }}
        </div>
        <div>
          <p class="font-semibold text-slate-900">{{ displayName || 'User' }}</p>
          <p class="text-sm text-slate-500">{{ userEmail }}</p>
        </div>
      </div>

      <form class="space-y-4" @submit.prevent="saveProfile">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Display Name</label>
          <input
            v-model="displayName"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="Your display name"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Profile Image URL</label>
          <input
            v-model="photoURL"
            type="url"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="https://example.com/avatar.jpg"
          />
          <p class="mt-1 text-xs text-slate-500">Leave empty to use your name initial in navbar.</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
        >
          {{ isLoading ? 'Saving...' : 'Save Settings' }}
        </button>
      </form>
    </div>

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
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

const currentUser = computed(() => store.getters['auth/currentUser'])
const userEmail = computed(() => store.getters['auth/userEmail'])
const initialName = computed(() => store.getters['auth/userDisplayName'] || '')
const initialPhoto = computed(() => store.getters['auth/userPhotoURL'] || '')
const isLoading = computed(() => store.getters['auth/isLoading'])

const displayName = ref(initialName.value)
const photoURL = ref(initialPhoto.value)
const avatarLoadError = ref(false)

const displayPhotoUrl = computed(() => photoURL.value?.trim() || '')
const userInitial = computed(() => String(displayName.value || initialName.value || 'U').charAt(0).toUpperCase())

watch(
  () => currentUser.value,
  () => {
    displayName.value = initialName.value
    photoURL.value = initialPhoto.value
    avatarLoadError.value = false
  },
  { immediate: true }
)

watch(
  () => displayPhotoUrl.value,
  () => {
    avatarLoadError.value = false
  }
)

const saveProfile = async () => {
  await store.dispatch('auth/updateProfile', {
    displayName: displayName.value?.trim() || undefined,
    photoURL: photoURL.value?.trim() || ''
  })
}

const logout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}
</script>
