<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">My Wishlist</h1>
      <p class="text-slate-500">Saved courses you want to start next.</p>
    </div>

    <div v-if="loading" class="rounded-xl bg-white p-6 shadow-sm">Loading wishlist...</div>
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{{ error }}</div>
    <div v-else-if="items.length === 0" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
      Your wishlist is empty.
    </div>

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

const store = useStore();
const items = computed(() => store.getters["wishlist/wishlistItems"]);
const loading = computed(() => store.state.wishlist.loading);
const error = computed(() => store.state.wishlist.error);

const load = () => store.dispatch("wishlist/fetchWishlist");
const remove = (courseId) => store.dispatch("wishlist/removeFromWishlist", courseId);
const addToCart = (course) => store.dispatch("cart/addToCart", course);

onMounted(load);
</script>
