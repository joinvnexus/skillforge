<template>
  <section v-if="relatedCourses.length" class="bg-[var(--surface-soft)] py-12 md:py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <h2 class="mb-2 text-3xl font-bold text-[var(--text)] md:text-4xl">Related Courses</h2>
        <p class="mx-auto max-w-2xl text-lg text-[var(--muted)]">You might also like these courses</p>
      </div>

      <div v-if="loading" class="py-8 text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-[var(--brand)]"></div>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RelatedCourseCard v-for="course in relatedCourses" :key="course.id" :course="course" />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import RelatedCourseCard from "@/components/Courses/RelatedCourseCard.vue";

export default {
  name: "RelatedCourses",
  components: { RelatedCourseCard },
  props: {
    currentCourseId: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    ...mapState("courses", ["relatedCourses"]),
    ...mapState("ui", ["loading"])
  }
};
</script>
