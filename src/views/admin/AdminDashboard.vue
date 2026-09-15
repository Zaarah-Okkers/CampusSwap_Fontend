<template>
  <div class="admin-dashboard">
    <div class="page-header">
      <h1>📊 Dashboard</h1>
      <p>Welcome to the Admin Panel</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">👥</div>
        <div class="stat-info">
          <span class="stat-number">{{ users.length }}</span>
          <span class="stat-label">Total Users</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gold">⭐</div>
        <div class="stat-info">
          <span class="stat-number">{{ premiumUsers.length }}</span>
          <span class="stat-label">Premium Users</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">📦</div>
        <div class="stat-info">
          <span class="stat-number">12</span>
          <span class="stat-label">Total Listings</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">🚨</div>
        <div class="stat-info">
          <span class="stat-number">0</span>
          <span class="stat-label">Pending Reports</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const users = computed(() => store.state.user?.users || [])
const premiumUsers = computed(() => users.value.filter(u => u.isPremium))
</script>

<style scoped>
.admin-dashboard {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  color: #1a1a2e;
  margin: 0;
}

.page-header p {
  color: #6b7280;
  margin: 4px 0 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.stat-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-icon.blue { background: #EBF5FF; }
.stat-icon.gold { background: #FFFBEB; }
.stat-icon.green { background: #ECFDF5; }
.stat-icon.red { background: #FEF2F2; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}
</style>
