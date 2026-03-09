<template>
  <section class="px-4 py-16">
    <div class="section-shell newsletter-shell mx-auto max-w-4xl rounded-3xl p-6 sm:p-10">
      <div class="mb-8 text-center">
        <h2 class="mb-3 text-3xl font-bold text-[var(--text)] md:text-4xl">Stay Updated</h2>
        <p class="mx-auto max-w-2xl text-lg text-[var(--muted)] md:text-xl">
          Subscribe for product updates, new learning paths, and practical guides.
        </p>
      </div>

      <form @submit.prevent="subscribe" class="mx-auto max-w-2xl">
        <div class="flex flex-col gap-3 sm:flex-row">
          <div class="relative flex-grow">
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email"
              required
              class="w-full rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 pr-12 text-[var(--text)] outline-0 transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
              :class="{
                'border-emerald-500': isSuccess,
                'border-red-500': isError
              }"
            />
            <svg
              v-if="isSuccess"
              class="absolute right-3 top-3.5 h-5 w-5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <button type="submit" class="btn-brand rounded-full px-6 py-3 font-semibold text-white whitespace-nowrap" :disabled="isLoading">
            <span v-if="!isLoading">Subscribe</span>
            <span v-else class="inline-flex items-center justify-center">
              <svg class="-ml-1 mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"></path>
              </svg>
              Processing...
            </span>
          </button>
        </div>

        <div class="mt-3 text-center">
          <p v-if="isSuccess" class="font-medium text-emerald-600">Thank you. Check your email for confirmation.</p>
          <p v-if="isError" class="font-medium text-red-600">{{ errorMessage }}</p>
        </div>
      </form>

      <p class="mt-8 text-center text-sm text-[var(--muted)]">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "NewsletterSignup",
  data() {
    return {
      email: "",
      isLoading: false,
      isSuccess: false,
      isError: false,
      errorMessage: ""
    };
  },
  methods: {
    async subscribe() {
      this.isLoading = true;
      this.isError = false;
      this.isSuccess = false;

      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        if (!this.validateEmail(this.email)) {
          throw new Error("Please enter a valid email address");
        }
        this.isSuccess = true;
        this.email = "";
        setTimeout(() => {
          this.isSuccess = false;
        }, 4500);
      } catch (error) {
        this.isError = true;
        this.errorMessage = error.message || "Subscription failed. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  }
};
</script>

<style scoped>
.newsletter-shell {
  background:
    radial-gradient(circle at 10% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 44%),
    radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--brand) 12%, transparent), transparent 40%),
    var(--surface);
}
</style>
