<template>
  <article class="section-shell interactive-lift flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white">
    <div class="relative">
      <img
        :src="course.image || '/placeholder-course.jpg'"
        :alt="course.title"
        class="h-36 w-full object-cover"
      />
      <span
        v-if="course.price === 0"
        class="absolute right-2 top-2 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white"
      >
        FREE
      </span>
    </div>

    <div class="flex flex-1 flex-col p-4">
      <h3 class="mb-1 text-lg font-semibold text-slate-900">
        <router-link :to="'/courses/' + course.id" class="transition-colors hover:text-blue-600">
          {{ course.title }}
        </router-link>
      </h3>
      <p class="mb-2 text-sm text-slate-600">By {{ course.instructor || "Unknown Instructor" }}</p>
      <p class="mb-3 line-clamp-2 text-sm text-slate-600">
        {{ course.description || "No description available" }}
      </p>

      <div class="mt-auto">
        <div class="mb-3 flex items-center justify-between">
          <div class="flex items-center">
            <div class="mr-1 flex text-yellow-400">
              <span v-for="star in 5" :key="star">
                <svg
                  class="h-4 w-4"
                  :class="{ 'text-slate-300': star > Math.round(course.rating || 0) }"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>
            <span class="text-sm text-slate-600">{{ (course.rating || 0).toFixed(1) }}</span>
          </div>
          <span class="font-semibold text-slate-900">
            {{ course.price === 0 ? "Free" : "$" + course.price }}
          </span>
        </div>

        <router-link
          :to="'/courses/' + course.id"
          class="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View Course
        </router-link>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "RelatedCourseCard",
  props: {
    course: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
