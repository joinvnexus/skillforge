<template>
  <section id="hero-section" class="relative overflow-hidden px-4 py-14 sm:py-16">
    <div class="hero-shell section-shell relative mx-auto max-w-6xl rounded-3xl p-7 text-center sm:p-10 md:p-14">
      <div class="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div class="relative">
        <h1 class="mb-5 text-4xl font-bold text-[var(--text)] md:text-5xl">
          <span class="block">Education Without</span>
          <span class="hero-title-gradient">Boundaries</span>
        </h1>

        <p class="mx-auto mb-9 max-w-2xl text-lg text-[var(--muted)]">
          Access thousands of project-based courses across devices, anywhere and anytime.
        </p>

        <div class="mb-12 inline-flex flex-wrap justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-soft)] p-1.5">
          <button
            v-for="category in allCategories"
            :key="category"
            @click="filterCourses(category)"
            class="rounded-full px-5 py-2 text-sm font-medium transition"
            :class="activeCategory === category ? 'btn-brand text-white' : 'text-[var(--muted)] hover:bg-[var(--bg-alt)] hover:text-[var(--text)]'"
          >
            {{ category }}
          </button>
        </div>

        <div class="flex flex-wrap justify-center gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl font-bold text-[var(--brand-strong)]">{{ stat.value }}</div>
            <div class="text-sm text-[var(--muted)]">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "CoursesHeroSection",
  data() {
    return {
      activeCategory: "All",
      stats: [
        { value: "5K+", label: "Courses" },
        { value: "10K+", label: "Students" },
        { value: "200+", label: "Experts" }
      ]
    };
  },
  computed: {
    allCategories() {
      return ["All", ...this.$store.getters["filters/allCategories"]].slice(0, 9);
    }
  },
  methods: {
    ...mapActions("filters", ["updateSelectedCategories", "filterCourses"]),
    filterCourses(category) {
      this.activeCategory = category;
      const categories = category === "All" ? [] : [category];
      this.updateSelectedCategories(categories);
      this.$store.dispatch("filters/filterCourses");

      const courseSection = document.getElementById("course-listing");
      if (courseSection) {
        courseSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
};
</script>

<style>
.bg-grid-pattern {
  background-image: radial-gradient(circle, color-mix(in srgb, var(--line) 90%, transparent) 1px, transparent 1px);
  background-size: 18px 18px;
}

.hero-shell {
  background:
    radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 38%),
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--brand) 10%, transparent), transparent 36%),
    var(--surface);
}

.hero-title-gradient {
  color: transparent;
  background: linear-gradient(135deg, var(--brand-strong), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
