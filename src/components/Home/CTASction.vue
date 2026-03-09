<template>
  <section class="px-4 py-20">
    <div class="section-shell relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-14 text-center text-white sm:px-10">
      <div class="pointer-events-none absolute -left-16 -top-14 h-40 w-40 rounded-full bg-white/15 blur-2xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-10 h-52 w-52 rounded-full bg-cyan-200/20 blur-2xl"></div>

      <div class="relative mx-auto max-w-3xl space-y-6">
        <h2 class="text-3xl font-bold leading-tight sm:text-4xl">
          Ready to Start Learning?
        </h2>
        <p class="text-base leading-relaxed text-sky-100 sm:text-lg">
          Take the next step toward practical skill growth. Join structured tracks, real projects, and mentor-led learning in one place.
        </p>
        <div class="flex flex-wrap justify-center gap-3 pt-1">
          <router-link
            to="/courses"
            class="interactive-lift inline-flex items-center rounded-xl bg-white px-6 py-3 font-semibold text-sky-700 shadow-sm transition hover:bg-slate-100"
          >
            Browse Courses
          </router-link>
          <button
            class="interactive-lift inline-flex items-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
            @click="signUpNow"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "CTASection",
  methods: {
    signUpNow() {
      this.$router.push("/signup");
    }
  }
};
</script>
