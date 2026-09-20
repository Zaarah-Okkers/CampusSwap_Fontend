<template>
  <nav
    id="site-bottom-nav"
    class="bottom-nav glass-panel"
    :class="{ 'is-collapsed': isCollapsed }"
    :aria-hidden="isCollapsed"
    :inert="isCollapsed"
  >
    <button
      v-for="tab in visibleTabs"
      :key="`${tab.key}-${tab.path}`"
      class="tab"
      :class="{ active: active === tab.key, disabled: tab.disabled }"
      :aria-disabled="tab.disabled"
      :tabindex="tab.disabled ? -1 : 0"
      @click="selectTab(tab.key)"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path :d="tab.icon"/>
      </svg>
      <span>{{ tab.label }}</span>
    </button>
  </nav>

  <button
    class="nav-toggle"
    :class="{ 'is-collapsed': isCollapsed }"
    @click="toggleNav"
    :aria-expanded="!isCollapsed"
    aria-controls="site-bottom-nav"
    :aria-label="isCollapsed ? 'Open navigation' : 'Close navigation'"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path v-if="isCollapsed" d="M21 12V7H5a2 2 0 0 1 0-4h14v4 M3 5v14a2 2 0 0 0 2 2h16v-5 M18 12a2 2 0 0 0 0 4h4v-4Z" />
      <path v-else d="M18 6L6 18 M6 6l12 12" />
    </svg>
  </button>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { handleLogout } from '../utils/auth'

const router = useRouter()
const route = useRoute()
const store = useStore()
const active = ref('home')

const NAV_COLLAPSE_KEY = 'sidenav-collapsed'
const isCollapsed = ref(localStorage.getItem(NAV_COLLAPSE_KEY) === 'true')

function toggleNav() {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem(NAV_COLLAPSE_KEY, String(isCollapsed.value))
}

// TEMP: no real auth flag exists in the store yet.
// Set localStorage.setItem('isLoggedIn', 'true') on successful login,
// and localStorage.removeItem('isLoggedIn') on logout.
const isLoggedIn = computed(() => store.getters['user/isLoggedIn'] || localStorage.getItem('isLoggedIn') === 'true')

