<template>
  <section class="relative w-full min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 bg-black/50 z-0">
      <img 
        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
        alt="Coding background"
        class="w-full h-full object-cover object-center"
      />
    </div>

    <!-- Hero Content -->
    <div class="container mx-auto px-6 z-10 text-center animate-fade-in">
      <div class="max-w-3xl mx-auto">
        <!-- Headline with animation -->
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
          Master Vue.js with <span class="text-blue-400">Expert Guidance</span>
        </h1>
        
        <!-- Subheadline -->
        <p class="text-xl md:text-2xl text-gray-300 mb-10 animate-fade-in delay-100">
          From Basics to Advanced - Learn at Your Own Pace with our Comprehensive Curriculum
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-200">
          <router-link 
            to="/courses" 
            class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Browse Courses
          </router-link>
          <router-link 
            to="/signup" 
            class="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Get Started Free
          </router-link>
        </div>
        
        <!-- Trust Indicators -->
        <div class="mt-16 flex flex-wrap justify-center items-center gap-6 text-gray-300 animate-fade-in delay-300">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>10,000+ Happy Students</span>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>50+ Professional Courses</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
      <button @click="scrollToContent" class="text-white focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  methods: {
    scrollToContent() {
      // You can adjust the selector to match your content section
      const content = document.querySelector('#main-content');
      if (content) {
        content.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
};
</script>

<style>
/* Custom animations */
.animate-fade-in {
  animation: fadeIn 1.5s ease-out forwards;
}

.animate-fade-in.delay-100 {
  animation-delay: 100ms;
}

.animate-fade-in.delay-200 {
  animation-delay: 200ms;
}

.animate-fade-in.delay-300 {
  animation-delay: 300ms;
}

.animate-slide-up {
  animation: slideUp 1s ease-out forwards;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-20px) translateX(-50%);
  }
  60% {
    transform: translateY(-10px) translateX(-50%);
  }
}
</style>