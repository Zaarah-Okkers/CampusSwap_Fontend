<template>
  <div class="admin-premium">
    <div class="page-header">
      <h2>⭐ Premium Users</h2>
      <span class="count">{{ premiumUsers.length }} Premium Users</span>
    </div>

    <div v-if="premiumUsers.length === 0" class="empty-state">
      <span class="empty-icon">⭐</span>
      <h3>No Premium Users Yet</h3>
      <p>Upgrade users to premium to see them here</p>
    </div>

    <div v-else class="premium-grid">
      <div v-for="user in premiumUsers" :key="user.id" class="premium-card glass-panel">
        <div class="premium-header">
          <img :src="user.avatar" :alt="user.name" class="premium-avatar" />
          <div class="premium-user-info">
            <div class="premium-name">{{ user.name }}</div>
            <div class="premium-role">{{ getRoleDisplay(user.role) }}</div>
          </div>
          <span class="premium-badge">⭐ Premium</span>
        </div>
        <div class="premium-details">
          <div class="detail-item">
            <span class="detail-label">📧 Email</span>
            <span class="detail-value">{{ user.email }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">🏛️ University</span>
            <span class="detail-value">{{ user.university || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">📅 Joined</span>
            <span class="detail-value">{{ formatDate(user.joined) }}</span>
          </div>
        </div>
        <div class="premium-actions">
          <button class="action-btn" @click="removePremium(user.id)">Remove Premium</button>
          <button class="action-btn secondary" @click="viewUser(user.id)">View Profile</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const users = computed(() => store.state.user.users || [])
const premiumUsers = computed(() => users.value.filter(u => u.isPremium))

function getRoleDisplay(role) {
  return store.getters['user/getRoleDisplay'](role)
}

function formatDate(date) {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
}

function removePremium(userId) {
  if (confirm('Remove premium status from this user?')) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.isPremium = false
      alert('Premium status removed!')
    }
  }
}

function viewUser(userId) {
  alert(`Viewing user ${userId}`)
}
</script>

<style scoped>
.admin-premium {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  color: var(--text);
  margin: 0;
}

.count {
  color: var(--gold);
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.empty-state h3 {
  color: var(--text);
  margin: 0 0 4px;
}

.empty-state p {
  color: var(--text-muted);
}

.premium-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.premium-card {
  padding: 20px;
  border-radius: 12px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
}

.premium-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.premium-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.premium-user-info {
  flex: 1;
}

.premium-name {
  font-weight: 600;
  color: var(--text);
}

.premium-role {
  font-size: 12px;
  color: var(--text-muted);
}

.premium-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(232, 181, 77, 0.2);
  color: var(--gold);
}

.premium-details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
}

.detail-label {
  color: var(--text-muted);
}

.detail-value {
  color: var(--text);
}

.premium-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.02);
}

.action-btn.secondary {
  background: rgba(255,255,255,0.05);
  color: var(--text);
  border: 1px solid var(--glass-border);
}

.action-btn.secondary:hover {
  background: rgba(255,255,255,0.1);
}
</style>
