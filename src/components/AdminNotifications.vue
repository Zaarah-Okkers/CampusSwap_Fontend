<template>
  <div class="admin-notifications" v-if="isAdmin">
    <button class="notif-btn" @click="toggleNotifications">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span class="notif-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const showNotifications = ref(false)

const currentUser = computed(() => store.state.user.currentUser)
const adminNotifications = computed(() => store.state.user.adminNotifications || [])
const isAdmin = computed(() => currentUser.value?.role === 'admin')

const unreadCount = computed(() => {
  return adminNotifications.value.filter(n => !n.read).length
})

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}
</script>

<style scoped>
.admin-notifications {
  position: relative;
}

.notif-btn {
  position: relative;
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.notif-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notif-btn svg {
  width: 24px;
  height: 24px;
}

.notif-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--coral);
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
