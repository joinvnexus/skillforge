<template>
  <main class="mx-auto max-w-[1600px] space-y-10 px-2 pb-12">
    <HeroSection />
    <FeaturesSection />
    <FeaturedCourses />
    <InstructorSpotlights />
    <PopularCourses />
    <StudentTestimonials />
    <NewsletterSignup />
    <BlogCard />
    <CTASection />
  </main>
</template>

<script setup>
import HeroSection from '@/components/Home/HeroSection.vue';
import FeaturesSection from '@/components/Home/FeaturesSection.vue';
import InstructorSpotlights from '@/components/Home/InstructorSpotlights.vue';
import FeaturedCourses from '@/components/Home/FeaturedCourses.vue';
import PopularCourses from '@/components/Home/PopularCourses.vue';
import StudentTestimonials from '@/components/Home/StudentTestimonials.vue';
import NewsletterSignup from '@/components/Home/NewsletterSignup.vue';
import BlogCard from '@/components/Home/BlogCard.vue';
import CTASection from '@/components/Home/CTASction.vue';
</script>
