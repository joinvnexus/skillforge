<template>
  <section class="px-4 py-16">
    <div class="container mx-auto max-w-7xl">
      <h2 class="mb-12 text-center text-3xl font-bold text-[var(--text)] md:text-4xl animate-slide-up">
        Explore Our <span class="text-[var(--brand-strong)]">Features</span>
      </h2>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>

      <div v-else-if="error" class="rounded-2xl border border-red-100 bg-red-50 px-4 py-8 text-center text-red-600">
        {{ error }}
      </div>

      <div v-else>
        <div class="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="feature in features"
            :key="feature.id"
            class="section-shell interactive-lift rounded-2xl border border-slate-100 bg-white p-8 text-center animate-fade-in"
          >
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

        <div class="mt-16">
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
              class="section-shell interactive-lift rounded-2xl border border-slate-100 bg-white p-6 text-center animate-fade-in"
            >
              <div class="mb-6 flex justify-center">
                <div
                  v-html="path.svg"
                  class="path-icon flex h-16 w-16 items-center justify-center rounded-xl shadow-inner transition-transform duration-300 hover:scale-105"
                ></div>
              </div>
              <h4 class="mb-2 text-lg font-semibold text-[var(--text)]">{{ path.title }}</h4>
              <p class="mb-4 text-[var(--muted)]">{{ path.description }}</p>
              <router-link
                :to="path.link"
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
    }
  }
};
</script>

<style>
.animate-slide-up {
  animation: slideUp 1s ease-out forwards;
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
