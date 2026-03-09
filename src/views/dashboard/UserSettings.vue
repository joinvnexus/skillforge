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
        <p v-if="profileFormError" class="text-sm text-red-600">{{ profileFormError }}</p>
      </form>
    </div>

    <div v-if="isInstructor" class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-slate-900">Instructor Profile</h2>
      <p class="mt-1 text-sm text-slate-600">Update your public instructor identity and social links.</p>

      <form class="mt-4 space-y-3" @submit.prevent="saveInstructorProfile">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            v-model="instructorForm.title"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="Senior Web Instructor"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Bio</label>
          <textarea
            v-model="instructorForm.bio"
            rows="4"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="Share your teaching journey and expertise."
          ></textarea>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Expertise (comma separated)</label>
          <input
            v-model="instructorForm.expertiseText"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="Vue.js, Node.js, Prisma"
          />
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <input
            v-model="instructorForm.websiteUrl"
            type="url"
            class="rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="Website URL"
          />
          <input
            v-model="instructorForm.linkedinUrl"
            type="url"
            class="rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="LinkedIn URL"
          />
          <input
            v-model="instructorForm.twitterUrl"
            type="url"
            class="rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="Twitter URL"
          />
          <input
            v-model="instructorForm.githubUrl"
            type="url"
            class="rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="GitHub URL"
          />
          <input
            v-model="instructorForm.youtubeUrl"
            type="url"
            class="rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="YouTube URL"
          />
        </div>

        <button
          type="submit"
          :disabled="instructorLoading"
          class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
        >
          {{ instructorLoading ? 'Saving...' : 'Save Instructor Profile' }}
        </button>
        <p v-if="instructorFormError" class="text-sm text-red-600">{{ instructorFormError }}</p>
      </form>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-slate-900">Change Email</h2>
      <p class="mt-1 text-sm text-slate-600">
        For security, confirm your current password before requesting an email change.
      </p>

      <form class="mt-4 space-y-3" @submit.prevent="requestEmailChange">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">New Email</label>
          <input
            v-model="newEmail"
            type="email"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="new-email@example.com"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Current Password</label>
          <input
            v-model="currentPassword"
            type="password"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-400 focus:outline-none"
            placeholder="********"
          />
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
        >
          {{ isLoading ? 'Requesting...' : 'Request Email Change' }}
        </button>
        <p v-if="emailFormError" class="text-sm text-red-600">{{ emailFormError }}</p>
      </form>

      <div v-if="confirmEmailPath" class="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
        <p class="font-semibold">Dev confirmation link</p>
        <router-link :to="confirmEmailPath" class="break-all font-medium underline">
          {{ confirmEmailUrl }}
        </router-link>
      </div>

      <hr class="my-5 border-slate-200" />

      <button
        @click="logout"
        class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
import { apiRequest } from '@/lib/api'
import { validateEmail, validateOptionalUrl, validatePassword, validateTrimmedLength } from '@/lib/validation'

const store = useStore()
const router = useRouter()

const currentUser = computed(() => store.getters['auth/currentUser'])
const userEmail = computed(() => store.getters['auth/userEmail'])
const initialName = computed(() => store.getters['auth/userDisplayName'] || '')
const initialPhoto = computed(() => store.getters['auth/userPhotoURL'] || '')
const role = computed(() => store.getters['auth/userRole'] || 'STUDENT')
const isInstructor = computed(() => role.value === 'INSTRUCTOR')
const isLoading = computed(() => store.getters['auth/isLoading'])

const displayName = ref(initialName.value)
const photoURL = ref(initialPhoto.value)
const avatarLoadError = ref(false)
const newEmail = ref('')
const currentPassword = ref('')
const confirmEmailUrl = ref('')
const confirmEmailPath = ref('')
const emailFormError = ref('')
const profileFormError = ref('')
const instructorLoading = ref(false)
const instructorFormError = ref('')
const instructorForm = ref({
  title: '',
  bio: '',
  expertiseText: '',
  websiteUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
  githubUrl: '',
  youtubeUrl: ''
})

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

