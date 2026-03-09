<template>
  <section
    class="relative flex min-h-[420px] items-center bg-cover bg-center px-4 py-16 text-white sm:px-6 md:min-h-[520px]"
    :style="{ backgroundImage: `url(${heroImage})` }"
  >
    <div class="absolute inset-0 bg-slate-950/65"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/30 to-transparent"></div>

    <div class="container relative z-10 mx-auto max-w-7xl">
      <div class="max-w-3xl">
        <div class="mb-4 text-sm text-white/80 md:text-base">
          <router-link to="/courses" class="transition-colors hover:text-blue-300">Courses</router-link>
          <span class="mx-1">/</span>
          <span>{{ course.title }}</span>
        </div>

        <h1 class="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {{ course.title }}
        </h1>

        <div class="mb-6 flex flex-wrap gap-4 text-sm md:gap-6 md:text-base">
          <div class="flex items-center">
            <div class="mr-1 flex text-yellow-400">
              <i
                v-for="i in 5"
                :key="i"
                class="fas fa-star"
                :class="{ 'text-slate-500': i > Math.round(course.rating || 0) }"
              ></i>
            </div>
            <span>({{ (course.rating || 0).toFixed(1) }})</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-users mr-1.5"></i>
            <span>{{ formattedStudents }} students</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-signal mr-1.5"></i>
            <span>{{ course.level || "All Levels" }}</span>
          </div>
        </div>

        <p class="mb-8 text-base leading-relaxed text-white/90 md:text-xl">
          {{ heroDescription }}
        </p>

        <div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            @click="$emit('enroll')"
            class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Enroll Now for {{ coursePrice }}
          </button>
          <button
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white/20"
          >
            <i class="far fa-heart"></i>
            <span>Add to Wishlist</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "CourseHero",
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  computed: {
    heroImage() {
      return this.course.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80";
    },
    heroDescription() {
      return this.course.descriptionExtended || this.course.description || "Build practical skills with a project-based curriculum and guided lessons.";
    },
    formattedStudents() {
      const total = Number(this.course.students || 0);
      return total.toLocaleString();
    },
    coursePrice() {
      const price = Number(this.course.price || 0);
      return price === 0 ? "Free" : `$${price}`;
    }
  }
};
</script>
