<template>
  <div class="course-tabs">
    <ul class="nav-tabs scrollbar-hide flex overflow-x-auto whitespace-nowrap">
      <li v-for="tab in tabs" :key="tab.id" class="nav-item flex-shrink-0">
        <button
          class="nav-link relative px-4 py-3 text-sm font-medium transition-all duration-200 md:px-6 md:py-4 md:text-base"
          :class="activeTab === tab.id ? 'text-[var(--brand-strong)]' : 'text-[var(--muted)] hover:text-[var(--text)]'"
          @click="$emit('tab-change', tab.id)"
        >
          {{ tab.label }}
          <span
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand)] transition-all duration-200"
            :class="activeTab === tab.id ? 'scale-x-100' : 'scale-x-0'"
          ></span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CourseTabs",
  props: {
    course: {
      type: Object,
      required: true
    },
    activeTab: {
      type: String,
      default: "overview"
    },
    tabs: {
      type: Array,
      default: () => [
        { id: "overview", label: "Overview" },
        { id: "curriculum", label: "Curriculum" },
        { id: "instructor", label: "Instructor" },
        { id: "reviews", label: "Reviews" }
      ]
    }
  }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.nav-tabs {
  border-bottom: 1px solid var(--line);
}

.nav-link {
  border-bottom: 2px solid transparent;
}
</style>
