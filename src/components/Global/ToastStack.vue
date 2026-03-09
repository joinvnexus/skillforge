<template>
  <div class="pointer-events-none fixed right-4 top-4 z-[70] flex w-full max-w-sm flex-col gap-2">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto rounded-lg border px-3 py-2 text-sm shadow-lg backdrop-blur"
        :class="classesByType(toast.type)"
      >
        <div class="flex items-start justify-between gap-2">
          <p class="font-medium">{{ toast.message }}</p>
          <button
            type="button"
            class="rounded px-1.5 py-0.5 text-xs font-semibold hover:bg-black/5"
            @click="dismiss(toast.id)"
          >
            X
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const toasts = computed(() => store.getters["ui/toasts"] || []);

const dismiss = (id) => {
  store.dispatch("ui/dismissToast", id);
};

const classesByType = (type) => {
  if (type === "success") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (type === "error") return "border-rose-200 bg-rose-50 text-rose-800";
  if (type === "warning") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-slate-200 bg-white text-slate-800";
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
