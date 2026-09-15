<template>
  <div class="admin-users">
    <div class="page-header">
      <h2>👥 User Management</h2>
      <div class="header-actions">
        <input type="text" v-model="searchQuery" placeholder="Search users..." class="search-input" />
      </div>
    </div>

    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>University</th>
            <th>Status</th>
            <th>Premium</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-cell">
                <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                <div>
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td><span class="role-badge" :class="user.role">{{ getRoleDisplay(user.role) }}</span></td>
            <td>{{ user.university || 'N/A' }}</td>
            <td>
              <span class="status-dot" :class="{ online: user.online }"></span>
              {{ user.online ? 'Online' : 'Offline' }}
            </td>
            <td>
              <span v-if="user.isPremium" class="premium-badge">⭐ Premium</span>
              <span v-else class="free-badge">Free</span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="action-btn" @click="togglePremium(user.id)" :title="user.isPremium ? 'Remove Premium' : 'Make Premium'">
                  {{ user.isPremium ? '⭐' : '☆' }}
                </button>
                <button class="action-btn" @click="verifyUser(user.id)" v-if="!user.verified">✅</button>
                <button class="action-btn danger" @click="banUser(user.id)" v-if="!user.banned">🚫</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const searchQuery = ref('')

const users = computed(() => store.state.user.users || [])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(u => 
    u.name.toLowerCase().includes(query) ||
    u.email.toLowerCase().includes(query)
  )
})

function getRoleDisplay(role) {
  return store.getters['user/getRoleDisplay'](role)
}

function togglePremium(userId) {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    user.isPremium = !user.isPremium
    alert(`${user.name} is now ${user.isPremium ? '⭐ Premium' : 'Free'} user`)
  }
}

function verifyUser(userId) {
  store.commit('user/verifyUser', userId)
  alert('User verified!')
}

function banUser(userId) {
  if (confirm('Ban this user?')) {
    store.commit('user/banUser', userId)
    alert('User banned!')
  }
}
</script>

<style scoped>
.admin-users {
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

.search-input {
  padding: 8px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  color: var(--text);
  font-size: 14px;
  min-width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: var(--gold);
}

.table-container {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  overflow: hidden;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  text-align: left;
  padding: 12px 16px;
  background: rgba(255,255,255,0.03);
  color: var(--text-faint);
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
}

.users-table td {
  padding: 12px 16px;
  border-top: 1px solid var(--glass-border);
  color: var(--text);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 600;
}

.user-email {
  font-size: 12px;
  color: var(--text-muted);
}

.role-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.role-badge.student { background: rgba(108, 92, 231, 0.2); color: #6C5CE7; }
.role-badge.admin { background: rgba(255, 107, 107, 0.2); color: #FF6B6B; }
.role-badge.service_provider { background: rgba(111, 168, 255, 0.2); color: #6FA8FF; }

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b7280;
  margin-right: 6px;
}

.status-dot.online {
  background: #4ADE80;
}

.premium-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(232, 181, 77, 0.2);
  color: var(--gold);
}

.free-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255,255,255,0.05);
  color: var(--text-muted);
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255,255,255,0.1);
}

.action-btn.danger:hover {
  background: rgba(255, 107, 107, 0.2);
}
</style>
