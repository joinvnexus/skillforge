<template>
  <div :class="wrapperClass">
    <p class="text-sm font-semibold" :class="titleClass">{{ title }}</p>
    <p v-if="description" class="mt-1 text-sm" :class="descriptionClass">{{ description }}</p>
    <button
      v-if="showRetry"
      type="button"
      class="mt-3 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      @click="$emit('retry')"
    >
      Try Again
    </button>
  </div>
</template>

<script>
export default {
  name: "DashboardState",
  props: {
    type: {
      type: String,
      default: "loading",
      validator: (value) => ["loading", "error", "empty"].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    showRetry: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    wrapperClass() {
      if (this.type === "error") {
        return "rounded-xl border border-red-200 bg-red-50 p-6 text-red-700";
      }
      if (this.type === "empty") {
        return "rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600";
      }
      return "rounded-xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm";
    },
    titleClass() {
      if (this.type === "error") return "text-red-700";
      return "text-slate-800";
    },
    descriptionClass() {
      if (this.type === "error") return "text-red-600";
      return "text-slate-500";
    }
  }
};
</script>
