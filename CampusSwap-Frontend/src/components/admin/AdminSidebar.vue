<template>
  <aside class="admin-sidebar">
    <nav class="admin-nav">
      <button
        v-for="item in menuItems"
        :key="item.key"
        class="nav-item"
        :class="{ active: active === item.key }"
        @click="navigate(item.key)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
        <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()
const active = ref('dashboard')

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
  { key: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
  { key: 'premium', label: 'Premium', icon: '⭐', path: '/admin/premium' },
  { key: 'advertise', label: 'Advertise', icon: '📢', path: '/admin/advertise' },
  { key: 'promote', label: 'Promote', icon: '🚀', path: '/admin/promote' },
]

const premiumUsers = computed(() => {
  const users = store.state.user?.users || []
  return users.filter(u => u.isPremium).length
})

const menuWithBadges = computed(() => {
  return menuItems.map(item => {
    if (item.key === 'premium' && premiumUsers.value > 0) {
      return { ...item, badge: premiumUsers.value }
    }
    return item
  })
})

watch(() => route.path, (path) => {
  const item = menuItems.find(i => path === i.path || path.startsWith(i.path + '/'))
  if (item) {
    active.value = item.key
  }
}, { immediate: true })

function navigate(key) {
  const item = menuItems.find(i => i.key === key)
  if (item) {
    active.value = key
    router.push(item.path)
  }
}
</script>

<style scoped>
.admin-sidebar {
  width: 220px;
  min-width: 220px;
  background: #1a1a2e;
  padding: 20px 12px;
  border-right: 1px solid rgba(255,255,255,0.05);
  min-height: calc(100vh - 85px - 60px);
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  position: relative;
}

.nav-item:hover {
  background: rgba(255,255,255,0.05);
  color: white;
}

.nav-item.active {
  background: rgba(108, 92, 231, 0.2);
  color: #6C5CE7;
}

.nav-icon {
  font-size: 18px;
}

.nav-label {
  flex: 1;
  text-align: left;
}

.nav-badge {
  background: #FF6B6B;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 60px;
    min-width: 60px;
    padding: 12px 6px;
  }
  .nav-label,
  .nav-badge {
    display: none;
  }
  .nav-item {
    justify-content: center;
    padding: 12px;
  }
}
</style>
