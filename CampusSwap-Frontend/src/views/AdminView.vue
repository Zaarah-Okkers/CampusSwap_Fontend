<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/UserStore'

const router = useRouter()
const userStore = useUserStore()

// Admin stats
const stats = ref({
  totalUsers: 0,
  totalListings: 0,
  totalReports: 0,
  pendingReports: 0,
  activeUsers: 0,
  totalChats: 0
})

// Active tab
const activeTab = ref('dashboard')

// Sample listings data (would come from API)
const listings = ref([
  { id: 1, name: 'HP EliteBook 840 G5', type: 'sell', price: 4500, seller: 'Thabo M.', status: 'active', reported: false },
  { id: 2, name: 'University Physics Book', type: 'swap', seller: 'Aisha K.', status: 'active', reported: false },
  { id: 3, name: 'Anti-Theft Laptop Bag', type: 'rent', price: 40, seller: 'Liam P.', status: 'pending', reported: false },
  { id: 4, name: 'Sony ANC Headphones', type: 'sell', price: 1800, seller: 'Naledi S.', status: 'active', reported: true },
  { id: 5, name: 'Casio Scientific Calculator', type: 'sell', price: 220, seller: 'Sipho D.', status: 'active', reported: false },
  { id: 6, name: 'Desk Lamp with USB Port', type: 'sell', price: 180, seller: 'Karabo N.', status: 'inactive', reported: false }
])

// Sample reported items
const reportedItems = ref([
  { id: 1, itemName: 'Sony ANC Headphones', reportedBy: 'User123', reason: 'Fake product', status: 'pending', date: '2024-01-15' },
  { id: 2, itemName: 'iPhone 12', reportedBy: 'User456', reason: 'Scam', status: 'reviewed', date: '2024-01-14' }
])

// Sample recent activity
const recentActivity = ref([
  { id: 1, user: 'Thabo M.', action: 'Listed HP EliteBook 840 G5', time: '2 minutes ago', type: 'listing' },
  { id: 2, user: 'Aisha K.', action: 'Completed swap with Liam P.', time: '15 minutes ago', type: 'swap' },
  { id: 3, user: 'Admin', action: 'Reviewed report #1234', time: '1 hour ago', type: 'admin' },
  { id: 4, user: 'Naledi S.', action: 'Reported item Sony ANC Headphones', time: '2 hours ago', type: 'report' }
])

// Check if user is admin
const isAdmin = computed(() => {
  return userStore.currentUser.role === 'admin'
})

// Redirect if not admin
onMounted(() => {
  // Update stats regardless
  stats.value.totalUsers = userStore.users.length
  stats.value.totalReports = userStore.adminNotifications.length
  stats.value.pendingReports = userStore.adminNotifications.filter(n => !n.read).length
  stats.value.totalListings = listings.value.length
  stats.value.activeUsers = userStore.users.filter(u => u.online).length
  stats.value.totalChats = 4 // Sample data
  
  // Only redirect if not admin and not in development mode
  if (!isAdmin.value) {
    // Instead of alert, show a message in the UI
    // and redirect after a moment
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }
})

// Toggle listing status
function toggleListingStatus(listing) {
  listing.status = listing.status === 'active' ? 'inactive' : 'active'
}

// Delete listing
function deleteListing(listingId) {
  if (confirm('Are you sure you want to delete this listing?')) {
    listings.value = listings.value.filter(l => l.id !== listingId)
    stats.value.totalListings = listings.value.length
  }
}

// Resolve report
function resolveReport(reportId) {
  const report = reportedItems.value.find(r => r.id === reportId)
  if (report) {
    report.status = 'resolved'
  }
}

// Dismiss report
function dismissReport(reportId) {
  if (confirm('Are you sure you want to dismiss this report?')) {
    reportedItems.value = reportedItems.value.filter(r => r.id !== reportId)
  }
}

// Ban user
function banUser(userId) {
  if (confirm('Are you sure you want to ban this user?')) {
    const user = userStore.users.find(u => u.id === userId)
    if (user) {
      user.banned = true
      alert(`${user.name} has been banned.`)
    }
  }
}

// Verify user
function verifyUser(userId) {
  const user = userStore.users.find(u => u.id === userId)
  if (user) {
    user.verified = true
    alert(`${user.name} has been verified.`)
  }
}

// Get role badge color
function getRoleColor(role) {
  const colors = {
    'student': 'var(--violet)',
    'admin': 'var(--coral)',
    'service_provider': 'var(--sky)'
  }
  return colors[role] || 'var(--text)'
}

