<template>
  <article class="admin-card p-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Profile & Account</h3>
        <p class="text-xs text-slate-500">Update instructor profile and account preferences.</p>
      </div>
      <button class="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('save', form)">
        Save Changes
      </button>
    </div>

    <div class="mt-5 grid gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 p-4">
        <h4 class="text-xs font-semibold text-slate-600">Profile Details</h4>
        <div class="mt-3 grid gap-3">
          <div>
            <label class="text-xs font-semibold text-slate-600">Title</label>
            <input v-model="form.title" type="text" placeholder="Senior Frontend Instructor" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">Bio</label>
            <textarea v-model="form.bio" rows="3" placeholder="Short instructor bio" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">Expertise (comma separated)</label>
            <input v-model="form.expertise" type="text" placeholder="React, UI Design, Vue" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">Photo URL</label>
            <input v-model="form.photoUrl" type="text" placeholder="https://..." class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 p-4">
        <h4 class="text-xs font-semibold text-slate-600">Social Links</h4>
        <div class="mt-3 grid gap-3">
          <input v-model="form.websiteUrl" type="text" placeholder="Website URL" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="form.linkedinUrl" type="text" placeholder="LinkedIn URL" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="form.twitterUrl" type="text" placeholder="Twitter URL" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="form.githubUrl" type="text" placeholder="GitHub URL" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="form.youtubeUrl" type="text" placeholder="YouTube URL" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
      </div>
    </div>

    <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 class="text-xs font-semibold text-slate-600">Account Security</h4>
      <p class="mt-2 text-sm text-slate-600">
        Password updates and two-factor settings will appear here once account endpoints are enabled.
      </p>
    </div>

    <div class="mt-5 grid gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 p-4">
        <h4 class="text-xs font-semibold text-slate-600">Display Name</h4>
        <p class="mt-1 text-xs text-slate-500">Update the name shown on your public profile.</p>
        <div class="mt-3">
          <input v-model="account.displayName" type="text" placeholder="Display name" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <button class="mt-3 rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800" @click="$emit('update-display-name', account.displayName)">
            Update Name
          </button>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 p-4">
        <h4 class="text-xs font-semibold text-slate-600">Change Email</h4>
        <p class="mt-1 text-xs text-slate-500">
          For security, confirm your current password before requesting an email change.
        </p>
        <div class="mt-3 grid gap-2">
          <input v-model="account.newEmail" type="email" placeholder="New Email" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="account.currentPassword" type="password" placeholder="Current Password" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <button
            class="rounded border border-slate-900 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
            @click="$emit('request-email-change', { email: account.newEmail, currentPassword: account.currentPassword })"
          >
            Request Email Change
          </button>
        </div>
      </div>
    </div>

    <div class="mt-5 flex justify-end">
      <button class="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100" @click="$emit('logout')">
        Logout
      </button>
    </div>
  </article>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  profile: { type: Object, required: true },
  accountInfo: { type: Object, required: true }
});

defineEmits(["save", "update-display-name", "request-email-change", "logout"]);

const form = reactive({
  title: "",
  bio: "",
  photoUrl: "",
  expertise: "",
  websiteUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  githubUrl: "",
  youtubeUrl: ""
});

const account = reactive({
  displayName: "",
  newEmail: "",
  currentPassword: ""
});

watch(
  () => props.profile,
  (value) => {
    Object.assign(form, value || {});
  },
  { immediate: true }
);

watch(
  () => props.accountInfo,
  (value) => {
    account.displayName = value?.displayName || "";
  },
  { immediate: true }
);
</script>
