<template>
  <div class="admin-layout">
    <nav class="admin-tabs glass-panel">
      <button
        v-for="item in menuItems"
        :key="item.key"
        class="tab-item"
        :class="{ active: active === item.key }"
        @click="navigate(item.key)"
      >
        <span class="tab-icon">{{ item.icon }}</span>
        <span class="tab-label">{{ item.label }}</span>
      </button>
    </nav>

    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const active = ref('dashboard')

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
  { key: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
  { key: 'premium', label: 'Premium', icon: '⭐', path: '/admin/premium' },
  { key: 'advertise', label: 'Advertise', icon: '📢', path: '/admin/advertise' },
  { key: 'promote', label: 'Promote', icon: '🚀', path: '/admin/promote' },
]

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
.admin-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.admin-tabs {
  display: flex;
  gap: 6px;
  padding: 8px;
  border-radius: 14px;
  overflow-x: auto;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.tab-item:hover {
  background: rgba(255,255,255,0.05);
  color: var(--text);
}

.tab-item.active {
  background: var(--gold-soft);
  color: var(--gold);
}

.tab-icon {
  font-size: 16px;
}

.admin-content {
  flex: 1;
}

@media (max-width: 768px) {
  .admin-tabs {
    gap: 4px;
    padding: 6px;
  }
  .tab-item {
    padding: 8px 12px;
    font-size: 13px;
  }
  .tab-label {
    display: none;
  }
}
</style>