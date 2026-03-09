<template>
  <section class="py-16">
    <div class="mx-auto max-w-7xl px-4">
      <!-- Section Title -->
      <h2 class="text-4xl font-bold text-slate-900 mb-10 text-center">
        Latest Articles
      </h2>

      <!-- Blog Post Previews Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="post in allPosts"
          :key="post.id"
          class="section-shell interactive-lift relative rounded-xl overflow-hidden cursor-pointer"
          @click="viewPost(post)"
        >
          <!-- Blog Image with Overlay -->
          <div class="h-48 overflow-hidden relative group">
            <img
              :src="post.image"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
            >
              <svg
                class="w-12 h-12 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>

          <!-- Blog Content -->
          <div class="p-6">
            <!-- Category Badge -->
            <span
              v-if="post.category"
              class="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold mb-2"
            >
              {{ post.category }}
            </span>

            <h3 class="text-xl font-semibold text-slate-900 mb-2">{{ post.title }}</h3>
            <p class="text-slate-600 mb-4 line-clamp-3">{{ post.snippet }}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ formatDate(post.published_at) }}</span>
              <button
                class="btn-brand px-4 py-2 rounded-md text-sm"
                @click.stop="viewPost(post)"
              >
                Read More
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- View All Button -->
      <div class="flex justify-center mt-12">
        <router-link
          to="/blog"
          class="btn-brand inline-flex items-center rounded-xl px-6 py-3 font-semibold"
        >
          View All Articles
          <svg
            class="ml-3 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { format } from "date-fns";

export default {
  name: "BlogCard",
  computed: {
    ...mapGetters("blog", ["allPosts"]),
  },
  created() {
    this.$store.dispatch("blog/fetchPosts");
  },
  methods: {
    viewPost(post) {
      this.$router.push({ name: "Blog" });
    },
    formatDate(dateString) {
      if (!dateString) return 'No date';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        return format(date, 'MMMM d, yyyy');
      } catch (e) {
        return 'Invalid date';
      }
    },
  },
};
</script>

<style scoped>
/* Optional line-clamp for snippet truncation */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
