<template>
  <div class="course-detail min-h-screen">
    <!-- Loading State -->
    <div v-if="loading" class="loading-spinner flex items-center justify-center min-h-[300px]">
      <LoadingSpinner />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-message flex items-center justify-center min-h-[300px]">
      <ErrorMessage :error="error" />
    </div>
    
    <!-- Course Content -->
    <template v-else-if="course">
      <!-- Hero Section -->
      <CourseHero 
        :course="course"
        @enroll="handleEnroll"
      />
      
      <!-- Main Content -->
      <div class="course-content py-10 md:py-14">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left Column - Main Content -->
            <div class="w-full lg:w-8/12">
              <div class="section-shell p-4 sm:p-6">
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
                  :reviews="course.reviewCount || course.reviews?.length || 0"
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
            </div>
            
            <!-- Right Column - Sidebar -->
            <div class="w-full lg:w-4/12">
              <div class="sticky top-24 space-y-6">
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
      <div class="pb-16">
           <RelatedCourses :current-course-id="currentCourse.slug || currentCourse.id" />
      </div>
    </template>
    
    <div v-else class="flex min-h-[300px] items-center justify-center">
      <p class="text-sm text-[var(--muted)]">Course data not found. Please try again from the course list.</p>
    </div>
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
    ...mapState('ui', ['loading', 'error']),
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
    ...mapActions('courses', ['fetchCourseById']),
    ...mapActions('enrollments', ['enrollInCourse', 'checkEnrollment']),
    async loadCourse(identifier) {
      if (!identifier) return
      this.activeTab = 'overview'
      try {
        await this.fetchCourseById(identifier)
      } catch (_error) {
        if (this.$route.name === 'CourseDetail') {
          this.$router.replace('/courses')
        }
      }
    },
    changeTab(tab) {
      this.activeTab = tab
    },
    async handleEnroll() {
      const user = this.$store.state.auth.user
      
      if (!user) {
        // Redirect to login if not authenticated
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } })
        return
      }
      
      try {
        this.$store.commit('ui/SET_LOADING', true)
        
        // Check if already enrolled
        const isEnrolled = await this.checkEnrollment({ 
          userId: user.id, 
          courseId: this.course.id 
        })
        
        if (isEnrolled) {
          alert('You are already enrolled in this course!')
          return
        }
        
        // Enroll in the course
        await this.enrollInCourse({
          userId: user.id,
          courseId: this.course.id,
          courseData: this.course
        })
        
        alert('Successfully enrolled! You can now access this course from your dashboard.')
        this.$router.push('/dashboard/my-courses')
      } catch (error) {
        alert('Error enrolling in course: ' + error.message)
      } finally {
        this.$store.commit('ui/SET_LOADING', false)
      }
    }
  },
  created() {
    const identifier = this.$route.params.id
    this.loadCourse(identifier)
  },
  watch: {
    '$route.params.id'(identifier) {
      this.loadCourse(identifier)
    }
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
