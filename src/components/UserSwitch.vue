<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const store = useStore()
const router = useRouter()

const showDropdown = ref(false)

// Quick user roles for easy switching
const quickUsers = [
  {
    id: 'logged-out',
    name: 'Logged out viewer',
    role: 'logged_out',
    avatar: 'https://placehold.co/100x100/64748B/FFFFFF?text=G',
    color: '#94A3B8'
  },
  {
    id: 1,
    name: 'Zaarah K.',
    role: 'student',
    avatar: 'https://placehold.co/100x100/6C5CE7/FFFFFF?text=Z',
    color: '#6C5CE7'
  },
  {
    id: 5,
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://placehold.co/100x100/FF6B6B/FFFFFF?text=A',
    color: '#FF6B6B'
  },
  {
    id: 6,
    name: 'ServicePro SA',
    role: 'service_provider',
    avatar: 'https://placehold.co/100x100/6FA8FF/FFFFFF?text=SP',
    color: '#6FA8FF'
  },
  {
    id: 9,
    name: 'Residence Manager',
    role: 'res_manager',
    avatar: 'https://placehold.co/100x100/4ADE80/FFFFFF?text=RM',
    color: '#4ADE80'
  }
]

const currentUser = computed(() => store.getters['user/currentUser'])

function getRoleDisplay(role) {
  return store.getters['user/getRoleDisplay'](role)
}

const currentUserDisplay = computed(() => {
  const user = currentUser.value
  const viewer = quickUsers.find(option => option.id === user.id)
  return {
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    color: viewer?.color || '#6C5CE7',
    roleDisplay: user.role === 'logged_out' ? 'Public viewer' : getRoleDisplay(user.role)
  }
})

async function switchToUser(userId) {
  if (userId === 'logged-out') {
    const role = currentUser.value?.role
    const logoutMessages = {
      student: 'Session terminated. Go touch grass.',
      service_provider: 'Mission accomplished. Over and Out chief.',
      admin: 'God mode disabled.',
      res_manager: 'Game saved. Player 1 has left the lobby.',
      resmanager: 'Game saved. Player 1 has left the lobby.'
    }
    await store.dispatch('user/logout')
    showDropdown.value = false
    await Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: logoutMessages[role] || 'You have been logged out successfully.',
      timer: 1800,
      showConfirmButton: false
    })
    await router.push('/')
    return
  }

  const success = await store.dispatch('user/switchUser', userId)
  if (success) {
    showDropdown.value = false
    const user = currentUser.value
    await router.push('/')

    console.log(`Switched to ${user.name} (${getRoleDisplay(user.role)})`)
  }
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}
</script>

<template>
  <div class="user-switcher" @click.stop>
    <!-- Current User Button -->
    <button class="user-btn" @click="toggleDropdown" aria-label="Switch user">
      <div class="user-avatar-container">
        <img :src="currentUserDisplay.avatar" :alt="currentUserDisplay.name" class="user-avatar" />
        <span class="role-indicator" :style="{ background: currentUserDisplay.color }">
          {{ currentUserDisplay.role.charAt(0).toUpperCase() }}
        </span>
      </div>
      <div class="user-info">
        <span class="user-name">{{ currentUserDisplay.name }}</span>
        <span class="user-role" :style="{ color: currentUserDisplay.color }">
          <!-- role icon -->
          <svg v-if="currentUserDisplay.role === 'student'" class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>
          <svg v-else-if="currentUserDisplay.role === 'admin'" class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z"/></svg>
          <svg v-else-if="currentUserDisplay.role === 'service_provider'" class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></svg>
          <svg v-else class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
          {{ currentUserDisplay.roleDisplay }}
        </span>
      </div>
      <svg class="dropdown-arrow" :class="{ open: showDropdown }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <!-- Dropdown -->
    <div v-if="showDropdown" class="dropdown-menu glass-panel">
      <div class="dropdown-header">
        <span class="dropdown-title">
          <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          Switch User
        </span>
        <span class="dropdown-hint">(Testing Only)</span>
      </div>

      <!-- Quick Switch Users -->
      <div
        v-for="user in quickUsers"
        :key="user.id"
        class="dropdown-item"
        :class="{ active: currentUser.id === user.id }"
        @click="switchToUser(user.id)"
      >
        <div class="dropdown-item-avatar">
          <img :src="user.avatar" :alt="user.name" />
        </div>
        <div class="dropdown-item-info">
          <span class="dropdown-item-name">{{ user.name }}</span>
          <span class="dropdown-item-role" :style="{ color: user.color }">
            <svg v-if="user.role === 'student'" class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>
            <svg v-else-if="user.role === 'admin'" class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z"/></svg>
            <svg v-else-if="user.role === 'service_provider'" class="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></svg>
            {{ getRoleDisplay(user.role) }}
          </span>
        </div>
        <svg v-if="currentUser.id === user.id" class="active-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else class="switch-hint" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-switcher {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 6px 12px 6px 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text);
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--gold);
}

.user-avatar-container {
  position: relative;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.role-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--ink-elevated);
  font-size: 7px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.user-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
}

.user-role {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 500;
}

.role-icon {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  color: var(--text-faint);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: var(--ink-elevated);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px 10px;
  border-bottom: 1px solid var(--glass-border);
}

.dropdown-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.header-icon {
  width: 14px;
  height: 14px;
  color: var(--gold);
}

.dropdown-hint {
  font-size: 10px;
  color: var(--text-faint);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 2px 0;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.dropdown-item.active {
  background: rgba(232, 181, 77, 0.12);
  border: 1px solid rgba(232, 181, 77, 0.2);
}

.dropdown-item-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.dropdown-item-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dropdown-item-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.dropdown-item-role {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
}

.active-badge {
  width: 16px;
  height: 16px;
  color: var(--gold);
  flex-shrink: 0;
}

.switch-hint {
  width: 14px;
  height: 14px;
  color: var(--text-faint);
  opacity: 0.5;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .user-btn {
    padding: 4px 8px 4px 4px;
  }

  .user-avatar-container {
    width: 28px;
    height: 28px;
  }

  .role-indicator {
    width: 12px;
    height: 12px;
    font-size: 6px;
  }

  .user-name {
    font-size: 11px;
  }

  .user-role {
    font-size: 9px;
  }

  .dropdown-menu {
    min-width: 200px;
    right: -40px;
  }
}
</style>
