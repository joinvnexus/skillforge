<template>
  <InstructorLayout>
    <template #title>
      <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Instructor Panel</p>
      <h1 class="text-2xl font-semibold text-slate-900">Instructor Overview</h1>
    </template>
    <template #actions>
      <button class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
        New Course
      </button>
    </template>

    <section class="space-y-6">
      <DashboardState v-if="loading" type="loading" title="Loading instructor data..." />
      <DashboardState v-else-if="error" type="error" title="Instructor data failed to load" :description="error" show-retry @retry="reload" />
      <div v-else class="space-y-6">
        <div v-show="activeTab === 'overview'">
          <InstructorKpiCards :overview="overview" />
          <div class="mt-6 grid gap-5 lg:grid-cols-2">
            <InstructorRecentCourses :courses="recentCourses" />
            <InstructorCourseHealth :courses="healthCourses" />
          </div>
        </div>
        <div v-show="activeTab === 'courses'">
          <div class="mb-4 flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-900">Course Management</p>
            <button class="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800" @click="showCreate = !showCreate">
              {{ showCreate ? "Hide Form" : "Add New Course" }}
            </button>
          </div>
          <InstructorCourseCreateCard v-if="showCreate" :loading="createLoading" :error="createError" @create="handleCreateCourse" />
          <InstructorCoursesTable
            :courses="filteredCourses"
            :edits="courseEdits"
            :filters="courseFilters"
            @apply-filters="noop"
            @save-status="updateCourseStatus"
            @edit="openCourseEdit"
            @preview="openCoursePreview"
          />
          <InstructorCourseEditModal :open="isCourseEditOpen" :course="selectedCourse" @close="closeCourseEdit" @save="submitCourseEdit" />
          <InstructorCoursePreviewModal :open="isCoursePreviewOpen" :course="selectedCourse" @close="closeCoursePreview" />
        </div>
        <div v-show="activeTab === 'students'">
          <InstructorStudentsList
            v-model="selectedCourseId"
            :courses="courses"
            :enrollments="enrollments"
            :loading="enrollmentsLoading"
            @load="loadEnrollments"
            @view="openStudentDrawer"
          />
          <InstructorStudentProgressDrawer :open="isStudentDrawerOpen" :enrollment="selectedEnrollment" @close="closeStudentDrawer" />
          <div class="mt-6">
            <InstructorAnnouncementsCard />
          </div>
        </div>
        <div v-show="activeTab === 'revenue'">
          <div class="space-y-6">
            <InstructorRevenueSummary />
            <div class="grid gap-5 lg:grid-cols-2">
              <InstructorPayoutHistory />
              <InstructorBankInfoCard />
            </div>
          </div>
        </div>
        <div v-show="activeTab === 'reviews'">
          <div class="space-y-6">
            <InstructorReviewsTable @open-reply="isReplyOpen = true" />
            <InstructorQnAThreadList />
            <InstructorReplyModal :open="isReplyOpen" @close="closeReply" @submit="submitReply" />
          </div>
        </div>
        <div v-show="activeTab === 'settings'">
          <InstructorSettingsCard :profile="profile" @save="updateProfile" />
        </div>
      </div>
    </section>
  </InstructorLayout>
</template>

<script setup>
import InstructorLayout from "@/components/dashboard/instructor/InstructorLayout.vue";
import DashboardState from "@/components/dashboard/DashboardState.vue";
import InstructorKpiCards from "@/components/dashboard/instructor/InstructorKpiCards.vue";
import InstructorRecentCourses from "@/components/dashboard/instructor/InstructorRecentCourses.vue";
import InstructorCourseHealth from "@/components/dashboard/instructor/InstructorCourseHealth.vue";
import InstructorCoursesTable from "@/components/dashboard/instructor/InstructorCoursesTable.vue";
import InstructorStudentsList from "@/components/dashboard/instructor/InstructorStudentsList.vue";
import InstructorRevenueSummary from "@/components/dashboard/instructor/InstructorRevenueSummary.vue";
import InstructorReviewsTable from "@/components/dashboard/instructor/InstructorReviewsTable.vue";
import InstructorSettingsCard from "@/components/dashboard/instructor/InstructorSettingsCard.vue";
import InstructorCourseCreateCard from "@/components/dashboard/instructor/InstructorCourseCreateCard.vue";
import InstructorCourseEditModal from "@/components/dashboard/instructor/InstructorCourseEditModal.vue";
import InstructorCoursePreviewModal from "@/components/dashboard/instructor/InstructorCoursePreviewModal.vue";
import InstructorStudentProgressDrawer from "@/components/dashboard/instructor/InstructorStudentProgressDrawer.vue";
import InstructorAnnouncementsCard from "@/components/dashboard/instructor/InstructorAnnouncementsCard.vue";
import InstructorPayoutHistory from "@/components/dashboard/instructor/InstructorPayoutHistory.vue";
import InstructorBankInfoCard from "@/components/dashboard/instructor/InstructorBankInfoCard.vue";
import InstructorQnAThreadList from "@/components/dashboard/instructor/InstructorQnAThreadList.vue";
import InstructorReplyModal from "@/components/dashboard/instructor/InstructorReplyModal.vue";
import { useInstructorPanel } from "@/composables/useInstructorPanel.js";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const {
  loading,
  error,
  overview,
  courses,
  recentCourses,
  healthCourses,
  courseFilters,
  courseEdits,
  filteredCourses,
  enrollments,
  enrollmentsLoading,
  selectedCourseId,
  profile,
  reload,
  updateCourseStatus,
  loadEnrollments
  ,
  updateCourseFields,
  updateProfile,
  createCourse
} = useInstructorPanel();

const route = useRoute();
const activeTab = computed(() => String(route.query.tab || "overview"));
const noop = () => {};

const selectedCourse = ref(null);
const isCourseEditOpen = ref(false);
const isCoursePreviewOpen = ref(false);
const selectedEnrollment = ref(null);
const isStudentDrawerOpen = ref(false);
const isReplyOpen = ref(false);
const showCreate = ref(false);
const createLoading = ref(false);
const createError = ref("");

const openCourseEdit = (course) => {
  selectedCourse.value = course;
  isCourseEditOpen.value = true;
};

const closeCourseEdit = () => {
  isCourseEditOpen.value = false;
  selectedCourse.value = null;
};

const submitCourseEdit = async (fields) => {
  if (!selectedCourse.value) return;
  await updateCourseFields(selectedCourse.value.id, fields);
  closeCourseEdit();
};

const openCoursePreview = (course) => {
  selectedCourse.value = course;
  isCoursePreviewOpen.value = true;
};

const closeCoursePreview = () => {
  isCoursePreviewOpen.value = false;
  selectedCourse.value = null;
};

const openStudentDrawer = (enrollment) => {
  selectedEnrollment.value = enrollment;
  isStudentDrawerOpen.value = true;
};

const closeStudentDrawer = () => {
  isStudentDrawerOpen.value = false;
  selectedEnrollment.value = null;
};

const closeReply = () => {
  isReplyOpen.value = false;
};

const submitReply = () => {
  isReplyOpen.value = false;
};

const handleCreateCourse = async (payload) => {
  createLoading.value = true;
  createError.value = "";
  try {
    await createCourse(payload);
    showCreate.value = false;
  } catch (err) {
    createError.value = err.message || "Failed to create course.";
  } finally {
    createLoading.value = false;
  }
};

</script>
