<template>
  <section class="min-h-screen px-4 pb-16">
    <div class="mx-auto max-w-7xl">
      <header class="section-shell mb-10 p-6">
        <h1 class="text-3xl font-bold text-slate-900 md:text-4xl">Insights & Engineering Notes</h1>
        <p class="mt-2 max-w-2xl text-slate-600">Latest articles from the platform about learning strategy and development.</p>
      </header>

      <div v-if="loading" class="rounded-xl bg-white p-6 shadow-sm">Loading posts...</div>
      <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{{ error }}</div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="post in posts" :key="post.id" class="section-shell interactive-lift rounded-xl p-5">
          <img :src="post.image" :alt="post.title" class="h-44 w-full rounded-lg object-cover" />
          <p class="mt-4 text-xs font-semibold uppercase tracking-wide text-sky-700">{{ post.category }}</p>
          <h2 class="mt-2 text-xl font-semibold text-slate-900">{{ post.title }}</h2>
          <p class="mt-2 text-sm text-slate-600">{{ post.excerpt }}</p>
          <p class="mt-3 text-xs text-slate-500">{{ formatDate(post.published_at) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('blog', {
      posts: (state) => state.posts,
      loading: (state) => state.loading,
      error: (state) => state.error
    })
  },
  methods: {
    ...mapActions('blog', ['fetchPosts']),
    formatDate(value) {
      if (!value) return 'Unpublished'
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  },
  async created() {
    await this.fetchPosts()
  }
}
</script>
