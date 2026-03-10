<template>
  <AdminLayout>
    <template #title>
      <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Panel</p>
      <h1 class="text-xl font-semibold text-slate-900">Admin Control Panel</h1>
    </template>
    <template #actions>
      <button class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" @click="reload">
        Refresh
      </button>
    </template>

    <section class="space-y-6">
      <DashboardState v-if="loading" type="loading" title="Loading admin data..." />
      <DashboardState v-else-if="error" type="error" title="Admin data failed to load" :description="error" show-retry @retry="reload" />

      <div v-else class="grid gap-5 lg:grid-cols-2">
        <AdminOverviewCard
          v-show="activeTab === 'overview'"
          :users-total="usersMeta.total"
          :orders-total="ordersMeta.total"
          :paths-total="learningPathsMeta.total"
          :blogs-total="blogsMeta.total"
        />
        <AdminUsersCard
          id="users"
          class="scroll-mt-24"
          v-show="activeTab === 'users'"
          :users="users"
          :edits="userEdits"
          :meta="usersMeta"
          :filters="userFilters"
          @apply-filters="applyUserFilters"
          @change-page="changeUsersPage"
          @save-user="updateUser"
        />

        <AdminTestimonialsCard
          id="testimonials"
          class="scroll-mt-24"
          v-show="activeTab === 'testimonials'"
          :testimonials="testimonials"
          :meta="testimonialsMeta"
          :filters="testimonialFilters"
          @apply-filters="applyTestimonialFilters"
          @change-page="changeTestimonialsPage"
          @approve="approveTestimonial"
          @toggle-featured="toggleFeatured"
        />

        <AdminOrdersCard
          id="orders"
          class="scroll-mt-24"
          v-show="activeTab === 'orders'"
          :orders="orders"
          :edits="orderEdits"
          :meta="ordersMeta"
          :filters="orderFilters"
          @apply-filters="applyOrderFilters"
          @change-page="changeOrdersPage"
          @save-order="updateOrder"
        />
        <AdminCoursesCard
          id="courses"
          class="scroll-mt-24"
          v-show="activeTab === 'courses'"
          :courses="courses"
          :edits="courseEdits"
          :meta="coursesMeta"
          :filters="courseFilters"
          @apply-filters="applyCourseFilters"
          @change-page="changeCoursesPage"
          @save-status="updateCourseStatus"
          @quick-status="updateCourseStatus"
          @preview="openCoursePreview"
          @decision="openCourseDecision"
          @edit="openCourseEdit"
        />
        <AdminCoursePreviewModal :open="isCoursePreviewOpen" :course="selectedCourse" @close="closeCoursePreview" />
        <AdminCourseDecisionModal :open="isCourseDecisionOpen" :course="selectedCourse" @close="closeCourseDecision" @submit="submitCourseDecision" />
        <AdminCourseEditModal :open="isCourseEditOpen" :course="selectedCourse" @close="closeCourseEdit" @save="submitCourseEdit" />
        <AdminLearningPathsCard
          id="paths"
          class="scroll-mt-24"
          v-show="activeTab === 'paths'"
          :paths="learningPaths"
          :edits="learningPathEdits"
          :meta="learningPathsMeta"
          :filters="learningPathFilters"
          :create-form="createLearningPathForm"
          @apply-filters="applyLearningPathFilters"
          @change-page="changeLearningPathsPage"
          @create-path="createLearningPath"
          @save-path="updateLearningPath"
        />
        <AdminBlogsCard
          id="blogs"
          class="scroll-mt-24"
          v-show="activeTab === 'blogs'"
          :blogs="blogs"
          :edits="blogEdits"
          :meta="blogsMeta"
          :filters="blogFilters"
          :create-form="createBlogForm"
          @apply-filters="applyBlogFilters"
          @change-page="changeBlogsPage"
          @create-blog="createBlog"
          @save-blog="updateBlog"
        />

        <AdminReportsCard id="reports" class="scroll-mt-24" v-show="activeTab === 'reports'" />
        <AdminSettingsCard id="settings" class="scroll-mt-24" v-show="activeTab === 'settings'" />
      </div>
    </section>
  </AdminLayout>
</template>

<script setup>
import DashboardState from "@/components/dashboard/DashboardState.vue";
import AdminLayout from "@/components/dashboard/admin/AdminLayout.vue";
import AdminUsersCard from "@/components/dashboard/admin/AdminUsersCard.vue";
import AdminTestimonialsCard from "@/components/dashboard/admin/AdminTestimonialsCard.vue";
import AdminOrdersCard from "@/components/dashboard/admin/AdminOrdersCard.vue";
import AdminCoursesCard from "@/components/dashboard/admin/AdminCoursesCard.vue";
import AdminCoursePreviewModal from "@/components/dashboard/admin/AdminCoursePreviewModal.vue";
import AdminCourseDecisionModal from "@/components/dashboard/admin/AdminCourseDecisionModal.vue";
import AdminCourseEditModal from "@/components/dashboard/admin/AdminCourseEditModal.vue";
import AdminLearningPathsCard from "@/components/dashboard/admin/AdminLearningPathsCard.vue";
import AdminBlogsCard from "@/components/dashboard/admin/AdminBlogsCard.vue";
import AdminReportsCard from "@/components/dashboard/admin/AdminReportsCard.vue";
import AdminSettingsCard from "@/components/dashboard/admin/AdminSettingsCard.vue";
import AdminOverviewCard from "@/components/dashboard/admin/AdminOverviewCard.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAdminPanel } from "@/composables/useAdminPanel";

const {
  loading,
  error,
  users,
  testimonials,
  orders,
  courses,
  learningPaths,
  blogs,
  userEdits,
  orderEdits,
  courseEdits,
  learningPathEdits,
  blogEdits,
  usersMeta,
  testimonialsMeta,
  ordersMeta,
  coursesMeta,
  learningPathsMeta,
  blogsMeta,
  userFilters,
  testimonialFilters,
  orderFilters,
  courseFilters,
  learningPathFilters,
  blogFilters,
  createLearningPathForm,
  createBlogForm,
  reload,
  updateUser,
  updateOrder,
  updateCourseStatus,
  updateCourseDecision,
  updateCourseFields,
  approveTestimonial,
  toggleFeatured,
  changeUsersPage,
  applyUserFilters,
  changeTestimonialsPage,
  applyTestimonialFilters,
  changeOrdersPage,
  applyOrderFilters,
  changeCoursesPage,
  applyCourseFilters,
  changeLearningPathsPage,
  applyLearningPathFilters,
  createLearningPath,
  updateLearningPath,
  changeBlogsPage,
  applyBlogFilters,
  createBlog,
  updateBlog
} = useAdminPanel();

const route = useRoute();
const activeTab = computed(() => String(route.query.tab || "overview"));
const selectedCourse = ref(null);
const isCoursePreviewOpen = ref(false);
const isCourseDecisionOpen = ref(false);
const isCourseEditOpen = ref(false);

const openCoursePreview = (course) => {
  selectedCourse.value = course;
  isCoursePreviewOpen.value = true;
};

const closeCoursePreview = () => {
  isCoursePreviewOpen.value = false;
  selectedCourse.value = null;
};

const openCourseDecision = (course) => {
  selectedCourse.value = course;
  isCourseDecisionOpen.value = true;
};

const closeCourseDecision = () => {
  isCourseDecisionOpen.value = false;
  selectedCourse.value = null;
};

const submitCourseDecision = async ({ status, note }) => {
  if (!selectedCourse.value) return;
  await updateCourseDecision(selectedCourse.value.id, { status, note });
  closeCourseDecision();
};

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
</script>


