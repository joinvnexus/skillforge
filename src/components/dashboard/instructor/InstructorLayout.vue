<template>
  <div class="admin-shell">
    <div class="admin-panel">
      <div class="flex gap-6">
        <InstructorSidebar />
        <div class="flex min-h-[calc(100vh-64px)] flex-1 flex-col gap-6">
          <InstructorTopbar>
            <slot name="topbar" />
          </InstructorTopbar>
          <main class="flex-1">
            <slot />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InstructorSidebar from "@/components/dashboard/instructor/InstructorSidebar.vue";
import InstructorTopbar from "@/components/dashboard/instructor/InstructorTopbar.vue";
</script>
