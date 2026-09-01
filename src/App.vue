<template>
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

.layout-container { 
  display: flex; 
  min-height: 100%; 
}

.sidebar {
  width: 250px;
  height: 100%;
  background-color: #0D1B3D;
  color: white;
  position: fixed;
  padding: 20px;
}

.side-nav { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
  margin-top: 40px; 
}

.nav-item {
  color: #F4F6F8;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
}
.nav-item:hover { 
  background-color: rgba(255, 255, 255, 0.1); 
  color: white; 
}

.nav-item.router-link-active {
  background-color: #00A6A6; color: white; 
}

.main-content { 
  margin-left: 250px; 
  flex-grow: 1; 
  padding: 20px; 
}
</style>