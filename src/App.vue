<!-- App Layout -->
 <!-- src/App.vue -->
<template>
  <!-- Global Header -->
  <HeaderSection />

  <!-- Router View with Transition -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <!-- Global Footer -->
  <FooterComponent />
</template>

<script>
import { useStore } from 'vuex'
import HeaderSection from '@/components/Global/HeaderSection.vue'
import FooterComponent from '@/components/Global/FooterComponent.vue'

export default {
  components: {
    HeaderSection,
    FooterComponent
  },
  setup() {
    const store = useStore()
    // Auth is initialized in main.js via store.dispatch('auth/initializeAuth')
  }
}
</script>

<style scoped>
/* Simple fade transition for route views */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
