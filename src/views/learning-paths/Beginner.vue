<template>
  <div class="max-w-6xl mx-auto px-6 py-10 pt-20 ">
    <!-- 🌀 Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>

    <!-- ⚠️ Error State -->
    <div
      v-else-if="error"
      class="bg-red-100 text-red-700 p-6 rounded-xl text-center shadow-sm"
    >
      <p>{{ error }}</p>
      <button
        @click="fetchPath"
        class="mt-4 px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
      >
        Try Again
      </button>
    </div>

    <!-- 🌱 Content -->
    <div v-else>
      <!-- Header Section -->
      <div class="bg-gray-50 rounded-2xl p-8 mb-10 shadow-sm">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          <img
            :src="path.icon"
            :alt="path.title"
            class="w-20 h-20 md:w-24 md:h-24 object-cover "
          />
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              {{ path.title }}
            </h1>
            <p class="text-gray-600 text-base leading-relaxed">
              {{ path.description }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-6 text-gray-600 mt-4">
          <div class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z"
              />
            </svg>
            <span class="font-medium">{{ path.courses }} Courses</span>
          </div>
          <div class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
                10-4.48 10-10S17.52 2 12 2zm0 
                18c-4.41 0-8-3.59-8-8s3.59-8 
                8-8 8 3.59 8 8-3.59 8-8 
                8z"
              />
              <path d="M12 6v6l4 2" />
            </svg>
            <span class="font-medium">{{ path.duration }}</span>
          </div>
        </div>
      </div>

      <!-- Main Body -->
      <div class="grid md:grid-cols-3 gap-10">
        <!-- 🎯 Features -->
        <div class="md:col-span-1">
          <h2 class="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">
            What You'll Learn
          </h2>
          <ul class="space-y-3">
            <li
              v-for="(feature, index) in path.features"
              :key="index"
              class="flex items-start gap-2 text-gray-700"
            >
              <svg
                class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 
                21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <!-- 📘 Curriculum -->
        <div class="md:col-span-2">
          <h2 class="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">
            Curriculum
          </h2>

          <div
            v-for="module in path.curriculum"
            :key="module.module"
            class="mb-6"
          >
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              {{ module.title }}
            </h3>
            <ul class="border-l-4 border-green-100 pl-4 space-y-2">
              <li
                v-for="lesson in module.lessons"
                :key="lesson.title"
                class="flex justify-between items-center border-b border-gray-100 py-2"
              >
                <span class="text-gray-700">{{ lesson.title }}</span>
                <span class="text-sm text-gray-500">{{
                  lesson.duration
                }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 🚀 Call to Action -->
      <div class="text-center mt-10">
        <router-link
          to="/signup"
          class="inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
        >
          Start Learning Now
        </router-link>
        <p class="text-gray-500 text-sm mt-2">7-day free trial available</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "BeginnerPath",
  computed: {
    ...mapState("learningPaths", {
      path: "currentPath",
      isLoading: (state) => state.isLoading,
      error: (state) => state.error,
    }),
  },
  created() {
    this.fetchPath();
  },
  methods: {
    ...mapActions("learningPaths", ["fetchPathBySlug"]),
    fetchPath() {
      this.fetchPathBySlug("beginner");
    },
  },
  metaInfo() {
    return {
      title: "Beginner Vue.js Learning Path",
      meta: [
        {
          name: "description",
          content:
            "Start your Vue.js journey with our beginner-friendly learning path",
        },
      ],
    };
  },
};
</script>
