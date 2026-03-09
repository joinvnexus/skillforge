<template>
  <section class="mx-auto max-w-7xl px-4 py-8">
    <div class="section-shell p-7 md:p-10">
      <header class="mb-8 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Support</p>
        <h1 class="mt-2 text-4xl font-bold text-slate-900">Support Center</h1>
        <p class="mx-auto mt-3 max-w-2xl text-slate-600">Search common questions or browse categories to resolve issues quickly.</p>
      </header>

      <div class="mx-auto mb-10 max-w-2xl">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for help..."
            class="w-full rounded-2xl border border-slate-300 px-6 py-4 text-lg focus:border-sky-500 focus:outline-none"
          />
          <svg class="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <article
          v-for="category in categories"
          :key="category.id"
          class="interactive-lift rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
            <svg class="h-6 w-6 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="category.icon" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900">{{ category.title }}</h3>
          <p class="mt-1 text-sm text-slate-600">{{ category.description }}</p>
        </article>
      </div>

      <div class="mx-auto max-w-3xl">
        <h2 class="mb-5 text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <div class="space-y-3">
          <article v-for="(faq, index) in faqs" :key="index" class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <button @click="toggleFaq(index)" class="flex w-full items-center justify-between px-5 py-4 text-left">
              <span class="font-semibold text-slate-900">{{ faq.question }}</span>
              <svg class="h-5 w-5 text-slate-500 transition-transform" :class="{ 'rotate-180': openFaq === index }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="openFaq === index" class="px-5 pb-4 text-sm text-slate-600">
              {{ faq.answer }}
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SupportView',
  data() {
    return {
      searchQuery: '',
      openFaq: null,
      categories: [
        { id: 1, title: 'Getting Started', description: 'Learn the basics of using our platform.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { id: 2, title: 'Account & Billing', description: 'Manage your account and payment settings.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { id: 3, title: 'Technical Issues', description: 'Troubleshoot common technical problems.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
      ],
      faqs: [
        { question: 'How do I reset my password?', answer: 'You can reset your password by clicking on "Forgot Password" on the login page. Enter your email address and we will send you a link to reset your password.' },
        { question: 'How do I access my purchased courses?', answer: 'After purchasing a course, you can access it from your dashboard. Go to "My Courses" to see all your enrolled courses.' },
        { question: 'Can I get a refund?', answer: 'Yes, we offer a 30-day money-back guarantee on all courses. If you are not satisfied, contact our support team for a full refund.' },
        { question: 'How do I download course materials?', answer: 'Course materials can be downloaded from the course page. Look for the "Resources" section in each lesson to find downloadable files.' }
      ]
    }
  },
  methods: {
    toggleFaq(index) {
      this.openFaq = this.openFaq === index ? null : index
    }
  }
}
</script>
