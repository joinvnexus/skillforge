<template>
  <article class="admin-card p-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">Reviews & Q&A</h3>
        <p class="text-xs text-slate-500">Manage course feedback.</p>
      </div>
      <button class="rounded border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="$emit('open-reply')">
        Reply to Review
      </button>
    </div>

    <div v-if="!reviews.length" class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      No reviews yet.
    </div>
    <ul v-else class="mt-4 space-y-3">
      <li v-for="review in reviews" :key="review.id" class="rounded-lg border border-slate-200 p-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-800">{{ review.user?.name }}</p>
            <p class="text-xs text-slate-500">{{ review.course?.title }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{{ review.rating }}/5</span>
            <button class="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="$emit('open-reply', review)">
              Reply
            </button>
          </div>
        </div>
        <p class="mt-2 text-sm text-slate-600">{{ review.comment || "No comment" }}</p>
      </li>
    </ul>
  </article>
</template>

<script setup>
defineProps({
  reviews: { type: Array, required: true }
});

defineEmits(["open-reply"]);
</script>
