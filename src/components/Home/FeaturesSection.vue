<template>
  <section class="px-4 py-18">
    <div class="container mx-auto max-w-7xl space-y-12">
      <header class="section-shell feature-header relative overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-10">
        <div class="pointer-events-none absolute -left-14 top-0 h-40 w-40 rounded-full bg-white/30 blur-2xl"></div>
        <div class="pointer-events-none absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-white/20 blur-2xl"></div>
        <h2 class="relative mb-3 text-3xl font-bold text-white md:text-4xl animate-slide-up">
          Explore Our <span class="text-white/90">Features</span>
        </h2>
        <p class="relative mx-auto max-w-2xl text-sm text-white/90 md:text-base">
          Everything is built for practical learning flow: clear structure, guided progression, and real project output.
        </p>
      </header>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[var(--brand)]"></div>
      </div>

      <div v-else-if="error" class="rounded-2xl border border-red-100 bg-red-50 px-4 py-8 text-center text-red-600">
        {{ error }}
      </div>

      <div v-else>
        <div class="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="feature in features"
            :key="feature.id"
            class="section-shell interactive-lift relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center animate-fade-in"
          >
            <div class="feature-line absolute left-0 top-0 h-1.5 w-full"></div>
            <div class="mb-6 flex justify-center">
              <div
                v-html="feature.icon"
                class="feature-icon flex h-20 w-20 items-center justify-center rounded-2xl shadow-inner transition-all duration-300 hover:scale-105 hover:shadow-md"
              ></div>
            </div>
            <h3 class="mb-3 text-xl font-semibold text-[var(--text)]">{{ feature.title }}</h3>
            <p class="text-[var(--muted)]">{{ feature.description }}</p>
          </article>
        </div>

        <div class="section-shell path-shell mt-16 rounded-3xl px-6 py-10 sm:px-10">
          <div class="mb-12 text-center animate-slide-up">
            <h3 class="mb-3 text-2xl font-bold text-[var(--text)] md:text-3xl">
              Structured <span class="text-[var(--brand-strong)]">Learning Paths</span>
            </h3>
            <p class="mx-auto max-w-2xl text-lg text-[var(--muted)]">
              Choose a path that fits your goals and keep a clear progression from beginner to advanced.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <article
              v-for="path in learningPaths"
              :key="path.id"
              class="section-shell interactive-lift rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-center animate-fade-in"
            >
              <div class="mb-6 flex justify-center">
                <div
                  v-html="path.svg"
                  class="path-icon flex h-16 w-16 items-center justify-center rounded-xl shadow-inner transition-transform duration-300 hover:scale-105"
                ></div>
              </div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{{ path.level || "Learning Path" }}</p>
              <h4 class="mb-2 text-lg font-semibold text-[var(--text)]">{{ path.title }}</h4>
              <p class="mb-4 text-[var(--muted)]">{{ path.description }}</p>
              <router-link
                :to="pathTarget(path)"
                class="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-6 py-2 font-medium text-[var(--brand-strong)] transition-colors duration-300 hover:bg-[var(--bg-alt)]"
              >
                Learn More <span aria-hidden="true">&rarr;</span>
              </router-link>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "FeaturesSection",
  computed: {
    ...mapState("features", ["features", "learningPaths", "loading", "error"]),
    isLoading() {
      return this.loading;
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions("features", ["fetchFeatures", "fetchLearningPaths"]),
    async fetchData() {
      await Promise.all([this.fetchFeatures(), this.fetchLearningPaths()]);
    },
    pathTarget(path) {
      if (path?.link) return path.link;
      const level = String(path?.level || "").toLowerCase();
      if (level === "beginner") return "/beginner";
      if (level === "intermediate") return "/intermediate";
      if (level === "advanced") return "/advanced";
      return "/courses";
    }
  }
};
</script>

<style>
.feature-header {
  background: linear-gradient(130deg, color-mix(in srgb, var(--brand) 72%, #0f172a 28%), color-mix(in srgb, var(--accent) 66%, #0f172a 34%));
}

.feature-line {
  background: linear-gradient(90deg, var(--brand), var(--accent));
}

.animate-slide-up {
  animation: slideUp 1s ease-out forwards;
}

.path-shell {
  background:
    radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 30%),
    radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--brand) 10%, transparent), transparent 30%),
    var(--surface);
}

.feature-icon {
  border: 1px solid color-mix(in srgb, var(--accent) 24%, #ffffff 76%);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--accent) 16%, #ffffff 84%),
    color-mix(in srgb, var(--brand) 10%, #ffffff 90%)
  );
  color: var(--brand-strong);
}

.path-icon {
  border: 1px solid color-mix(in srgb, var(--brand) 24%, #ffffff 76%);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--brand) 12%, #ffffff 88%),
    color-mix(in srgb, var(--accent) 10%, #ffffff 90%)
  );
  color: var(--brand-strong);
}

.animate-fade-in {
  animation: fadeIn 1.2s ease-out forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
