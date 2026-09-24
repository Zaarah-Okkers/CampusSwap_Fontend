<template>
  <main class="notif-page">
    <div class="notif-shell">
      <header class="page-heading">
        <div>
          <p class="eyebrow">Notifications</p>
          <h1>Notifications</h1>
          <p class="muted">Stay up to date with activity on your account.</p>
        </div>
        <button
          v-if="unreadCount > 0"
          class="button button-secondary"
          @click="markAllRead"
        >
          Mark all as read
        </button>
      </header>

      <nav class="notif-tabs" aria-label="Filter notifications">
        <button :class="{ active: tab === 'all' }" @click="tab = 'all'">
          All<span class="tab-count">{{ all.length }}</span>
        </button>
        <button :class="{ active: tab === 'unread' }" @click="tab = 'unread'">
          Unread<span class="tab-count">{{ unreadCount }}</span>
        </button>
        <button :class="{ active: tab === 'read' }" @click="tab = 'read'">
          Read<span class="tab-count">{{ readCount }}</span>
        </button>
      </nav>

      <p v-if="loading" class="empty-state">Loading notifications…</p>
      <p v-else-if="error" class="empty-state error">{{ error }}</p>

      <section v-else-if="visible.length" class="notif-list">
        <article
          v-for="notification in visible"
          :key="notification.id"
          class="notif-card"
          :class="{ unread: !notification.is_read }"
        >
          <div class="notif-icon" :class="`icon-${notification.type}`">
            <AppIcon :name="iconFor(notification.type)" />
          </div>
          <div class="notif-body">
            <div class="notif-top">
              <strong>{{ notification.title }}</strong>
              <time>{{ formatDate(notification.created_at) }}</time>
            </div>
            <p>{{ notification.message }}</p>
            <div class="notif-actions">
              <router-link
                v-if="notification.action_url"
                class="text-button"
                :to="notification.action_url"
                @click="markRead(notification)"
              >
                View details
              </router-link>
              <button
                v-if="!notification.is_read"
                class="text-button"
                @click="markRead(notification)"
              >
                Mark as read
              </button>
            </div>
          </div>
          <span
            v-if="!notification.is_read"
            class="unread-dot"
            aria-hidden="true"
          ></span>
        </article>
      </section>

      <section v-else class="empty-state">
        <div class="empty-icon"><AppIcon name="alert" /></div>
        <h2>{{ emptyTitle }}</h2>
        <p>{{ emptyCopy }}</p>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { API_BASE } from "../services/api";
import AppIcon from "../components/AppIcon.vue";

const tab = ref("all");
const notifications = ref([]);
const loading = ref(true);
const error = ref("");

function currentUserId() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw).id : null;
  } catch {
    return null;
  }
}

