<template>
  <button
    class="notif-bell"
    :class="{ 'has-unread': unreadCount > 0 }"
    aria-label="Notifications"
    :aria-describedby="unreadCount > 0 ? 'notif-bell-count' : undefined"
    @click="goToNotifications"
  >
    <AppIcon name="alert" :decorative="false" />
    <span v-if="unreadCount > 0" id="notif-bell-count" class="notif-badge">
      {{ displayCount }}
    </span>
  </button>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { API_BASE } from "../services/api";
import AppIcon from "./AppIcon.vue";

const router = useRouter();
const unreadCount = ref(0);
let pollTimer = null;

function currentUserId() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw).id : null;
  } catch {
    return null;
  }
}

async function fetchUnread() {
  const uid = currentUserId();
  if (!uid) {
    unreadCount.value = 0;
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/notifications?user_id=${uid}&limit=1`);
    if (!res.ok) return;
    const body = await res.json();
    unreadCount.value = body.unread || 0;
  } catch {
    // Offline / backend down — keep the last known count.
  }
}

onMounted(() => {
  fetchUnread();
  // Poll every 30 s so the badge stays reasonably fresh without a websocket.
  pollTimer = setInterval(fetchUnread, 30000);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});

function goToNotifications() {
  router.push("/notifications");
}

const displayCount = computed(() =>
  unreadCount.value > 9 ? "9+" : unreadCount.value,
);
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
  transition:
    background 0.2s ease,
    transform 0.15s ease;
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
  background: var(--coral, #ff8577);
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