const publicTabs = [
  { key: 'home', label: 'Home', path: '/', icon: 'M3 9l9-7 9 7 M4 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10' },
  { key: 'about', label: 'About', path: '/about', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 16v-5 M12 8h.01' },
  { key: 'contact', label: 'Contact', path: '/contact', icon: 'M4 4h16v16H4z M22 6l-10 7L2 6' },
]

const studentTabs = [
  { key: 'marketplace', label: 'Marketplace', path: '/marketplace', icon: 'M3 3h18v18H3z M3 9h18 M9 21V9' },
  { key: 'swaps', label: 'Swaps', path: '/swap-requests', icon: 'M7 16V4 M3 8l4-4 4 4 M17 8v12 M13 16l4 4 4-4' },
  { key: 'safehome', label: 'SafeHome', path: '/safehome', icon: 'M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z M9 12l2 2 4-4' },
  { key: 'residence', label: 'Residence', path: '/student-residence', icon: 'M3 3h18v18H3z M3 9h18 M9 21V9' },
  { key: 'checkout', label: 'Checkout', path: '/checkout', icon: 'M2 7h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z M2 11h20 M6 15h4' },
  { key: 'profile', label: 'Profile', path: '/student-dashboard', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z' },
]

const providerTabs = [
  { key: 'dashboard', label: 'Dashboard', path: '/provider-dashboard', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
  { key: 'available', label: 'Available Jobs', path: '/provider-jobs/available', icon: 'M3 3h18v18H3z M3 9h18 M9 21V9' },
  { key: 'jobs', label: 'My Jobs', path: '/provider-jobs', icon: 'M3 7h18v13H3z M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' },
  { key: 'profile', label: 'Profile', path: '/provider-profile', icon: 'M20 21v-2a4 4 0 0 1-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z' }
]

const adminTabs = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
  { key: 'users', label: 'Users', path: '/admin/users', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8' },
  { key: 'premium', label: 'Premium', path: '/admin/premium', icon: 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.2l7.1-.6z' },
  { key: 'advertise', label: 'Advertise', path: '/admin/advertise', icon: 'M3 11l18-5v12L3 14v-3 M11.6 16.8L13 21H8l-2-7' },
  { key: 'promote', label: 'Promote', path: '/admin/promote', icon: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6.05 11a22.35 22.35 0 0 1-3.95 2Z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' },
  { key: 'profile', label: 'Profile', path: '/admin/profile', icon: 'M20 21v-2a4 4 0 0 1-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z' }
]

const resmanagerTabs = [
  { key: 'dashboard', label: 'Dashboard', path: '/resmanager-dashboard', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
  { key: 'safehome', label: 'SafeHome', path: '/safehome', icon: 'M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z M9 12l2 2 4-4' },
  { key: 'residence', label: 'Residence', path: '/resmanager-payments', icon: 'M3 3h18v18H3z M3 9h18 M9 21V9' },
  { key: 'profile', label: 'Profile', path: '/resmanager-profile', icon: 'M20 21v-2a4 4 0 0 1-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z' }
]

const loginTab = { key: 'login', label: 'Login', path: '/login', icon: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4 M10 17l5-5-5-5 M15 12H3' }
// Shown to every signed-in user regardless of role. `action` runs instead of
// navigating, because logging out is not a route.
const logoutTab = { key: 'logout', label: 'Logout', action: 'logout', icon: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9' }
const authenticatedPublicTabs = publicTabs.filter(tab => tab.key === 'home')

const visibleTabs = computed(() => {
  if (!isLoggedIn.value) return [...publicTabs, loginTab]
  const roleTabs = { student: studentTabs, service_provider: providerTabs, admin: adminTabs, resmanager: resmanagerTabs }
  return [...authenticatedPublicTabs, ...(roleTabs[store.getters['user/currentUser'].role] || studentTabs), logoutTab]
})

watch(() => route.path, (newPath) => {
  // Action-only tabs (e.g. Logout) have no `path`, so guard every access to it.
  // Sorting or matching on a missing path used to throw and abort app.mount().
  const tab = [...visibleTabs.value]
    .filter(t => typeof t.path === 'string')
    .sort((a, b) => b.path.length - a.path.length)
    .find(t => !t.disabled && (t.path === newPath || (t.path !== '/' && newPath.startsWith(`${t.path}/`))))
  if (tab) {
    active.value = tab.key
  }
}, { immediate: true })

function selectTab(key) {
  const tab = visibleTabs.value.find(t => t.key === key)
  if (!tab || tab.disabled) return
  if (tab.action === 'logout') {
    handleLogout()
    return
  }
  active.value = key
  router.push(tab.path)
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 50%;
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
  scrollbar-width: none;
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%);
  transition: opacity 0.3s ease 0.05s, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.bottom-nav.is-collapsed {
  opacity: 0;
  transform: translateX(-50%) translateY(24px) scale(0.94);
  pointer-events: none;
}

.bottom-nav::-webkit-scrollbar {
  display: none;
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

.tab span {
  transition: opacity 0.15s ease, max-height 0.15s ease;
  opacity: 1;
  max-height: 20px;
}

.bottom-nav.is-collapsed .tab span {
  opacity: 0;
  max-height: 0;
}

.tab.active {
  color: var(--gold);
  background: var(--gold-soft);
}

.tab.active svg {
  stroke: var(--gold);
}

.tab.disabled {
  cursor: default;
  opacity: 0.35;
  pointer-events: none;
}

.nav-toggle {
  position: fixed;
  left: 50%;
  bottom: 20px;
  z-index: 1001;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ink-elevated);
  border: 1px solid var(--glass-border);
  color: var(--text);
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  transform: translateX(-50%) translateY(-54px);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease;
}

.nav-toggle.is-collapsed {
  transform: translateX(-50%) translateY(0);
}

.nav-toggle:hover {
  background: var(--ink-soft);
}

.nav-toggle:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.nav-toggle svg {
  width: 20px;
  height: 20px;
  transition: transform 0.15s ease;
}

.nav-toggle:active svg {
  transform: scale(0.9);
}

@media (max-width: 640px) {
  .bottom-nav {
    bottom: 12px;
    padding: 5px 6px;
    border-radius: 18px;
    width: calc(100vw - 24px);
    max-width: calc(100vw - 24px);
    gap: 2px;
    justify-content: flex-start;
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
  .nav-toggle {
    width: 40px;
    height: 40px;
    bottom: 12px;
    transform: translateX(-50%) translateY(-46px);
  }
  .nav-toggle.is-collapsed {
    transform: translateX(-50%) translateY(0);
  }
  .nav-toggle svg {
    width: 18px;
    height: 18px;
  }
}

@media (min-width: 1025px) {
  .bottom-nav {
    padding: 7px 10px;
    gap: 4px;
    border-radius: 22px;
  }
  .tab {
    padding: 7px 8px;
    font-size: 10px;
  }
  .tab svg {
    width: 18px;
    height: 18px;
  }
}
</style>