<template>
  <div class="course-curriculum space-y-4">
    <div>
      <h2 class="text-2xl font-bold text-[var(--text)] md:text-3xl">Course Curriculum</h2>
      <p class="text-[var(--muted)]">{{ lessons }} lessons • {{ duration }}</p>
    </div>

    <div class="accordion overflow-hidden rounded-lg border border-[var(--line)] shadow-sm">
      <div v-for="(section, index) in sections" :key="index" class="accordion-item border-b border-[var(--line)] last:border-b-0">
        <button
          class="accordion-header flex w-full flex-col items-start justify-between gap-2 px-4 py-4 text-left transition-colors duration-200 sm:flex-row sm:items-center md:px-6 md:py-5"
          :class="activeSection === index ? 'bg-[var(--brand)] text-white' : 'bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--bg-alt)]'"
          @click="toggleSection(index)"
        >
          <div class="section-title flex items-center gap-3">
            <i
              class="fas text-sm transition-transform duration-300"
              :class="{
                'fa-minus text-white': activeSection === index,
                'fa-plus text-[var(--muted)]': activeSection !== index
              }"
            ></i>
            <span class="font-medium">{{ section.title }}</span>
          </div>
          <div class="section-meta text-sm" :class="activeSection === index ? 'text-white/85' : 'text-[var(--muted)]'">
            {{ section.lessons.length }} lessons • {{ section.duration }}
          </div>
        </button>

        <div
          class="accordion-content overflow-hidden bg-[var(--surface)] transition-all duration-300 ease-in-out"
          :class="{
            'max-h-0': activeSection !== index,
            'max-h-[1000px]': activeSection === index
          }"
        >
          <ul class="space-y-3 px-4 py-2 md:px-6 md:py-3">
            <li
              v-for="(lesson, lessonIndex) in section.lessons"
              :key="lessonIndex"
              class="lesson flex items-center gap-4 rounded border-b border-[var(--line)] px-2 py-3 transition-colors duration-150 last:border-b-0 hover:bg-[var(--surface-soft)]"
            >
              <i
                class="far flex-shrink-0 text-lg"
                :class="{
                  'fa-play-circle text-[var(--brand)]': lesson.type === 'video',
                  'fa-file-alt text-emerald-600': lesson.type !== 'video'
                }"
              ></i>
              <span class="flex-1 text-[var(--text)]">{{ lesson.title }}</span>
              <span class="duration text-sm text-[var(--muted)]">{{ lesson.duration }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CourseCurriculum",
  props: {
    lessons: {
      type: [Number, String],
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    sections: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeSection: 0
    };
  },
  methods: {
    toggleSection(index) {
      this.activeSection = this.activeSection === index ? null : index;
    }
  }
};
</script>

<style scoped>
.accordion-content {
  transition: max-height 0.3s ease-in-out;
}
</style>
