<template>
  <nav class="bottom-nav glass-panel">
    <button
      v-for="tab in visibleTabs"
      :key="tab.key"
      class="tab"
      :class="{ active: active === tab.key }"
      @click="selectTab(tab)"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path :d="tab.icon" />
      </svg>
      <span>{{ tab.label }}</span>
    </button>

    <!-- logout only when logged in -->
    <button v-if="isLoggedIn" class="tab logout-tab" @click="handleLogoutClick">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
      </svg>
      <span>Logout</span>
    </button>
  </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { handleLogout } from '../utils/auth'

const router = useRouter()
const route = useRoute()
const store = useStore()
const active = ref('home')

const LOGOUT_MESSAGES = {
  student:          'Session terminated. Go touch grass.',
  service_provider: 'Mission accomplished. Over and Out chief.',
  admin:            'God mode disabled.',
  res_manager:      'Game saved. Player 1 has left the lobby.'
}

/* ---------- central Vuex auth state ---------- */
const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
const currentRole = computed(() => store.getters['user/currentUser']?.role || 'logged_out')

/* ---------- icons ---------- */
const ICONS = {
  home:        'M3 9l9-7 9 7 M4 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10',
  login:       'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4 M10 17l5-5-5-5 M15 12H3',
  about:       'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 16v-5 M12 8h.01',
  contact:     'M4 4h16v16H4z M22 6l-10 7L2 6',
  marketplace: 'M3 3h18v18H3z M3 9h18 M9 21V9',
  safehome:    'M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z M9 12l2 2 4-4',
  checkout:    'M2 7h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z M2 11h20 M6 15h4',
  dashboard:   'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z'
}

/* ---------- tab sets ---------- */
const publicTabs = [
  { key: 'home',    label: 'Home',    path: '/',        icon: ICONS.home },
  { key: 'login',   label: 'Login',   path: '/login',   icon: ICONS.login },
  { key: 'about',   label: 'About',   path: '/about',   icon: ICONS.about },
  { key: 'contact', label: 'Contact', path: '/contact', icon: ICONS.contact },
]

const studentTabs = [
  { key: 'home',        label: 'Home',        path: '/',                  icon: ICONS.home },
  { key: 'marketplace', label: 'Marketplace', path: '/marketplace',       icon: ICONS.marketplace },
  { key: 'safehome',    label: 'SafeHome',    path: '/safehome',          icon: ICONS.safehome },
  { key: 'checkout',    label: 'Checkout',    path: '/checkout',          icon: ICONS.checkout },
  { key: 'dashboard',   label: 'Dashboard',   path: '/student-dashboard', icon: ICONS.dashboard },
]

const adminTabs = [
  { key: 'home',        label: 'Home',        path: '/',                icon: ICONS.home },
  { key: 'marketplace', label: 'Marketplace', path: '/marketplace',     icon: ICONS.marketplace },
  { key: 'safehome',    label: 'SafeHome',    path: '/safehome',        icon: ICONS.safehome },
  { key: 'checkout',    label: 'Checkout',    path: '/checkout',        icon: ICONS.checkout },
  { key: 'dashboard',   label: 'Dashboard',   path: '/admin-dashboard', icon: ICONS.dashboard },
]

const resManagerTabs = [
  { key: 'home',      label: 'Home',      path: '/',                    icon: ICONS.home },
  { key: 'safehome',  label: 'SafeHome',  path: '/safehome',            icon: ICONS.safehome },
  { key: 'checkout',  label: 'Checkout',  path: '/checkout',            icon: ICONS.checkout },
  { key: 'dashboard', label: 'Dashboard', path: '/resmanager-dashboard', icon: ICONS.dashboard },
]

const providerTabs = [
  { key: 'home',      label: 'Home',       path: '/',                   icon: ICONS.home },
  { key: 'safehome',  label: 'SafeHome',   path: '/safehome',           icon: ICONS.safehome },
  { key: 'dashboard', label: 'Dashboard',  path: '/provider-dashboard', icon: ICONS.dashboard },
  { key: 'contact',   label: 'Contact Us', path: '/contact',            icon: ICONS.contact },
]

const visibleTabs = computed(() => {
  if (!isLoggedIn.value) return publicTabs

  const byRole = {
    student:          studentTabs,
    admin:            adminTabs,
    res_manager:      resManagerTabs,
    service_provider: providerTabs,
  }
  return byRole[currentRole.value] || studentTabs
})

/* ---------- active tab highlighting ---------- */
watch(
  () => route.path,
  (newPath) => {
    const match = [...visibleTabs.value]
      .sort((a, b) => b.path.length - a.path.length)
      .find(t => t.path === newPath || (newPath.startsWith(t.path + '/') && t.path !== '/'))
    active.value = match ? match.key : ''
  },
  { immediate: true }
)

function selectTab(tab) {
  active.value = tab.key
  router.push(tab.path)
}

/* ---------- logout ---------- */
async function handleLogoutClick() {
  await handleLogout()
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  z-index: 1000;
  border-radius: 22px;
  display: flex;
  justify-content: space-around;
  padding: 6px 10px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  background: var(--ink-elevated);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  gap: 4px;
  width: min(calc(100vw - 24px), 820px);
  max-width: 820px;
  overflow: hidden;
}

.tab {
  background: none;
  border: none;
  color: var(--text-faint);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 8px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.2s ease;
  min-width: 0;
  flex: 1 1 0;
  white-space: normal;
  text-align: center;
}

.tab:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
}

.tab svg {
  width: 18px;
  height: 18px;
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

/* logout tab — red accent so it stands out */
.logout-tab {
  color: #ff8577;
}

.logout-tab:hover {
  color: #ff8577;
  background: rgba(255, 133, 119, 0.14);
}

.logout-tab:hover svg {
  stroke: #ff8577;
}

@media (max-width: 640px) {
  .bottom-nav {
    bottom: 12px;
    padding: 5px 6px;
    border-radius: 18px;
    width: calc(100vw - 24px);
    max-width: calc(100vw - 24px);
    gap: 2px;
  }
  .tab {
    padding: 5px 2px;
    font-size: 8px;
    line-height: 1.1;
    gap: 2px;
  }
  .tab svg {
    width: 16px;
    height: 16px;
  }
}
</style>