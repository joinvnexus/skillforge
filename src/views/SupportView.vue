<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions or get in touch with our support team.
        </p>
      </div>
      
      <!-- Search -->
      <div class="max-w-2xl mx-auto mb-12">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Search for help..." class="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" />
          <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <!-- FAQ Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div v-for="category in categories" :key="category.id" class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="category.icon" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ category.title }}</h3>
          <p class="text-gray-600 text-sm">{{ category.description }}</p>
        </div>
      </div>
      
      <!-- FAQ -->
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-xl shadow-md overflow-hidden">
            <button @click="toggleFaq(index)" class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50">
              <span class="font-medium text-gray-900">{{ faq.question }}</span>
              <svg class="w-5 h-5 text-gray-500 transition-transform" :class="{ 'rotate-180': openFaq === index }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="openFaq === index" class="px-6 pb-4 text-gray-600">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
