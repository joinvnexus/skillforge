<template>
  <section class="mx-auto max-w-7xl px-4 py-8">
    <div class="section-shell p-7 md:p-10">
      <header class="mb-8 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Resources</p>
        <h1 class="mt-2 text-4xl font-bold text-slate-900">Learning Assets Library</h1>
        <p class="mx-auto mt-3 max-w-2xl text-slate-600">Free downloads to speed up your coding workflow and course progress.</p>
      </header>

      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="resource in resources"
          :key="resource.id"
          class="interactive-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
            <svg class="h-6 w-6 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="resource.icon" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900">{{ resource.title }}</h3>
          <p class="mt-2 text-sm text-slate-600">{{ resource.description }}</p>
          <a href="#" class="mt-4 inline-block text-sm font-bold text-teal-700 hover:text-teal-900">Download</a>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ResourcesView',
  data() {
    return {
      resources: [
        {
          id: 1,
          title: 'Vue.js Cheat Sheet',
          description: 'Quick reference guide for Vue.js syntax and features.',
          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        },
        {
          id: 2,
          title: 'Project Templates',
          description: 'Starter templates for various Vue.js project types.',
          icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
        },
        {
          id: 3,
          title: 'Video Tutorials',
          description: 'Free video tutorials covering various topics.',
          icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
        },
        {
          id: 4,
          title: 'E-Books',
          description: 'Comprehensive guides and e-books for learning.',
          icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        }
      ]
    }
  }
}
</script>
