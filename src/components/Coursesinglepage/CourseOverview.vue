<template>
  <div class="course-overview space-y-8 md:space-y-10">
    <div>
      <h2 class="mb-4 text-2xl font-bold text-[var(--text)] md:mb-6 md:text-3xl">About This Course</h2>
      <p class="text-lg leading-relaxed text-[var(--muted)]">{{ description }}</p>
    </div>

    <div class="what-you-learn">
      <h3 class="mb-4 text-xl font-bold text-[var(--text)] md:mb-6 md:text-2xl">What You'll Learn</h3>
      <ul class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mb-10 md:gap-6">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="flex items-start gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-[var(--bg-alt)]"
        >
          <i class="fas fa-check mt-1 flex-shrink-0 text-[var(--brand)]"></i>
          <span class="text-[var(--muted)]">{{ feature }}</span>
        </li>
      </ul>
    </div>

    <div class="course-features grid grid-cols-1 gap-6 border-b border-t border-[var(--line)] py-8 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <div
        v-for="(feature, index) in courseFeatures"
        :key="index"
        class="feature flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-[var(--surface-soft)]"
      >
        <div class="rounded-lg bg-[var(--bg-alt)] p-3 text-[var(--brand)]">
          <i :class="feature.icon" class="text-xl"></i>
        </div>
        <div>
          <h4 class="mb-1 text-sm font-medium uppercase tracking-wider text-[var(--muted)]">{{ feature.title }}</h4>
          <p class="text-lg font-semibold text-[var(--text)]">{{ feature.value || "N/A" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CourseOverview",
  props: {
    description: { type: String, required: true },
    features: { type: Array, default: () => [] },
    duration: { type: String, default: "" },
    lessons: { type: [Number, String], default: "" },
    level: { type: String, default: "" }
  },
  computed: {
    courseFeatures() {
      return [
        { icon: "fas fa-film", title: "Duration", value: this.duration },
        { icon: "fas fa-book", title: "Lessons", value: this.lessons },
        { icon: "fas fa-signal", title: "Level", value: this.level }
      ];
    }
  }
};
</script>

<style scoped>
.feature {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature:hover {
  transform: translateY(-2px);
}
</style>
