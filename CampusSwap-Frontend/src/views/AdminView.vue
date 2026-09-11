<template>
  <div class="admin-container">
    <router-view />
    <AdminNav />
  </div>
</template>

<script setup>
import AdminNav from '../components/AdminNav.vue'
</script>

<style scoped>
.admin-container {
  min-height: calc(100vh - 85px - 80px);
  padding-bottom: 80px;
}
</style>