const loadInstructorProfile = async () => {
  if (!isInstructor.value) return
  instructorLoading.value = true
  instructorFormError.value = ''
  try {
    const response = await apiRequest('/instructor/me/profile', { auth: true })
    const data = response.data || {}
    instructorForm.value = {
      title: data.title || '',
      bio: data.bio || '',
      expertiseText: Array.isArray(data.expertise) ? data.expertise.join(', ') : '',
      websiteUrl: data.websiteUrl || '',
      linkedinUrl: data.linkedinUrl || '',
      twitterUrl: data.twitterUrl || '',
      githubUrl: data.githubUrl || '',
      youtubeUrl: data.youtubeUrl || ''
    }
  } catch (error) {
    instructorFormError.value = error.message
  } finally {
    instructorLoading.value = false
  }
}

watch(
  () => isInstructor.value,
  (value) => {
    if (value) {
      loadInstructorProfile()
    }
  },
  { immediate: true }
)

const saveProfile = async () => {
  profileFormError.value = ''
  const nameError = validateTrimmedLength(displayName.value, 'Display name', { min: 2, max: 100 })
  if (nameError) {
    profileFormError.value = nameError
    return
  }
  const photoError = validateOptionalUrl(photoURL.value, 'Profile image URL')
  if (photoError) {
    profileFormError.value = photoError
    return
  }

  await store.dispatch('auth/updateProfile', {
    displayName: displayName.value?.trim() || undefined,
    photoURL: photoURL.value?.trim() || ''
  })
}

const requestEmailChange = async () => {
  emailFormError.value = ''
  confirmEmailUrl.value = ''
  confirmEmailPath.value = ''
  const emailError = validateEmail(newEmail.value, 'New email')
  if (emailError) {
    emailFormError.value = emailError
    return
  }
  const passwordError = validatePassword(currentPassword.value, 'Current password')
  if (passwordError) {
    emailFormError.value = passwordError
    return
  }
  const result = await store.dispatch('auth/updateEmail', {
    email: newEmail.value?.trim(),
    currentPassword: currentPassword.value
  })
  if (result.success) {
    currentPassword.value = ''
    if (result.data?.debug?.confirmUrl) {
      confirmEmailUrl.value = result.data.debug.confirmUrl
      try {
        const parsed = new URL(result.data.debug.confirmUrl)
        confirmEmailPath.value = `${parsed.pathname}${parsed.search}`
      } catch (_error) {
        confirmEmailPath.value = `/confirm-email-change?token=${encodeURIComponent(result.data.debug.token || '')}`
      }
    }
  }
}

const saveInstructorProfile = async () => {
  instructorFormError.value = ''
  const titleError = validateTrimmedLength(instructorForm.value.title, 'Title', { min: 2, max: 120 })
  if (titleError) {
    instructorFormError.value = titleError
    return
  }
  const bioError = validateTrimmedLength(instructorForm.value.bio, 'Bio', { min: 10, max: 3000 })
  if (bioError) {
    instructorFormError.value = bioError
    return
  }

  const urlChecks = [
    ['Website URL', instructorForm.value.websiteUrl],
    ['LinkedIn URL', instructorForm.value.linkedinUrl],
    ['Twitter URL', instructorForm.value.twitterUrl],
    ['GitHub URL', instructorForm.value.githubUrl],
    ['YouTube URL', instructorForm.value.youtubeUrl]
  ]

  for (const [label, value] of urlChecks) {
    const err = validateOptionalUrl(value, label)
    if (err) {
      instructorFormError.value = err
      return
    }
  }

  instructorLoading.value = true
  try {
    const expertise = instructorForm.value.expertiseText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    await apiRequest('/instructor/me/profile', {
      method: 'PATCH',
      auth: true,
      body: {
        title: instructorForm.value.title.trim(),
        bio: instructorForm.value.bio.trim(),
        expertise,
        websiteUrl: instructorForm.value.websiteUrl?.trim() || null,
        linkedinUrl: instructorForm.value.linkedinUrl?.trim() || null,
        twitterUrl: instructorForm.value.twitterUrl?.trim() || null,
        githubUrl: instructorForm.value.githubUrl?.trim() || null,
        youtubeUrl: instructorForm.value.youtubeUrl?.trim() || null
      }
    })
  } catch (error) {
    instructorFormError.value = error.message
  } finally {
    instructorLoading.value = false
  }
}

const logout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}
</script>
