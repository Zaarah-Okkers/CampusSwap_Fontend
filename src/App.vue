<template>
<<<<<<< HEAD
  <div id="app">
    <CheckoutView />
  </div>
</template>

<script>
import CheckoutView from './components/CheckoutView.vue';

export default {
  name: 'App',
  components: {
    CheckoutView
  }
};
</script>

<style>
/* Reset base margins */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
}
</style>
=======
  <!-- Sidebar shows on all pages except Login -->
  <div v-if="route.path !== '/login'" class="layout-container">
    <aside class="sidebar">
      <div class="logo-text" style="color: white;">CampusSwap <span style="color: #F5B941;">SA</span></div>
      
      <nav class="side-nav">
        <router-link to="/" class="nav-item">Home</router-link>
        <router-link to="/academic" class="nav-item">Academic Marketplace</router-link>
        <router-link to="/safehome" class="nav-item">SafeHome</router-link>
        <router-link to="/dashboard" class="nav-item">Dashboard</router-link>
        <router-link to="/checkout" class="nav-item">Checkout</router-link>
      </nav>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>

  <!-- Login page (No sidebar) -->
  <router-view v-else />
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>
main-content {
  min-height: 100vh;
  width: 100%;
}
</style>
>>>>>>> e2fb2d4 (added my pages)
