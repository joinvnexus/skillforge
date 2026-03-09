<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div v-if="isBusy" class="py-10">
      <LoadingSpinner size="large" />
    </div>

    <div v-else-if="error && !path" class="section-shell mx-auto max-w-3xl p-8 text-center">
      <p class="text-lg font-semibold text-red-700">Learning path load failed</p>
      <p class="mt-2 text-sm text-red-600">{{ error }}</p>
      <button class="btn-brand mt-5 rounded-xl px-5 py-2.5 text-sm" @click="loadPath">
        Try Again
      </button>
    </div>

    <div v-else-if="path" class="space-y-10">
      <section class="section-shell path-hero relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10">
        <div class="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/35 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-white/25 blur-3xl"></div>

        <div class="relative grid items-center gap-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="space-y-4">
            <span class="inline-flex items-center rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {{ levelLabel }}
            </span>
            <h1 class="text-3xl font-bold leading-tight text-white md:text-4xl">{{ path.title }}</h1>
            <p class="max-w-2xl text-white/90">{{ path.description }}</p>
            <div class="flex flex-wrap gap-3 pt-2 text-sm text-white/95">
              <span class="rounded-full bg-white/15 px-3 py-1">{{ path.courses }} Courses</span>
              <span class="rounded-full bg-white/15 px-3 py-1">{{ path.duration }}</span>
              <span class="rounded-full bg-white/15 px-3 py-1">{{ path.level || levelLabel }}</span>
            </div>
          </div>
          <img v-if="path.image || path.icon" :src="path.image || path.icon" :alt="path.title" class="h-56 w-full rounded-2xl object-cover shadow-xl" />
        </div>
      </section>

      <section class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <aside class="space-y-6">
          <div class="section-shell rounded-2xl p-6">
            <h2 class="mb-4 text-xl font-bold text-[var(--text)]">What You'll Learn</h2>
            <ul v-if="path.features?.length" class="space-y-3">
              <li v-for="(feature, index) in path.features" :key="index" class="flex items-start gap-2 text-sm text-[var(--muted)]">
                <span class="mt-1 h-2 w-2 rounded-full bg-[var(--brand)]"></span>
                <span>{{ feature }}</span>
              </li>
            </ul>
            <p v-else class="text-sm text-[var(--muted)]">Feature details will appear here when available.</p>
          </div>

          <div class="section-shell rounded-2xl p-6">
            <h2 class="mb-4 text-xl font-bold text-[var(--text)]">Skills</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in path.skills || []" :key="skill" class="rounded-full bg-[var(--bg-alt)] px-3 py-1 text-xs font-semibold text-[var(--brand-strong)]">
                {{ skill }}
              </span>
              <span v-if="!path.skills?.length" class="text-sm text-[var(--muted)]">No skills listed yet.</span>
            </div>
          </div>
        </aside>

        <div class="space-y-6">
          <div class="section-shell rounded-2xl p-6">
            <h2 class="mb-5 text-xl font-bold text-[var(--text)]">Curriculum</h2>
            <div v-if="path.curriculum?.length" class="space-y-5">
              <article v-for="module in path.curriculum" :key="module.id || module.module" class="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <h3 class="text-base font-semibold text-[var(--text)]">{{ module.title }}</h3>
                <ul v-if="module.lessons?.length" class="mt-3 space-y-2">
                  <li v-for="lesson in module.lessons" :key="lesson.id || lesson.title" class="flex items-center justify-between text-sm text-[var(--muted)]">
                    <span class="truncate pr-2">{{ lesson.title }}</span>
                    <span class="text-xs">{{ lesson.duration || 'N/A' }}</span>
                  </li>
                </ul>
                <p v-else class="mt-2 text-sm text-[var(--muted)]">No lessons added in this module yet.</p>
              </article>
            </div>
            <p v-else class="text-sm text-[var(--muted)]">Curriculum data is not available yet.</p>
          </div>

          <div v-if="path.projects?.length" class="section-shell rounded-2xl p-6">
            <h2 class="mb-5 text-xl font-bold text-[var(--text)]">Projects</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <article v-for="project in path.projects" :key="project.id || project.title" class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
                <h3 class="font-semibold text-[var(--text)]">{{ project.title }}</h3>
                <p class="mt-1 text-sm text-[var(--muted)]">{{ project.description }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="section-shell rounded-2xl p-8 text-center">
        <h3 class="text-2xl font-bold text-[var(--text)]">Ready to start this path?</h3>
        <p class="mt-2 text-sm text-[var(--muted)]">Get full access to all lessons and guided projects.</p>
        <router-link to="/signup" class="btn-brand mt-5 inline-flex rounded-xl px-7 py-3 text-sm font-semibold text-white">
          {{ ctaText }}
        </router-link>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import LoadingSpinner from "@/components/UI/LoadingSpinner.vue";

export default {
  name: "DynamicPathPage",
  components: { LoadingSpinner },
  props: {
    slug: {
      type: String,
      required: true
    },
    levelLabel: {
      type: String,
      default: "Learning Path"
    },
    ctaText: {
      type: String,
      default: "Start Learning Now"
    }
  },
  computed: {
    ...mapState("learningPaths", {
      currentPath: (state) => state.currentPath,
      isLoading: (state) => state.isLoading,
      error: (state) => state.error
    }),
    path() {
      return this.currentPath;
    },
    isBusy() {
      return this.isLoading && !this.path;
    }
  },
  created() {
    this.loadPath();
  },
  watch: {
    slug() {
      this.loadPath();
    }
  },
  methods: {
    ...mapActions("learningPaths", ["fetchPathBySlug"]),
    async loadPath() {
      try {
        await this.fetchPathBySlug(this.slug);
      } catch (_error) {
        // Store already exposes error state; keep UI responsive without throwing.
      }
    }
  }
};
</script>

<style scoped>
.path-hero {
  background: linear-gradient(140deg, color-mix(in srgb, var(--brand) 75%, #0f172a 25%), color-mix(in srgb, var(--accent) 65%, #0f172a 35%));
}
</style>
