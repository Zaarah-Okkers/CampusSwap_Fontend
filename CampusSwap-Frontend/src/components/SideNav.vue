<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/UserStore'

const router = useRouter()
const userStore = useUserStore()
const active = ref('market')

const tabs = [
  { key: 'home', label: 'Home', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  { key: 'market', label: 'Market', icon: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z M3 6h18 M16 10a4 4 0 0 1-8 0' },
  { key: 'books', label: 'Books', icon: 'M4 6h16 M4 12h16 M4 18h10' },
  { key: 'messages', label: 'Chats', icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' },
  { key: 'profile', label: 'Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z' }
]

// Add admin tab if user is admin
const allTabs = computed(() => {
  if (userStore.currentUser.role === 'admin') {
    return [...tabs, { key: 'admin', label: 'Admin', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5' }]
  }
  return tabs
})

function select(key) {
  active.value = key
  if (key === 'messages') {
    router.push('/chat')
  } else if (key === 'admin') {
    router.push('/admin')
  } else if (key === 'books') {
    router.push('/books')
  } else if (key === 'home' || key === 'market') {
    router.push('/')
  }
  // For profile, just update active state
}
</script>

<template>
  <nav class="bottom-nav glass-panel">
    <button
      v-for="tab in allTabs"
      :key="tab.key"
      class="tab"
      :class="{ active: active === tab.key }"
      @click="select(tab.key)"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="tab.icon"/></svg>
      <span>{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
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

/* Mobile - smaller nav */
@media (max-width: 640px) {
  .bottom-nav {
    bottom: 12px;
    padding: 6px 8px;
    border-radius: 18px;
    width: calc(100% - 24px);
    max-width: 500px;
    gap: 2px;
  }
  
  .tab {
    padding: 6px 10px;
    font-size: 10px;
    min-width: 44px;
  }
  
  .tab svg {
    width: 18px;
    height: 18px;
  }
}

/* Desktop - larger nav */
@media (min-width: 1025px) {
  .bottom-nav {
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