<template>
  <div class="course-reviews space-y-8">
    <h2 class="text-2xl font-bold text-[var(--text)] md:text-3xl">Student Reviews</h2>

    <div class="rating-overview flex flex-col gap-6 border-b border-[var(--line)] pb-8 md:flex-row md:gap-12">
      <div class="average-rating flex w-full flex-col items-center md:w-auto">
        <div class="score text-5xl font-bold leading-none text-[var(--brand-strong)]">{{ rating.toFixed(1) }}</div>
        <div class="stars my-3 flex gap-1">
          <i
            v-for="i in 5"
            :key="i"
            class="fas fa-star text-lg"
            :class="{ 'text-yellow-400': i <= Math.round(rating), 'text-[var(--line)]': i > Math.round(rating) }"
          ></i>
        </div>
        <div class="count text-sm text-[var(--muted)]">Based on {{ reviews.length }} reviews</div>
      </div>

      <div class="rating-bars w-full flex-1 space-y-3">
        <div v-for="n in 5" :key="`bar-${n}`" class="bar">
          <div class="star-count flex items-center gap-3">
            <span class="w-12 text-sm text-[var(--muted)]">{{ n }} star</span>
            <div class="bar-container h-2 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
              <div class="bar-fill h-full rounded-full bg-[var(--brand)]" :style="{ width: `${getStarPercentage(n)}%` }"></div>
            </div>
            <span class="w-12 text-right text-sm text-[var(--muted)]">{{ getStarCount(n) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="reviews-list space-y-6">
      <article v-for="review in reviews" :key="review.id" class="review border-b border-[var(--line)] py-6 last:border-b-0">
        <div class="review-header mb-4 flex gap-4">
          <div class="avatar h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow">
            <img :src="review.avatar" :alt="review.name" class="h-full w-full object-cover" />
          </div>
          <div class="info">
            <h4 class="font-medium text-[var(--text)]">{{ review.name }}</h4>
            <div class="meta mt-1 flex flex-wrap items-center gap-2">
              <div class="stars flex gap-1">
                <i
                  v-for="i in 5"
                  :key="i"
                  class="fas fa-star text-sm"
                  :class="{ 'text-yellow-400': i <= review.rating, 'text-[var(--line)]': i > review.rating }"
                ></i>
              </div>
              <span class="text-xs text-[var(--muted)]">{{ review.date }}</span>
            </div>
          </div>
        </div>
        <div class="review-content">
          <h5 class="mb-2 font-semibold text-[var(--text)]">{{ review.title }}</h5>
          <p class="leading-relaxed text-[var(--muted)]">{{ review.content }}</p>
        </div>
      </article>
    </div>

    <button
      v-if="reviews.length < totalReviews"
      class="btn-brand mx-auto rounded-lg px-6 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
      @click="$emit('load-more')"
    >
      Load More Reviews
    </button>
  </div>
</template>

<script>
export default {
  name: "CourseReviews",
  props: {
    rating: {
      type: Number,
      required: true
    },
    reviews: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      totalReviews: 1250,
      sampleReviews: [
        {
          id: 1,
          name: "Alex Johnson",
          avatar: "/images/avatars/avatar1.jpg",
          rating: 5,
          date: "2 weeks ago",
          title: "Excellent course!",
          content: "This course exceeded my expectations. The projects are practical and easy to follow."
        },
        {
          id: 2,
          name: "Sarah Miller",
          avatar: "/images/avatars/avatar2.jpg",
          rating: 4,
          date: "1 month ago",
          title: "Great content",
          content: "Very comprehensive and hands-on. Some modules could go deeper, but overall a strong course."
        },
        {
          id: 3,
          name: "Michael Chen",
          avatar: "/images/avatars/avatar3.jpg",
          rating: 5,
          date: "2 months ago",
          title: "Best Vue course",
          content: "Clear teaching style and up-to-date material. Highly recommended for practical learners."
        }
      ]
    };
  },
  created() {
    if (this.reviews.length === 0) {
      this.$emit("update:reviews", this.sampleReviews);
    }
  },
  methods: {
    getStarCount(star) {
      const counts = { 5: 850, 4: 250, 3: 100, 2: 30, 1: 20 };
      return counts[star] || 0;
    },
    getStarPercentage(star) {
      const count = this.getStarCount(star);
      return (count / this.totalReviews) * 100;
    }
  }
};
</script>

<style scoped>
.bar-fill {
  transition: width 1s ease-out;
}
</style>
