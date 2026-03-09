<template>
  <section class="px-4 py-16">
    <div class="container mx-auto max-w-7xl">
      <h2 class="mb-12 text-center text-3xl font-bold text-slate-900 md:text-4xl animate-slide-up">
        Explore Our <span class="text-blue-600">Features</span>
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
                class="flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-600 shadow-inner transition-all duration-300 hover:scale-105 hover:shadow-md"
              ></div>
            </div>
            <h3 class="mb-3 text-xl font-semibold text-slate-900">{{ feature.title }}</h3>
            <p class="text-slate-600">{{ feature.description }}</p>
          </article>
        </div>

        <div class="mt-16">
          <div class="mb-12 text-center animate-slide-up">
            <h3 class="mb-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Structured <span class="text-blue-600">Learning Paths</span>
            </h3>
            <p class="mx-auto max-w-2xl text-lg text-slate-600">
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
                  class="flex h-16 w-16 items-center justify-center rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-600 shadow-inner transition-transform duration-300 hover:scale-105"
                ></div>
              </div>
              <h4 class="mb-2 text-lg font-semibold text-slate-900">{{ path.title }}</h4>
              <p class="mb-4 text-slate-600">{{ path.description }}</p>
              <router-link
                :to="path.link"
                class="inline-flex items-center gap-1 rounded-full border border-indigo-200 px-6 py-2 font-medium text-blue-600 transition-colors duration-300 hover:bg-indigo-50 hover:text-blue-700"
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
