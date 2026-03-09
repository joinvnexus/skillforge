<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">My Wishlist</h1>
      <p class="text-slate-500">Saved courses you want to start next.</p>
    </div>

    <DashboardState v-if="loading" type="loading" title="Loading wishlist..." />
    <DashboardState v-else-if="error" type="error" title="Wishlist failed to load" :description="error" show-retry @retry="load" />
    <DashboardState v-else-if="items.length === 0" type="empty" title="Your wishlist is empty." description="Save courses you want to start later." />

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <article v-for="course in items" :key="course.id" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">{{ course.title }}</h2>
        <p class="mt-1 text-sm text-slate-500">{{ course.instructorName }}</p>
        <p class="mt-2 text-sm text-slate-600 line-clamp-2">{{ course.description }}</p>
        <div class="mt-4 flex gap-2">
          <button class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800" @click="addToCart(course)">
            Add to Cart
          </button>
          <button class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="remove(course.id)">
            Remove
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import DashboardState from "@/components/dashboard/DashboardState.vue";

const store = useStore();
const items = computed(() => store.getters["wishlist/wishlistItems"]);
const loading = computed(() => store.state.wishlist.loading);
const error = computed(() => store.state.wishlist.error);

const load = () => store.dispatch("wishlist/fetchWishlist");
const remove = (courseId) => store.dispatch("wishlist/removeFromWishlist", courseId);
const addToCart = (course) => store.dispatch("cart/addToCart", course);

onMounted(load);
</script>
