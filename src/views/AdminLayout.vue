<template>
 <div class="admin-layout">
    <AdminHeader />
    <div class="admin-body">
      <AdminSidebar />
      <main class="admin-content">
        <router-view />
      </main>
    </div>
 </div>
</template>

<script setup>
import AdminHeader from '../components/admin/AdminHeader.vue'
import AdminSidebar from '../components/admin/AdminSidebar.vue'
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
  flex: 1;
  min-width: 0;
  padding: 24px 32px;
}

@media (max-width: 768px) {
  .admin-content {
    padding: 16px;
  }
}
</style>