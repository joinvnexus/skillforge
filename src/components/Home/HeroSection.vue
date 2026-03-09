<template>
  <section class="hero-wrap relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 py-20">
    <div class="absolute inset-0 bg-slate-950/55"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-900/20 to-slate-950/70"></div>

    <img
      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2070&q=80"
      alt="Coding background"
      class="absolute inset-0 h-full w-full object-cover object-center"
    />

    <div class="relative z-10 mx-auto w-full max-w-5xl text-center text-white">
      <div class="animate-fade-in">
        <h1 class="mb-6 text-4xl font-bold leading-tight md:text-6xl animate-slide-up">
          Learn Practical Skills with
          <span class="block text-[var(--accent)]">Expert Mentorship</span>
        </h1>
        <p class="mx-auto mb-10 max-w-3xl text-lg text-white/85 md:text-2xl">
          From beginner to advanced, follow a guided roadmap and ship real projects at your own pace.
        </p>

        <div class="flex flex-col justify-center gap-4 sm:flex-row">
          <router-link to="/courses" class="btn-brand inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold shadow-lg">
            Browse Courses
          </router-link>
          <router-link
            to="/signup"
            class="inline-flex items-center justify-center rounded-xl border border-white/60 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/20"
          >
            Get Started Free
          </router-link>
        </div>

        <div class="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/85">
          <div class="inline-flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-[var(--brand)]"></span>
            <span>10,000+ Happy Students</span>
          </div>
          <div class="inline-flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-[var(--accent)]"></span>
            <span>50+ Professional Courses</span>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
      <button @click="scrollToContent" class="text-white/90 hover:text-white" aria-label="Scroll to content">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: "HeroSection",
  methods: {
    scrollToContent() {
      const content = document.querySelector("#main-content");
      if (content) {
        content.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
};
</script>

<style scoped>
.hero-wrap {
  background: linear-gradient(160deg, color-mix(in srgb, var(--brand) 22%, #0f172a 78%), #0f172a);
}

.animate-fade-in {
  animation: fadeIn 1.1s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.9s ease-out forwards;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(24px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-14px) translateX(-50%);
  }
  60% {
    transform: translateY(-8px) translateX(-50%);
  }
}
</style>
