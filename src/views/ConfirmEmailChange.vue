<template>
  <section class="mx-auto flex min-h-[72vh] max-w-xl items-center px-4 py-8">
    <div class="section-shell w-full space-y-4 p-6">
      <h1 class="text-2xl font-bold text-slate-900">Confirm Email Change</h1>
      <p class="text-sm text-slate-600">
        Click confirm to update your account email with the verification token.
      </p>

      <button
        class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
        :disabled="loading || !token"
        @click="confirmEmailChange"
      >
        {{ loading ? "Confirming..." : "Confirm Email Change" }}
      </button>

      <p v-if="message" class="text-sm text-emerald-600">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <router-link to="/dashboard/settings" class="inline-block text-sm font-semibold text-sky-700 hover:text-sky-900">
        Back to settings
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

const loading = ref(false);
const message = ref("");
const error = ref("");

const token = computed(() => String(route.query.token || ""));

const confirmEmailChange = async () => {
  error.value = "";
  message.value = "";

  if (!token.value) {
    error.value = "Missing email-change token.";
    return;
  }

  loading.value = true;
  try {
    const result = await store.dispatch("auth/confirmEmailChange", token.value);
    if (result.success) {
      message.value = result.data?.message || "Email changed successfully.";
    } else {
      error.value = result.error || "Could not confirm email change.";
    }
  } finally {
    loading.value = false;
  }
};
</script>
