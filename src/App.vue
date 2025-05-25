<!-- App Layout -->
 <!-- src/App.vue -->
<template>
  <!-- Global Header -->
  <HeaderSection />

  <!-- Router View with Transition -->
  <transition name="fade" mode="out-in">
    <router-view />
  </transition>

  <!-- Global Footer -->
  <FooterComponent />
</template>

<script>
import { auth } from './firebase'
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

    // Firebase auth listener to keep Vuex store updated
    auth.onAuthStateChanged(user => {
      store.commit('auth/SET_USER', user)
      store.commit('auth/SET_AUTH_READY', true)
    })
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
