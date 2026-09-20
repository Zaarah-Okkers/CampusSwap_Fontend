<template>
 <div class="admin-layout">
    <div class="admin-body">
      <main class="admin-content">
        <router-view />
      </main>
    </div>
    <SideNav />
 </div>
</template>

<script setup>
import SideNav from '../components/SideNav.vue'
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #0f0f1e;
}

.admin-body {
  display: flex;
  align-items: stretch;
}

.admin-content {
  width: 100%;
  padding: 24px 32px 120px;
}

@media (max-width: 768px) {
  .admin-content {
    padding: 16px;
  }
}
</style>