async function load() {
  const uid = currentUserId();
  if (!uid) {
    error.value = "You must be logged in to view notifications.";
    loading.value = false;
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/notifications?user_id=${uid}`);
    if (!res.ok) throw new Error(`Failed (${res.status})`);
    const body = await res.json();
    notifications.value = body.data || [];
  } catch (err) {
    error.value = "Could not load notifications. " + err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(load);

const all = computed(() => notifications.value);
const unreadCount = computed(() => all.value.filter((n) => !n.is_read).length);
const readCount = computed(() => all.value.filter((n) => n.is_read).length);

const visible = computed(() => {
  if (tab.value === "unread") return all.value.filter((n) => !n.is_read);
  if (tab.value === "read") return all.value.filter((n) => n.is_read);
  return all.value;
});

const emptyTitle = computed(() => {
  if (tab.value === "unread") return "You're all caught up";
  if (tab.value === "read") return "No read notifications yet";
  return "No notifications yet";
});
const emptyCopy = computed(() => {
  if (tab.value === "unread")
    return "New activity on your account will show up here.";
  if (tab.value === "read")
    return "Notifications you've read will be kept here for reference.";
  return "You'll see order updates, requests and payment notices here as they happen.";
});

const ICONS = {
  payment: "clock",
  order: "package",
  move_out: "alert",
  residence_request: "building",
  extension: "clock",
  service: "tools",
  safety_report: "shield",
  general: "info",
};
function iconFor(type) {
  return ICONS[type] || ICONS.general;
}

function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

async function markRead(notification) {
  if (notification.is_read) return;
  try {
    const res = await fetch(
      `${API_BASE}/notifications/${notification.id}/read`,
      {
        method: "PATCH",
      },
    );
    if (res.ok) notification.is_read = true;
  } catch {
    // Leave state alone — next page load will refresh.
  }
}

async function markAllRead() {
  const uid = currentUserId();
  if (!uid) return;
  try {
    const res = await fetch(
      `${API_BASE}/notifications/read-all?user_id=${uid}`,
      {
        method: "PATCH",
      },
    );
    if (res.ok) notifications.value.forEach((n) => (n.is_read = true));
  } catch {
    // noop
  }
}
</script>

<style scoped>
.notif-page {
  background: var(--ink);
  min-height: 100vh;
  padding: 42px 24px 120px;
}
.notif-shell {
  margin: 0 auto;
  max-width: 760px;
}
.page-heading {
  align-items: end;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.eyebrow {
  color: var(--gold);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.page-heading h1 {
  color: var(--text);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  margin: 6px 0;
}
.muted {
  color: var(--text-muted);
}
.button {
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font-weight: 700;
  padding: 10px 16px;
  white-space: nowrap;
}
.button-secondary {
  background: var(--glass-strong);
  color: var(--text);
  border: 1px solid var(--glass-border);
}
.button-secondary:hover {
  background: var(--glass);
}

.notif-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--glass-border);
}
.notif-tabs button {
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font: inherit;
  font-weight: 700;
  padding: 10px 6px 12px;
}
.notif-tabs button.active {
  color: var(--gold);
  border-bottom-color: var(--gold);
}
.tab-count {
  background: var(--glass-strong);
  border-radius: 999px;
  font-size: 11px;
  padding: 1px 7px;
  color: var(--text-muted);
}
.notif-tabs button.active .tab-count {
  color: var(--gold);
  background: var(--gold-soft);
}

.notif-list {
  display: grid;
  gap: 10px;
}
.notif-card {
  position: relative;
  display: flex;
  gap: 14px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  padding: 16px;
  transition: background 0.2s ease;
}
.notif-card.unread {
  background: var(--glass-strong);
  border-color: var(--gold-soft);
}
.notif-icon {
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gold-soft);
  color: var(--gold);
}
.notif-icon.icon-move_out,
.notif-icon.icon-safety_report {
  background: rgba(255, 133, 119, 0.16);
  color: #ff8577;
}
.notif-icon.icon-service {
  background: rgba(74, 222, 128, 0.16);
  color: #4ade80;
}
.notif-icon.icon-order {
  background: rgba(111, 168, 255, 0.16);
  color: #6fa8ff;
}
.notif-body {
  flex: 1;
  min-width: 0;
}
.notif-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}
.notif-top strong {
  color: var(--text);
  font-size: 14px;
}
.notif-top time {
  color: var(--text-faint);
  font-size: 11px;
  white-space: nowrap;
}
.notif-body p {
  color: var(--text-muted);
  font-size: 13px;
  margin: 4px 0 0;
}
.notif-actions {
  display: flex;
  gap: 14px;
  margin-top: 10px;
}
.text-button {
  background: none;
  border: 0;
  color: var(--gold);
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  padding: 0;
  text-decoration: none;
}
.text-button:hover {
  text-decoration: underline;
}
.unread-dot {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}
.empty-state.error {
  color: #ff8577;
}
.empty-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: var(--glass-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-faint);
}
.empty-icon :deep(.app-icon) {
  width: 24px;
  height: 24px;
}
.empty-state h2 {
  color: var(--text);
  font-size: 1.1rem;
  margin: 0 0 6px;
}
.empty-state p {
  font-size: 13px;
  margin: 0;
}

@media (max-width: 640px) {
  .notif-page {
    padding: 24px 14px 110px;
  }
  .page-heading {
    flex-direction: column;
    align-items: start;
  }
}
</style>
