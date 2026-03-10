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

    <div class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      Reviews module will be wired once review endpoints are exposed for instructors.
    </div>
  </article>
</template>

<script setup>
defineEmits(["open-reply"]);
</script>
