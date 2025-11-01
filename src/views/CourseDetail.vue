<template>
  <div class="course-detail bg-gray-50 min-h-screen">
    <!-- Loading State -->
    <div v-if="loading" class="loading-spinner flex items-center justify-center min-h-[300px]">
      <LoadingSpinner />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-message flex items-center justify-center min-h-[300px]">
      <ErrorMessage :message="error" />
    </div>
    
    <!-- Course Content -->
    <template v-else-if="course">
      <!-- Hero Section -->
      <CourseHero 
        :course="course"
        :description="course.description"
        
        @enroll="handleEnroll"
      />
      
      <!-- Main Content -->
      <div class="course-content py-10 md:py-16">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left Column - Main Content -->
            <div class="w-full lg:w-8/12">
              <CourseTabs 
                :course="course"
                :activeTab="activeTab"
                @tab-change="changeTab"
              />
              
              <div class="tab-content py-8">
                <!-- Overview Tab -->
                <CourseOverview 
                  v-if="activeTab === 'overview'"
                  :description="course.fullDescription"
                  :features="course.features"
                  :duration="course.duration"
                  :lessons="course.lessons"
                  :level="course.level"
                />
                
                <!-- Curriculum Tab -->
                <CourseCurriculum 
                  v-if="activeTab === 'curriculum'"
                  :lessons="course.lessons"
                  :duration="course.duration"
                  :sections="course.sections"
                />
                
                <!-- Instructor Tab -->
                <CourseInstructor 
                  v-if="activeTab === 'instructor'"
                  :instructor="course.instructor"
                  :otherCourses="instructorCourses"
                  :students="course.students"
                  :coursesCount="instructorCourses.length + 1"
                  :reviews="course.reviews"
                  :bio="course.instructorBio"
                />
                
                <!-- Reviews Tab -->
                <CourseReviews 
                  v-if="activeTab === 'reviews'"
                  :rating="course.rating"
                  :reviews="course.reviews"
                />
              </div>
            </div>
            
            <!-- Right Column - Sidebar -->
            <div class="w-full lg:w-4/12">
              <div class="sticky top-6 space-y-6">
                <CourseSidebar 
                  :course="course"
                  @enroll="handleEnroll"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Related Courses -->
      <div class="pb-16 bg-white">
           <RelatedCourses :current-course-id="currentCourse.id" />

      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LoadingSpinner from '@/components/UI/LoadingSpinner.vue'
import ErrorMessage from '@/components/UI/ErrorState.vue'
import CourseHero from '@/components/Coursesinglepage/CourseHero.vue'
import CourseTabs from '@/components/Coursesinglepage/CourseTabs.vue'
import CourseOverview from '@/components/Coursesinglepage/CourseOverview.vue'
import CourseCurriculum from '@/components/Coursesinglepage/CourseCurriculum.vue'
import CourseInstructor from '@/components/Coursesinglepage/CourseInstructor.vue'
import CourseReviews from '@/components/Coursesinglepage/CourseReviews.vue'
import CourseSidebar from '@/components/Coursesinglepage/CourseSidebar.vue'
import RelatedCourses from '@/components/Coursesinglepage/RelatedCourses.vue'

export default {
  name: 'CourseDetail',
  components: {
    LoadingSpinner,
    ErrorMessage,
    CourseHero,
    CourseTabs,
    CourseOverview,
    CourseCurriculum,
    CourseInstructor,
    CourseReviews,
    CourseSidebar,
    RelatedCourses
  },
  data() {
    return {
      activeTab: 'overview'
    }
  },
  computed: {
    currentCourse() {
      return this.$store.state.courses.currentCourse
    },
    ...mapState('courses', [
      'currentCourse',
      'relatedCourses',
      'allCourses',
    ]),

    course() {
       return this.currentCourse 
    },
    instructorCourses() {
      if (!this.course || !this.allCourses.length) return []
      return this.allCourses.filter(c => 
        c.instructor === this.course.instructor && c.id !== this.course.id
      ).slice(0, 3)
    },
    instructorBio() {
      return this.course.instructorBio || 'This instructor has not provided a bio.'
    }
  },
  methods: {
    ...mapActions('courses', ['fetchCourseById', 'fetchRelatedCourses']),
    changeTab(tab) {
      this.activeTab = tab
    },
    handleEnroll() {
      // Handle enrollment logic
      console.log('Enrolling in course:', this.course.id)
    }
  },
  created() {
    const courseId = parseInt(this.$route.params.id)
    this.fetchCourseById(courseId).then(() => {
      console.log('Loaded course:', this.course)
      if (this.course) {
          //this.fetchCourseById(this.course.tags) // Fetch related courses based on tags
      }
    })
  }
}
</script>

<style scoped>
/* You can keep your custom styles here if needed, but most are replaced with Tailwind */
.course-detail {
  /* Additional styles that might not be covered by Tailwind */
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .course-content {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
</style>