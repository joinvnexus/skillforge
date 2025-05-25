<!-- IT\src\App.vue -->

<template>
  <HeaderSection />
  <router-view />
  <FooterComponent />
</template>
<script>

  import { auth } from './firebase'
  import { useStore } from 'vuex';
  import FooterComponent from './components/FooterComponent.vue';
  import HeaderSection from './components/HeaderSection.vue';
  export default {
    components: { HeaderSection, FooterComponent },
    setup() {
      const store = useStore()

      // Initialize auth state listener
      auth.onAuthStateChanged(user => {
        store.commit('auth/SET_USER', user)
        store.commit('auth/SET_AUTH_READY', true)
      })
    }
  }
</script>

<style scoped></style>
