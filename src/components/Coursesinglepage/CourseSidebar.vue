<template>
  <div class="sticky top-24 space-y-6">
    <div class="section-shell rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm">
      <div class="border-b border-[var(--line)] px-5 py-4">
        <h3 class="text-lg font-semibold text-[var(--text)]">Course Details</h3>
      </div>
      <div class="p-5">
        <ul class="space-y-3">
          <li v-for="(item, index) in metaItems" :key="index" class="flex items-center border-b border-slate-100 py-2 last:border-0">
            <i :class="item.icon" class="mr-3 w-5 text-[var(--brand)]"></i>
            <span class="text-[var(--muted)]">{{ item.label }}: <strong class="text-[var(--text)]">{{ item.value }}</strong></span>
          </li>
        </ul>
      </div>
    </div>

    <div class="section-shell overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-center shadow-sm">
      <div class="p-5">
        <div class="mb-4 flex items-baseline justify-center">
          <span class="text-3xl font-bold text-[var(--brand-strong)]">{{ currentPrice }}</span>
          <span v-if="course.originalPrice" class="ml-2 text-lg text-[var(--muted)]/70 line-through">${{ course.originalPrice }}</span>
        </div>
        <button
          @click="$emit('enroll')"
          class="btn-brand w-full rounded-xl px-4 py-3 font-semibold text-white"
        >
          Enroll Now
        </button>
        <p class="mt-3 text-sm text-[var(--muted)]">30-Day Money-Back Guarantee</p>
      </div>

      <div class="border-t border-[var(--line)] px-5 py-4 text-left">
        <h4 class="mb-3 text-base font-medium text-[var(--text)]">This course includes:</h4>
        <ul class="space-y-2">
          <li v-for="(feature, index) in courseFeatures" :key="index" class="flex items-start">
            <i :class="feature.icon" class="mr-2 mt-0.5 w-5 text-[var(--brand)]"></i>
            <span class="text-sm text-[var(--muted)]">{{ feature.text }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="section-shell rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
      <h4 class="mb-3 text-base font-medium text-[var(--text)]">Share this course</h4>
      <div class="flex justify-between gap-2">
        <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.href"
          :class="['inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:-translate-y-0.5', social.className]"
          :aria-label="`Share on ${social.name}`"
        >
          <i :class="social.icon"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "CourseSidebar",
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const metaItems = computed(() => [
      { icon: "fas fa-clock", label: "Duration", value: props.course.duration || "N/A" },
      { icon: "fas fa-book", label: "Lessons", value: props.course.lessons || "N/A" },
      { icon: "fas fa-signal", label: "Level", value: props.course.level || "All Levels" },
      { icon: "fas fa-language", label: "Language", value: props.course.language || "N/A" },
      { icon: "fas fa-certificate", label: "Certificate", value: props.course.certificate ? "Yes" : "No" }
    ]);

    const courseFeatures = computed(() => [
      { icon: "fas fa-video", text: `${props.course.duration || "0h"} on-demand video` },
      { icon: "fas fa-file-alt", text: `${props.course.lessons || 0} downloadable resources` },
      { icon: "fas fa-mobile-alt", text: "Access on mobile and TV" },
      { icon: "fas fa-infinity", text: "Full lifetime access" },
      { icon: "fas fa-trophy", text: "Certificate of completion" }
    ]);

    const currentPrice = computed(() => {
      const price = Number(props.course.price || 0);
      return price === 0 ? "Free" : `$${price}`;
    });

    const socialLinks = [
      { name: "Facebook", icon: "fab fa-facebook-f", className: "bg-blue-600 hover:bg-blue-700", href: "#" },
      { name: "Twitter", icon: "fab fa-twitter", className: "bg-sky-500 hover:bg-sky-600", href: "#" },
      { name: "LinkedIn", icon: "fab fa-linkedin-in", className: "bg-indigo-600 hover:bg-indigo-700", href: "#" },
      { name: "WhatsApp", icon: "fab fa-whatsapp", className: "bg-emerald-500 hover:bg-emerald-600", href: "#" }
    ];

    return { metaItems, courseFeatures, socialLinks, currentPrice };
  }
};
</script>
