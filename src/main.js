import './assets/main.css'

import AOS from 'aos';
import 'aos/dist/aos.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Import the Vuex store

const app = createApp(App)

AOS.init();
app.use(router)
app.use(store) // Use the Vuex store

// Initialize auth before mounting the app
store.dispatch('auth/initializeAuth').then(() => {
  store.dispatch('cart/initializeCart')
  app.mount('#app')
})
