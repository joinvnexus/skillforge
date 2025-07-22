<template>
  <main class="space-y-16"> <!-- Add spacing between sections -->
    <!-- Hero Banner Section -->
    <HeroSection />

    <!-- Features / Benefits Section -->
    <FeaturesSection />

    <!-- Spotlight on Instructors -->
    <InstructorSpotlights />

    <!-- Featured Courses -->
    <FeaturedCourses />

    <!-- Popular Courses Section -->
    <PopularCourses />

    <!-- Student Testimonials Section -->
    <StudentTestimonials />

    <!-- Newsletter Signup Form -->
    <NewsletterSignup />

    <!-- Latest Blog Posts -->
    <BlogCard />

    <!-- Call to Action Section -->
    <CTASection />
    <AddCourse />
  </main>
</template>

<script setup>
// Import Home Page Sections
import HeroSection from '@/components/Home/HeroSection.vue';
import FeaturesSection from '@/components/Home/FeaturesSection.vue';
import InstructorSpotlights from '@/components/Home/InstructorSpotlights.vue';
import FeaturedCourses from '@/components/Home/FeaturedCourses.vue';
import PopularCourses from '@/components/Home/PopularCourses.vue';
import StudentTestimonials from '@/components/Home/StudentTestimonials.vue';
import NewsletterSignup from '@/components/Home/NewsletterSignup.vue';
import BlogCard from '@/components/Home/BlogCard.vue';
import CTASection from '@/components/Home/CTASction.vue'; // Fixed typo
import AddCourse from '@/components/addCourse.vue';
</script>

<style scoped>
/* Add custom scoped styles here if needed */
</style>
