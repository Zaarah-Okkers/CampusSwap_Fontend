<template>
  <nav class="admin-nav glass-panel">
    <button
      v-for="tab in adminTabs"
      :key="tab.key"
      class="tab"
      :class="{ active: active === tab.key }"
      @click="selectTab(tab.key)"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path :d="tab.icon"/>
      </svg>
      <span>{{ tab.label }}</span>
      <span v-if="tab.badge" class="badge">{{ tab.badge }}</span>
    </button>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const active = ref('dashboard')

const adminTabs = [
  { 
    key: 'dashboard', 
    label: 'Dashboard', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
  },
  { 
    key: 'users', 
    label: 'Users', 
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  { 
    key: 'premium', 
    label: 'Premium', 
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    badge: 0
  },
  { 
    key: 'advertise', 
    label: 'Advertise', 
    icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.945 13A9 9 0 0013 3.055V13h7.945z'
  },
  { 
    key: 'promote', 
    label: 'Promote', 
    icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
  }
]

// Get premium count from store
const premiumUsers = computed(() => {
  return store.state.user.users.filter(u => u.isPremium).length
})

// Update badge count
const tabsWithBadges = computed(() => {
  return adminTabs.map(tab => {
    if (tab.key === 'premium') {
      return { ...tab, badge: premiumUsers.value }
    }
    return tab
  })
})

function selectTab(key) {
  active.value = key
  router.push(`/admin/${key}`)
}
</script>

<style scoped>
.admin-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  z-index: 50;
  border-radius: 22px;
  display: flex;
  justify-content: space-around;
  padding: 8px 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  background: var(--ink-elevated);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  gap: 4px;
}

.tab {
  background: none;
  border: none;
  color: var(--text-faint);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 16px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 60px;
  position: relative;
}

.tab:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
}

.tab svg {
  width: 22px;
  height: 22px;
  transition: transform 0.2s ease;
}

.tab:hover svg {
  transform: scale(1.05);
}

.tab.active {
  color: var(--gold);
  background: var(--gold-soft);
}

.tab.active svg {
  stroke: var(--gold);
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--coral);
  color: white;
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: 700;
}

/* Mobile */
@media (max-width: 640px) {
  .admin-nav {
    bottom: 12px;
    padding: 6px 8px;
    border-radius: 18px;
    width: calc(100% - 24px);
    max-width: 500px;
    gap: 2px;
  }
  
  .tab {
    padding: 6px 10px;
    font-size: 9px;
    min-width: 44px;
  }
  
  .tab svg {
    width: 16px;
    height: 16px;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .admin-nav {
    padding: 10px 20px;
    gap: 8px;
    border-radius: 28px;
  }
  
  .tab {
    padding: 10px 24px;
    font-size: 13px;
    min-width: 80px;
  }
  
  .tab svg {
    width: 24px;
    height: 24px;
  }
}
</style>
