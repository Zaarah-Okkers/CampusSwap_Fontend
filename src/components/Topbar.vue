<template>
  <header class="top-bar">
    <div class="top-left">
      <router-link to="/" class="brand-link">
        <h2 class="brand">
          CampusSwap<span class="green-text">SA</span>
        </h2>
      </router-link>
    </div>

    <div class="top-center">
      <div class="search-wrap">
        <span class="search-icon">&#128269;</span>
        <input
          type="text"
          class="search-input"
          placeholder="Search books, services, and more..."
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <div class="top-right" v-if="isLoggedIn">
      <button class="notification-bell" @click="notifyClick" aria-label="Notifications">
        <span class="bell-icon">&#128276;</span>
        <span class="notification-dot"></span>
      </button>
      <button class="avatar-btn" @click="handleAvatarClick" aria-label="Account menu">
        <span class="avatar">{{ initials }}</span>
      </button>
    </div>

    <div class="top-right" v-else>
      <router-link to="/login" class="login-link">Login</router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')

const LOGOUT_MESSAGES = {
  student:          'Session terminated. Go touch grass.',
  service_provider: 'Mission accomplished. Over and Out chief.',
  admin:            'God mode disabled.',
  res_manager:      'Game saved. Player 1 has left the lobby.'
}

/* ---------- reactive auth state (this is the fix) ---------- */
const currentUser = ref(null)

function readAuthState() {
  const raw = localStorage.getItem('user')
  currentUser.value = raw ? JSON.parse(raw) : null
}

onMounted(readAuthState)
watch(() => route.path, readAuthState)

const isLoggedIn = computed(() => !!currentUser.value)

const initials = computed(() => {
  const name = currentUser.value?.full_name
  if (!name) return 'U'
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

function handleSearch() {
  const q = searchQuery.value.trim()
  if (!q) return
  router.push({ path: '/marketplace', query: { q } })
}

function notifyClick() {
  Swal.fire({
    icon: 'info',
    title: 'Notifications',
    text: 'You have 3 new notifications.',
    timer: 1500,
    showConfirmButton: false,
  })
}

async function handleAvatarClick() {
  const user = currentUser.value
  if (!user) return

  const result = await Swal.fire({
    title: 'Logout?',
    text: `Log out as ${user.full_name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
  })

  if (result.isConfirmed) {
    const msg = LOGOUT_MESSAGES[user.role] || 'Logged out.'

    // clear all session keys
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')

    await Swal.fire({
      icon: 'success',
      title: msg,
      timer: 1800,
      showConfirmButton: false,
    })

    // hard redirect — guarantees full reset
    window.location.href = '/'
  }
}
</script>

<style scoped>
.top-bar {
  background-color: #0a0e27;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  flex-wrap: wrap;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
}

.brand {
  color: #fff;
  font-size: 22px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.brand .green-text,
.green-text {
  color: #2e7d5a;
}

.top-center {
  flex: 1;
  min-width: 160px;
  max-width: 520px;
}

.search-wrap {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.search-wrap:hover,
.search-wrap:focus-within {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(232, 181, 77, 0.4);
}

.search-icon {
  color: #9ca3af;
  font-size: 16px;
  margin-right: 10px;
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  padding: 8px 0;
  width: 100%;
  font-family: inherit;
}

.search-input::placeholder {
  color: #9ca3af;
  font-weight: 300;
}

.top-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 15px;
}

.notification-bell {
  position: relative;
  cursor: pointer;
  font-size: 24px;
  color: #fff;
  background: none;
  border: none;
  padding: 0;
  transition: color 0.3s ease;
}

.notification-bell:hover {
  color: #e8b54d;
}

.notification-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background-color: #ff4d4f;
  border-radius: 50%;
  border: 2px solid #0a0e27;
}

.avatar-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.avatar-btn:hover {
  transform: scale(1.08);
}

.avatar {
  background-color: #e8b54d;
  color: #0a0e27;
  font-weight: 700;
  font-size: 14px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-link {
  color: #e8b54d;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  padding: 8px 18px;
  border: 2px solid #e8b54d;
  border-radius: 20px;
  transition: background 0.25s ease, color 0.25s ease;
}

.login-link:hover {
  background: #e8b54d;
  color: #0a0e27;
}

@media (max-width: 768px) {
  .top-bar {
    padding: 10px 16px;
    gap: 10px;
  }
  .brand {
    font-size: 18px;
  }
  .top-center {
    order: 3;
    flex-basis: 100%;
    max-width: 100%;
  }
  .search-input {
    font-size: 13px;
  }
}
</style>