// Get status badge color
function getStatusColor(status) {
  const colors = {
    'active': 'var(--mint)',
    'pending': 'var(--gold)',
    'inactive': 'var(--text-faint)',
    'reported': 'var(--coral)',
    'reviewed': 'var(--sky)',
    'resolved': 'var(--mint)',
    'dismissed': 'var(--text-faint)'
  }
  return colors[status] || 'var(--text)'
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Get report details from store
const reports = computed(() => {
  return userStore.adminNotifications.map(n => ({
    id: n.id,
    reporterName: n.report.reporterName,
    reportedUserName: n.report.reportedUserName,
    reason: n.report.reason,
    details: n.report.details,
    status: n.read ? 'reviewed' : 'pending',
    timestamp: n.timestamp,
    chatMessages: n.report.chatMessages || []
  }))
})

// Export data function
function exportData() {
  const data = {
    users: userStore.users,
    listings: listings.value,
    reports: reports.value,
    stats: stats.value,
    exportedAt: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `campusswap-admin-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Get icon for activity type
function getActivityIcon(type) {
  const icons = {
    'listing': '📦',
    'swap': '🔄',
    'report': '🚨',
    'admin': '👑'
  }
  return icons[type] || '📋'
}
</script>

<template>
  <div class="admin-page">
    <!-- Access Denied Message -->
    <div v-if="!isAdmin" class="access-denied glass-panel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lock-icon">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <h2>Access Denied</h2>
      <p>Admin privileges required to view this page.</p>
      <p class="hint">Please switch to an admin account using the user switcher in the header.</p>
      <button class="go-back-btn" @click="router.push('/')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Go Back Home
      </button>
    </div>

    <!-- Admin Content -->
    <template v-else>
      <div class="admin-header">
        <div class="admin-header-content">
          <div class="admin-title">
            <h1>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="admin-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin Dashboard
            </h1>
            <p>Manage CampusSwap platform, users, listings, and reports</p>
          </div>
          <button class="export-btn" @click="exportData">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Data
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card glass-panel">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">Total Users</span>
          </div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalListings }}</span>
            <span class="stat-label">Total Listings</span>
          </div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalReports }}</span>
            <span class="stat-label">Total Reports</span>
          </div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-icon" style="color: var(--gold);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value" style="color: var(--gold);">{{ stats.pendingReports }}</span>
            <span class="stat-label">Pending Reports</span>
          </div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-icon" style="color: var(--mint);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.activeUsers }}</span>
            <span class="stat-label">Active Users</span>
          </div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalChats }}</span>
            <span class="stat-label">Active Chats</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="admin-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'dashboard' }"
          @click="activeTab = 'dashboard'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
          </svg>
          Dashboard
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Users
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'listings' }"
          @click="activeTab = 'listings'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          Listings
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'reports' }"
          @click="activeTab = 'reports'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Reports
          <span class="badge" v-if="stats.pendingReports > 0">{{ stats.pendingReports }}</span>
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'activity' }"
          @click="activeTab = 'activity'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          Activity
        </button>
      </div>

      <!-- Dashboard Tab -->
      <div v-if="activeTab === 'dashboard'" class="tab-content">
        <div class="dashboard-grid">
          <!-- Recent Activity -->
          <div class="dashboard-card glass-panel">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Recent Activity
            </h3>
            <div class="activity-list">
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                <div class="activity-icon" :class="activity.type">
                  {{ getActivityIcon(activity.type) }}
                </div>
                <div class="activity-content">
                  <span class="activity-user">{{ activity.user }}</span>
                  <span class="activity-action">{{ activity.action }}</span>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="dashboard-card glass-panel">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="22 3 22 15 16 17 12 15 8 17 2 15 2 3 8 5 12 3 16 5 22 3"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
                <line x1="8" y1="5" x2="8" y2="17"/>
                <line x1="16" y1="5" x2="16" y2="17"/>
              </svg>
              Quick Actions
            </h3>
            <div class="quick-actions">
              <button class="action-btn" @click="activeTab = 'users'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Manage Users
              </button>
              <button class="action-btn" @click="activeTab = 'listings'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                Manage Listings
              </button>
              <button class="action-btn" @click="activeTab = 'reports'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                View Reports
              </button>
              <button class="action-btn" @click="exportData">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export Data
              </button>
            </div>
          </div>

          <!-- System Status -->
          <div class="dashboard-card glass-panel">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              System Status
            </h3>
            <div class="system-status">
              <div class="status-item">
                <span class="status-label">Platform Status</span>
                <span class="status-value online">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  Online
                </span>
              </div>
              <div class="status-item">
                <span class="status-label">Last Backup</span>
                <span class="status-value">Today, 02:00 AM</span>
              </div>
              <div class="status-item">
                <span class="status-label">Server Load</span>
                <span class="status-value">23%</span>
              </div>
              <div class="status-item">
                <span class="status-label">Active Sessions</span>
                <span class="status-value">{{ stats.activeUsers }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <div class="table-container glass-panel">
          <div class="table-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              All Users
            </h3>
            <div class="table-actions">
              <input type="text" placeholder="Search users..." class="search-input" />
              <button class="filter-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filter
              </button>
            </div>
          </div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>University</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in userStore.users" :key="user.id">
                <td>
                  <div class="user-cell">
                    <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                    <div>
                      <div class="user-name">{{ user.name }}</div>
                      <div class="user-email">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="role-badge" :style="{ background: getRoleColor(user.role) }">
                    {{ userStore.getRoleDisplay(user.role) }}
                  </span>
                </td>
                <td>{{ user.university || 'N/A' }}</td>
                <td>
                  <span class="status-badge" :class="{ online: user.online }">
                    <span v-if="user.online" class="online-dot-small"></span>
                    {{ user.online ? 'Online' : 'Offline' }}
                  </span>
                  <span v-if="user.banned" class="status-badge banned">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                    </svg>
                    Banned
                  </span>
                  <span v-if="user.verified" class="status-badge verified">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="12" height="12">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Verified
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn small" @click="verifyUser(user.id)" v-if="!user.verified">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Verify
                    </button>
                    <button class="action-btn small danger" @click="banUser(user.id)" v-if="!user.banned">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                      </svg>
                      Ban
                    </button>
                    <button class="action-btn small" @click="router.push(`/chat?userId=${user.name}`)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      Chat
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Listings Tab -->
      <div v-if="activeTab === 'listings'" class="tab-content">
        <div class="table-container glass-panel">
          <div class="table-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              All Listings
            </h3>
            <div class="table-actions">
              <input type="text" placeholder="Search listings..." class="search-input" />
              <button class="filter-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filter
              </button>
            </div>
          </div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Price</th>
                <th>Seller</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="listing in listings" :key="listing.id">
                <td>
                  <div class="listing-cell">
                    <div class="listing-name">{{ listing.name }}</div>
                  </div>
                </td>
                <td>
                  <span class="type-badge" :class="listing.type">
                    <span v-if="listing.type === 'sell'">💰 Sell</span>
                    <span v-else-if="listing.type === 'rent'">🏠 Rent</span>
                    <span v-else>🔄 Swap</span>
                  </span>
                </td>
                <td>
                  {{ listing.type === 'swap' ? 'Swap' : formatCurrency(listing.price) }}
                </td>
                <td>{{ listing.seller }}</td>
                <td>
                  <span class="status-badge" :style="{ background: getStatusColor(listing.status) }">
                    {{ listing.status }}
                  </span>
                  <span v-if="listing.reported" class="status-badge reported">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Reported
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn small" @click="toggleListingStatus(listing)">
                      {{ listing.status === 'active' ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button class="action-btn small danger" @click="deleteListing(listing.id)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reports Tab -->
      <div v-if="activeTab === 'reports'" class="tab-content">
        <div class="table-container glass-panel">
          <div class="table-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Reports
              <span class="badge" v-if="stats.pendingReports > 0">{{ stats.pendingReports }}</span>
            </h3>
            <div class="table-actions">
              <button class="filter-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filter
              </button>
            </div>
          </div>
          <div v-if="reports.length === 0" class="empty-state">
            <p>No reports to review</p>
          </div>
          <div v-for="report in reports" :key="report.id" class="report-item">
            <div class="report-header">
              <div class="report-info">
                <span class="report-id">#{{ report.id }}</span>
                <span class="report-status" :style="{ color: getStatusColor(report.status) }">
                  {{ report.status }}
                </span>
              </div>
              <span class="report-time">{{ new Date(report.timestamp).toLocaleString() }}</span>
            </div>
            <div class="report-details">
              <div class="report-row">
                <span class="report-label">Reported by:</span>
                <span class="report-value">{{ report.reporterName }}</span>
              </div>
              <div class="report-row">
                <span class="report-label">Against:</span>
                <span class="report-value">{{ report.reportedUserName }}</span>
              </div>
              <div class="report-row">
                <span class="report-label">Reason:</span>
                <span class="report-value">{{ report.reason }}</span>
              </div>
              <div class="report-row" v-if="report.details">
                <span class="report-label">Details:</span>
                <span class="report-value">{{ report.details }}</span>
              </div>
              <div class="report-row" v-if="report.chatMessages && report.chatMessages.length">
                <span class="report-label">Chat History:</span>
                <div class="chat-history">
                  <div v-for="msg in report.chatMessages" :key="msg.id" class="chat-msg">
                    <span class="msg-sender">{{ msg.sender === 'me' ? 'Reporter' : 'Reported' }}:</span>
                    <span class="msg-text">{{ msg.text }}</span>
                    <span class="msg-time">{{ msg.timestamp }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="report-actions">
              <button class="action-btn small" @click="resolveReport(report.id)" v-if="report.status === 'pending'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Resolve
              </button>
              <button class="action-btn small danger" @click="dismissReport(report.id)" v-if="report.status === 'pending'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Dismiss
              </button>
              <button class="action-btn small" @click="banUser(report.reportedUserId)" v-if="report.status === 'pending'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
                Ban User
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Tab -->
      <div v-if="activeTab === 'activity'" class="tab-content">
        <div class="table-container glass-panel">
          <div class="table-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Recent Activity
            </h3>
            <div class="table-actions">
              <button class="filter-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filter
              </button>
            </div>
          </div>
          <div class="activity-feed">
            <div v-for="activity in recentActivity" :key="activity.id" class="feed-item">
              <div class="feed-icon" :class="activity.type">
                {{ getActivityIcon(activity.type) }}
              </div>
              <div class="feed-content">
                <div class="feed-header">
                  <span class="feed-user">{{ activity.user }}</span>
                  <span class="feed-time">{{ activity.time }}</span>
                </div>
                <span class="feed-action">{{ activity.action }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.admin-page {
  width: 100%;
  padding: 20px 0 100px;
}

/* Access Denied Styles */
.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  border-radius: 24px;
  text-align: center;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  max-width: 500px;
  margin: 40px auto;
}

.lock-icon {
  width: 64px;
  height: 64px;
  color: var(--coral);
  margin-bottom: 16px;
}

.access-denied h2 {
  font-size: 24px;
  color: var(--text);
  margin: 0 0 8px;
  font-family: 'Fraunces', serif;
}

.access-denied p {
  color: var(--text-muted);
  font-size: 14px;
  margin: 4px 0;
}

.access-denied .hint {
  color: var(--gold);
  font-size: 13px;
  margin: 12px 0 20px;
}

.go-back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.go-back-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(232, 181, 77, 0.3);
}

.go-back-btn svg {
  width: 18px;
  height: 18px;
}

/* Admin Header */
.admin-header {
  margin-bottom: 24px;
}

.admin-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.admin-title h1 {
  font-size: 28px;
  color: var(--text);
  margin: 0;
  font-family: 'Fraunces', serif;
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-icon {
  width: 28px;
  height: 28px;
  color: var(--gold);
}

.admin-title p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 4px 0 0;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: var(--glass);
  color: var(--text);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.02);
}

.export-btn svg {
  width: 18px;
  height: 18px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 16px 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
}

.stat-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: var(--text-muted);
}

.stat-icon svg {
  width: 22px;
  height: 22px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  font-family: 'Fraunces', serif;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

/* Tabs */
.admin-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 12px;
}

.tab-btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn svg {
  width: 18px;
  height: 18px;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.tab-btn.active {
  background: var(--gold-soft);
  color: var(--gold);
}

.tab-btn .badge {
  background: var(--coral);
  color: white;
  font-size: 10px;
  padding: 1px 8px;
  border-radius: 10px;
}

/* Tab Content */
.tab-content {
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.dashboard-card {
  padding: 20px 24px;
  border-radius: 16px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
}

.dashboard-card h3 {
  font-size: 16px;
  color: var(--text);
  margin: 0 0 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dashboard-card h3 svg {
  width: 20px;
  height: 20px;
  color: var(--gold);
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 20px;
  width: 32px;
  text-align: center;
}

.activity-content {
  flex: 1;
}

.activity-user {
  font-weight: 600;
  color: var(--text);
  font-size: 13px;
}

.activity-action {
  color: var(--text-muted);
  font-size: 13px;
  margin-left: 4px;
}

.activity-time {
  display: block;
  font-size: 11px;
  color: var(--text-faint);
  margin-top: 2px;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.action-btn {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.02);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn.small {
  padding: 6px 12px;
  font-size: 12px;
}

.action-btn.small svg {
  width: 14px;
  height: 14px;
}

.action-btn.danger {
  border-color: var(--coral);
  color: var(--coral);
}

.action-btn.danger:hover {
  background: rgba(255, 133, 119, 0.15);
}

/* System Status */
.system-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  color: var(--text-muted);
  font-size: 13px;
}

.status-value {
  color: var(--text);
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-value.online {
  color: var(--mint);
}

.status-value.online svg {
  width: 10px;
  height: 10px;
  color: var(--mint);
}

/* Tables */
.table-container {
  border-radius: 16px;
  overflow: hidden;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  padding: 20px 24px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.table-header h3 {
  font-size: 18px;
  color: var(--text);
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-header h3 svg {
  width: 20px;
  height: 20px;
  color: var(--gold);
}

.table-header .badge {
  background: var(--coral);
  color: white;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 12px;
}

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  padding: 8px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  min-width: 200px;
}

.search-input:focus {
  outline: none;
  border-color: var(--gold);
}

.filter-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.filter-btn svg {
  width: 16px;
  height: 16px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  padding: 12px 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-faint);
  font-weight: 600;
  border-bottom: 1px solid var(--glass-border);
}

.admin-table td {
  padding: 12px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 13px;
  color: var(--text);
}

.admin-table tr:last-child td {
  border-bottom: none;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 600;
  color: var(--text);
}

.user-email {
  font-size: 11px;
  color: var(--text-faint);
}

/* Badges */
.role-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  display: inline-block;
}

.status-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
  margin-right: 4px;
  color: white;
}

.status-badge.online {
  color: var(--mint);
  background: rgba(74, 222, 128, 0.15);
}

.status-badge.banned {
  color: var(--coral);
  background: rgba(255, 133, 119, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.status-badge.verified {
  color: var(--sky);
  background: rgba(111, 168, 255, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.status-badge.reported {
  color: var(--coral);
  background: rgba(255, 133, 119, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.online-dot-small {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--mint);
  border-radius: 50%;
}

.type-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
}

.type-badge.sell {
  background: rgba(74, 222, 128, 0.2);
  color: var(--mint);
}

.type-badge.rent {
  background: rgba(111, 168, 255, 0.2);
  color: var(--sky);
}

.type-badge.swap {
  background: rgba(232, 181, 77, 0.2);
  color: var(--gold);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* Report Items */
.report-item {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.report-item:last-child {
  border-bottom: none;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.report-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.report-id {
  font-weight: 600;
  color: var(--text);
}

.report-status {
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
}

.report-time {
  font-size: 12px;
  color: var(--text-faint);
}

.report-details {
  margin-bottom: 12px;
}

.report-row {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 13px;
}

.report-label {
  color: var(--text-muted);
  font-weight: 500;
  min-width: 100px;
}

.report-value {
  color: var(--text);
}

.report-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chat-history {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  max-height: 150px;
  overflow-y: auto;
  width: 100%;
}

.chat-msg {
  padding: 4px 0;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.chat-msg:last-child {
  border-bottom: none;
}

.msg-sender {
  font-weight: 600;
  color: var(--text);
}

.msg-text {
  color: var(--text-muted);
  margin: 0 4px;
}

.msg-time {
  font-size: 10px;
  color: var(--text-faint);
}

/* Activity Feed */
.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feed-item {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.feed-item:last-child {
  border-bottom: none;
}

.feed-icon {
  font-size: 20px;
  width: 32px;
  text-align: center;
}

.feed-content {
  flex: 1;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}

.feed-user {
  font-weight: 600;
  color: var(--text);
  font-size: 13px;
}

.feed-time {
  font-size: 11px;
  color: var(--text-faint);
}

.feed-action {
  font-size: 13px;
  color: var(--text-muted);
}

/* Empty State */
.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-page {
    padding: 12px 0 100px;
  }
  
  .admin-title h1 {
    font-size: 22px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .stat-card {
    padding: 12px 14px;
  }
  
  .stat-value {
    font-size: 18px;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
  }
  
  .stat-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .admin-tabs {
    gap: 4px;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }
  
  .tab-btn {
    font-size: 12px;
    padding: 8px 14px;
    white-space: nowrap;
  }
  
  .tab-btn svg {
    width: 16px;
    height: 16px;
  }
  
  .table-container {
    padding: 12px 16px;
    overflow-x: auto;
  }
  
  .admin-table {
    font-size: 12px;
    min-width: 600px;
  }
  
  .search-input {
    min-width: 120px;
    font-size: 12px;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .report-row {
    flex-direction: column;
    gap: 2px;
  }
  
  .report-label {
    min-width: auto;
  }
  
  .admin-header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .export-btn {
    width: 100%;
    justify-content: center;
  }
  
  .access-denied {
    padding: 40px 20px;
    margin: 20px 0;
  }
  
  .access-denied h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>