<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/UserStore'

const userStore = useUserStore()
const showNotifications = ref(false)

const unreadCount = computed(() => userStore.unreadAdminNotifications.length)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function markAsRead(id) {
  userStore.markNotificationAsRead(id)
}

function getReportStatusColor(status) {
  const colors = {
    'pending': 'var(--gold)',
    'reviewed': 'var(--mint)',
    'resolved': 'var(--sky)',
    'dismissed': 'var(--text-faint)'
  }
  return colors[status] || 'var(--text)'
}
</script>

<template>
  <div class="admin-notifications" v-if="userStore.currentUser.role === 'admin'">
    <button class="notif-btn" @click="toggleNotifications">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span class="notif-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
    </button>
    
    <div class="notif-dropdown" v-if="showNotifications">
      <div class="notif-header">
        <h4>Admin Reports</h4>
        <span class="notif-count">{{ unreadCount }} unread</span>
      </div>
      <div class="notif-list">
        <div v-if="userStore.adminNotifications.length === 0" class="notif-empty">
          <p>No reports yet</p>
        </div>
        <div 
          v-for="notif in userStore.adminNotifications" 
          :key="notif.id"
          class="notif-item"
          :class="{ read: notif.read }"
          @click="markAsRead(notif.id)"
        >
          <div class="notif-icon">🚨</div>
          <div class="notif-content">
            <div class="notif-message">{{ notif.message }}</div>
            <div class="notif-details">
              <span class="notif-time">{{ new Date(notif.timestamp).toLocaleString() }}</span>
              <span class="notif-status" :style="{ color: getReportStatusColor(notif.report.status) }">
                {{ notif.report.status }}
              </span>
            </div>
            <div class="notif-report-details" v-if="!notif.read">
              <div><strong>Reason:</strong> {{ notif.report.reason }}</div>
              <div><strong>From:</strong> {{ notif.report.reporterName }}</div>
              <div><strong>Against:</strong> {{ notif.report.reportedUserName }}</div>
              <div v-if="notif.report.details"><strong>Details:</strong> {{ notif.report.details }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

.notif-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  width: 400px;
  max-height: 500px;
  background: var(--ink-elevated);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 100;
}

.notif-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notif-header h4 {
  font-size: 16px;
  color: var(--text);
  margin: 0;
}

.notif-count {
  font-size: 12px;
  color: var(--text-muted);
}

.notif-list {
  max-height: 400px;
  overflow-y: auto;
}

.notif-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
}

.notif-item {
  padding: 12px 20px;
  border-bottom: 1px solid var(--glass-border);
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  gap: 12px;
}

.notif-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.notif-item.read {
  opacity: 0.6;
}

.notif-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-message {
  font-size: 14px;
  color: var(--text);
  font-weight: 600;
}

.notif-details {
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-faint);
}

.notif-status {
  font-weight: 600;
  text-transform: uppercase;
}

.notif-report-details {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.notif-report-details div {
  margin-bottom: 2px;
}

@media (max-width: 640px) {
  .notif-dropdown {
    width: 320px;
    right: -100px;
  }
}
</style>