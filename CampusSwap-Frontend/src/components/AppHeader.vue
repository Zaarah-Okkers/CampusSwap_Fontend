<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-row">
        <span class="brand-name">CampusSwap<span class="dot">.</span></span>
        <div class="header-actions">
          <div class="user-switcher" @click.stop>
            <button class="user-btn" @click="toggleUserDropdown">
              <div class="user-avatar-container">
                <img :src="currentUser.avatar" :alt="currentUser.name" class="user-avatar" />
                <span class="role-indicator" :style="{ background: getRoleColor(currentUser.role) }">
                  {{ currentUser.role.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="user-info">
                <span class="user-name">{{ currentUser.name }}</span>
                <span class="user-role" :style="{ color: getRoleColor(currentUser.role) }">
                  {{ getRoleDisplay(currentUser.role) }}
                </span>
              </div>
              <svg class="dropdown-arrow" :class="{ open: showUserDropdown }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div v-if="showUserDropdown" class="dropdown-menu">
              <div v-for="user in users" :key="user.id" class="dropdown-item" @click="switchToUser(user.id)">
                <img :src="user.avatar" :alt="user.name" class="dropdown-avatar" />
                <span>{{ user.name }}</span>
                <span class="role-badge">{{ getRoleDisplay(user.role) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!hideSearch" class="search-row">
        <div class="search-box">
          <input
            :value="search"
            @input="$emit('update:search', $event.target.value)"
            type="text"
            placeholder="Search textbooks, tech, rentals..."
          />
        </div>
        <button class="filter-btn" @click="$emit('open-filters')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

defineProps({
  search: String,
  hideSearch: Boolean
})

defineEmits(['update:search', 'open-filters'])

const store = useStore()
const router = useRouter()
const showUserDropdown = ref(false)

const currentUser = computed(() => store.state.user.currentUser)
const users = computed(() => store.state.user.users)

function getRoleDisplay(role) {
  return store.getters['user/getRoleDisplay'](role)
}

function getRoleColor(role) {
  return store.getters['user/getRoleColor'](role)
}

function toggleUserDropdown() {
  showUserDropdown.value = !showUserDropdown.value
}

function switchToUser(userId) {
  store.dispatch('user/switchUser', userId)
  showUserDropdown.value = false

  const newUser = store.state.user.users.find(u => u.id === userId)
  if (newUser?.role === 'admin') {
    router.push('/admin')
  } else if (router.currentRoute.value.path.startsWith('/admin')) {
    // Switching away from admin while inside the admin section — go home
    router.push('/')
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--ink-elevated);
  border-bottom: 1px solid var(--glass-border);
  padding: 12px 16px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.brand-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
}

.dot {
  color: var(--gold);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-row {
  display: flex;
  gap: 8px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: rgba(255,255,255,0.05);
}

.search-box input {
  width: 100%;
  background: none;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 14px;
}

.filter-btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: rgba(255,255,255,0.05);
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-btn svg {
  width: 18px;
  height: 18px;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 6px 12px;
  cursor: pointer;
  color: var(--text);
}

.user-avatar-container {
  position: relative;
  width: 32px;
  height: 32px;
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
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: var(--ink-elevated);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(255,255,255,0.05);
}

.dropdown-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-switcher {
  position: relative;
}

.role-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.1);
  color: var(--text-muted);
  margin-left: auto;
}
</style>