<template>
  <section class="py-16 px-4 bg-blue-500 text-white text-center flex justify-center items-center flex-col">
    <div class="max-w-3xl w-full text-center space-y-6">
      <!-- Title -->
      <h2 class="text-4xl md:text-3xl sm:text-2xl font-bold text-white mb-4">
        Ready to Start Learning?
      </h2>

      <!-- Description -->
      <p class="text-lg md:text-base text-blue-100 leading-relaxed mb-6">
        Take the next step towards mastering Vue.js. Explore our courses and get started on your learning journey today!
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-wrap justify-center gap-4">
        <router-link
          to="/courses"
          class="bg-white text-blue-500 hover:bg-gray-100 font-semibold text-lg px-6 py-3 rounded-md shadow transition-transform transform hover:-translate-y-1"
        >
          Browse Courses
        </router-link>
        <button
          class="bg-yellow-500 hover:bg-yellow-430 text-white font-semibold text-lg px-6 py-3 rounded-md shadow transition-transform transform hover:-translate-y-1"
          @click="signUpNow"
        >
          Sign Up Now
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "CTASection",
  methods: {
    signUpNow() {
      alert("Sign Up Now clicked!");
      // Implement actual sign up flow
    }
  }
};
</script>
