<template>
  <div class="admin-shell">
    <div class="admin-panel">
      <div class="flex gap-6">
        <AdminSidebar />
        <div class="flex min-h-[calc(100vh-64px)] flex-1 flex-col gap-6">
          <AdminTopbar>
            <slot name="topbar" />
          </AdminTopbar>
          <main class="flex-1">
            <slot />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar.vue";
import AdminTopbar from "@/components/dashboard/admin/AdminTopbar.vue";
</script>
