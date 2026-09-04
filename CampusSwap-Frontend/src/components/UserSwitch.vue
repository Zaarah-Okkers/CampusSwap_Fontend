<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/UserStore'

const router = useRouter()
const userStore = useUserStore()

const showDropdown = ref(false)

// Quick user roles for easy switching
const quickUsers = [
  { 
    id: 1, 
    name: 'Zaarah K.', 
    role: 'student', 
    avatar: 'https://placehold.co/100x100/6C5CE7/FFFFFF?text=Z',
    emoji: '🎓',
    color: '#6C5CE7'
  },
  { 
    id: 5, 
    name: 'Admin User', 
    role: 'admin', 
    avatar: 'https://placehold.co/100x100/FF6B6B/FFFFFF?text=A',
    emoji: '👑',
    color: '#FF6B6B'
  },
  { 
    id: 6, 
    name: 'ServicePro SA', 
    role: 'service_provider', 
    avatar: 'https://placehold.co/100x100/6FA8FF/FFFFFF?text=SP',
    emoji: '🔧',
    color: '#6FA8FF'
  }
]

const currentUserDisplay = computed(() => {
  const user = userStore.currentUser
  const quickUser = quickUsers.find(u => u.id === user.id)
  return {
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    emoji: quickUser?.emoji || '👤',
    color: quickUser?.color || '#6C5CE7',
    roleDisplay: userStore.getRoleDisplay(user.role)
  }
})

function switchToUser(userId) {
  const success = userStore.switchUser(userId)
  if (success) {
    showDropdown.value = false
    const user = userStore.currentUser
    
    // Redirect based on role
    if (user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/')
    }
    
    // Show quick feedback
    console.log(`✅ Switched to ${user.name} (${userStore.getRoleDisplay(user.role)})`)
  }
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function getRoleEmoji(role) {
  const emojis = {
    'student': '🎓',
    'admin': '👑',
    'service_provider': '🔧'
  }
  return emojis[role] || '👤'
}

function getRoleColor(role) {
  const colors = {
    'student': '#6C5CE7',
    'admin': '#FF6B6B',
    'service_provider': '#6FA8FF'
  }
  return colors[role] || '#6C5CE7'
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
          {{ currentUserDisplay.emoji }} {{ currentUserDisplay.roleDisplay }}
        </span>
      </div>
      <svg class="dropdown-arrow" :class="{ open: showDropdown }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <!-- Dropdown -->
    <div v-if="showDropdown" class="dropdown-menu glass-panel">
      <div class="dropdown-header">
        <span class="dropdown-title">🔄 Switch User</span>
        <span class="dropdown-hint">(Testing Only)</span>
      </div>
      
      <!-- Quick Switch Users -->
      <div 
        v-for="user in quickUsers" 
        :key="user.id"
        class="dropdown-item"
        :class="{ active: userStore.currentUser.id === user.id }"
        @click="switchToUser(user.id)"
      >
        <div class="dropdown-item-avatar">
          <img :src="user.avatar" :alt="user.name" />
        </div>
        <div class="dropdown-item-info">
          <span class="dropdown-item-name">{{ user.name }}</span>
          <span class="dropdown-item-role" :style="{ color: user.color }">
            {{ user.emoji }} {{ userStore.getRoleDisplay(user.role) }}
          </span>
        </div>
        <span v-if="userStore.currentUser.id === user.id" class="active-badge">✓</span>
        <span v-else class="switch-hint">→</span>
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
  font-size: 10px;
  font-weight: 500;
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
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
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
  font-size: 11px;
  font-weight: 500;
}

.active-badge {
  font-size: 16px;
  color: var(--gold);
  font-weight: 700;
}

.switch-hint {
  font-size: 14px;
  color: var(--text-faint);
  opacity: 0.5;
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