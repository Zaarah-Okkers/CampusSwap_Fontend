<template>
  <button
    class="notif-bell"
    :class="{ 'has-unread': unreadCount > 0 }"
    aria-label="Notifications"
    :aria-describedby="unreadCount > 0 ? 'notif-bell-count' : undefined"
    @click="goToNotifications"
  >
    <AppIcon name="alert" :decorative="false" />
    <span v-if="unreadCount > 0" id="notif-bell-count" class="notif-badge">{{ displayCount }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AppIcon from './AppIcon.vue'

const router = useRouter()
const store = useStore()

const currentUser = computed(() => store.getters['user/currentUser'])
const unreadCount = computed(() => store.getters['notifications/unreadCountForUser'](currentUser.value?.id))
const displayCount = computed(() => (unreadCount.value > 9 ? '9+' : unreadCount.value))

function goToNotifications() {
  router.push('/notifications')
}
</script>

<style scoped>
.notif-bell {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 1000;
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
  transition: background 0.2s ease, transform 0.15s ease;
}

.notif-bell:hover {
  background: var(--ink-soft);
}

.notif-bell:active {
  transform: scale(0.94);
}

.notif-bell:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.notif-bell .app-icon {
  width: 20px;
  height: 20px;
}

.notif-bell.has-unread .app-icon {
  color: var(--gold);
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--coral);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--ink);
}

@media (max-width: 640px) {
  .notif-bell {
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
  }
}
</style>
