<!-- App Layout -->
 <!-- src/App.vue -->
<template>
  <HeaderSection />
  <ToastStack />

  <main class="page-shell">
    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>

  <FooterComponent />
</template>

<script>
import HeaderSection from '@/components/Global/HeaderSection.vue'
import FooterComponent from '@/components/Global/FooterComponent.vue'
import ToastStack from '@/components/Global/ToastStack.vue'

export default {
  components: {
    HeaderSection,
    FooterComponent,
    ToastStack
  }
}
</script>
