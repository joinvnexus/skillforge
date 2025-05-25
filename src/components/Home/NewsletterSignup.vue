<template>
  <section class="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <!-- Title and Description -->
      <div class="text-center mb-8" data-aos="fade-up">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Stay Updated
        </h2>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest updates, tutorials, and exclusive offers.
        </p>
      </div>

      <!-- Signup Form -->
      <form 
        @submit.prevent="subscribe"
        class="max-w-md mx-auto"
        data-aos="fade-up" data-aos-delay="100"
      >
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Email Input -->
          <div class="relative flex-grow">
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email"
              required
              class="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
              :class="{'border-green-500': isSuccess, 'border-red-500': isError}"
            >
            <svg 
              v-if="isSuccess"
              class="absolute right-3 top-3.5 h-5 w-5 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Subscribe</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          </button>
        </div>

        <!-- Messages -->
        <div class="mt-3 text-center">
          <p v-if="isSuccess" class="text-green-600 font-medium">
            Thank you for subscribing! Check your email for confirmation.
          </p>
          <p v-if="isError" class="text-red-600 font-medium">
            {{ errorMessage }}
          </p>
        </div>
      </form>

      <!-- Privacy Note -->
      <p class="mt-8 text-center text-sm text-gray-500 max-w-lg mx-auto">
        We respect your privacy. Unsubscribe at any time.
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Validate email
        if (!this.validateEmail(this.email)) {
          throw new Error("Please enter a valid email address");
        }

        // Success state
        this.isSuccess = true;
        this.email = "";
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          this.isSuccess = false;
        }, 5000);
      } catch (error) {
        this.isError = true;
        this.errorMessage = error.message || "Subscription failed. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }
};
</script>

<style scoped>
/* Animation for form elements */
[data-aos] {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
[data-aos="fade-up"] {
  transform: translateY(20px);
  opacity: 0;
}
[data-aos].aos-animate {
  transform: translateY(0);
  opacity: 1;
}

/* Custom animation for spin */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>