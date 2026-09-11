<template>
  <header class="admin-header">
    <div class="admin-header-content">
      <div class="admin-brand">
        <span class="brand-icon">🏛️</span>
        <div>
          <h1>CampusSwap</h1>
          <span>Admin Panel</span>
        </div>
      </div>
      <div class="admin-header-right">
        <div class="admin-user">
          <img :src="currentUser?.avatar" :alt="currentUser?.name" class="admin-avatar" />
          <div>
            <div class="admin-name">{{ currentUser?.name }}</div>
            <div class="admin-role">{{ getRoleDisplay(currentUser?.role) }}</div>
          </div>
        </div>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const currentUser = computed(() => store.state.user?.currentUser)

function getRoleDisplay(role) {
  return store.getters['user/getRoleDisplay'](role)
}

function logout() {
  if (confirm('Logout from admin?')) {
    router.push('/')
  }
}
</script>

<style scoped>
.admin-header {
  background: #1a1a2e;
  color: white;
  padding: 12px 32px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  font-size: 28px;
}

.admin-brand h1 {
  font-size: 20px;
  margin: 0;
  color: white;
}

.admin-brand span {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  display: block;
}

.admin-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
}

.admin-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.admin-name {
  font-size: 13px;
  font-weight: 600;
}

.admin-role {
  font-size: 11px;
  color: rgba(255,255,255,0.6);
}

.logout-btn {
  padding: 6px 16px;
  border-radius: 6px;
  border: none;
  background: rgba(255,107,107,0.2);
  color: #FF6B6B;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(255,107,107,0.3);
}

@media (max-width: 768px) {
  .admin-header {
    padding: 10px 16px;
  }
  .admin-brand h1 {
    font-size: 17px;
  }
  .admin-user .admin-name,
  .admin-user .admin-role {
    display: none;
  }
  .logout-btn {
    padding: 4px 12px;
    font-size: 12px;
  }
}
</style>
