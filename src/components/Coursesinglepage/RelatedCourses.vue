<template>
  <section v-if="relatedCourses.length" class="py-12 md:py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Related Courses
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          You might also like these courses
        </p>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RelatedCourseCard
          v-for="course in relatedCourses"
          :key="course.id"
          :course="course"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import RelatedCourseCard from '@/components/Courses/RelatedCourseCard.vue'

export default {
  name: 'RelatedCourses',
  components: {
    RelatedCourseCard
  },
  props: {
    currentCourseId: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    ...mapState('courses', ['relatedCourses']),
    ...mapState('ui', ['loading'])
  },
  methods: {
    ...mapActions('courses', ['fetchCourseById']),
    async loadRelatedCourses() {
      try {
        await this.fetchCourseById(this.currentCourseId)
      } catch (error) {
        console.error('Error loading related courses:', error)
      }
    }
  },
  created() {
    this.loadRelatedCourses()
  },
  watch: {
    currentCourseId() {
      this.loadRelatedCourses()
    }
  }
}
</script>

<style>
.related-courses-grid .course-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-courses-grid .course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>