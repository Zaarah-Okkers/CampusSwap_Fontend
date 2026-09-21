<!-- this is for the company to monitor all usage of the app -->

<template>
  <section class="admin-dash">

    <!-- TOP BAR -->
    <header class="top-bar">
      <div class="top-left">
        <button class="hamburger-btn" @click="toggleSideNav" aria-label="Open menu">
          <span class="hamburger-icon">
            <AppIcon name="menu" />
          </span>
        </button>

        <router-link to="/" class="brand-link">
          <h2 class="brand">
            CampusSwap<span class="green-text">SA</span>
          </h2>
        </router-link>
      </div>

      <div class="top-center">
        <div class="search-wrap">
          <input
            type="text"
            class="search-input"
            placeholder="Search books, services, and more..."
          />
        </div>
      </div>

      <div class="top-right">
        <div class="notification-bell" @click="swalNoNotifications()">
          <span class="bell-icon">
            <AppIcon name="bell" />
          </span>
          <span class="notification-dot"></span>
        </div>

        <span class="avatar">
          {{ userInitials }}
        </span>
      </div>
    </header>

    <!-- SIDE NAV -->
    <div
      class="side-overlay"
      :class="{ 'side-overlay-open': sideNavOpen }"
      @click="closeSideNav"
    ></div>

    <div class="side-nav" :class="{ 'side-nav-open': sideNavOpen }">
      <div class="side-nav-header">
        <h3>
          CampusSwap<span class="green-text">SA</span>
        </h3>
        <button class="close-side-btn" @click="closeSideNav">&times;</button>
      </div>

      <ul class="side-nav-links">
        <li>
          <router-link to="/" @click="closeSideNav">Home</router-link>
        </li>

        <li>
          <router-link to="/safehome" @click="closeSideNav">SafeHome</router-link>
        </li>

        <li v-if="userRole === 'student' || userRole === 'admin' || userRole === 'resmanager'">
          <router-link to="/checkout" @click="closeSideNav">Checkout</router-link>
        </li>

        <li>
          <router-link to="/admin-dashboard" @click="closeSideNav">Dashboard</router-link>
        </li>
      </ul>

      <div class="side-nav-logout">
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>

    <!-- MAIN DASHBOARD CONTENT -->
    <div class="dashboard-container">

      <!-- Greeting -->
      <div class="greeting-block">
        <h2 class="dashboard-title">Hi, Admin</h2>
        <p class="university-text">Platform Administrator</p>
      </div>

      <!-- Header row: title + export -->
      <div class="section-header">
        <h3 class="section-title"><AppIcon name="dashboard" /> Overview</h3>
        <button class="btn-export" @click="exportData">
          <AppIcon name="download" />
          Export Data
        </button>
      </div>

      <!-- Stat cards -->
      <div class="stats-grid">
        <div class="stat-card-one stat-card-highlight">
          <span class="stat-icon-badge stat-icon-plain">
            <AppIcon name="users" :decorative="true" />
          </span>
          <span class="stat-title-one">Total Users</span>
          <span class="stat-value-one">{{ users.length }}</span>
        </div>

        <div class="stat-card-two">
          <span class="stat-icon-badge stat-icon-two">
            <AppIcon name="star" :decorative="true" />
          </span>
          <span class="stat-title-two">Premium Users</span>
          <span class="stat-value-two">{{ premiumUsers.length }}</span>
        </div>

        <div class="stat-card-three">
          <span class="stat-icon-badge stat-icon-three">
            <AppIcon name="package" :decorative="true" />
          </span>
          <span class="stat-title-three">Total Listings</span>
          <span class="stat-value-three">12</span>
        </div>

        <div class="stat-card-four">
          <span class="stat-icon-badge stat-icon-four">
            <AppIcon name="report" :decorative="true" />
          </span>
          <span class="stat-title-four">Pending Reports</span>
          <span class="stat-value-four">0</span>
        </div>
      </div>

      <!-- Activity chart + Notifications -->
      <div class="row-grid">
        <div class="panel">
          <div class="panel-heading">
            <h3>Platform Activity</h3>
            <span class="panel-sub">Last 7 days</span>
          </div>
          <div class="bar-chart">
            <div v-for="(day, i) in activity" :key="i" class="bar-col">
              <div class="bar" :style="{ height: day.value + '%' }"></div>
              <span class="bar-label">{{ day.label }}</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-heading">
            <h3>Notifications</h3>
          </div>
          <div class="notification-item" v-for="(note, i) in notifications" :key="i">
            <div class="notification-icon">
              <AppIcon :name="note.icon" />
            </div>
            <div class="notification-text">
              <span class="notification-title">{{ note.title }}</span>
              <span class="notification-time">{{ note.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Users + Reports donut -->
      <div class="row-grid">
        <div class="panel">
          <div class="panel-heading">
            <h3>Recent Users</h3>
            <router-link to="/admin/users" class="panel-link">View all</router-link>
          </div>
          <div class="user-row" v-for="(u, i) in recentUsers" :key="i">
            <span class="user-avatar">{{ u.initials }}</span>
            <div class="user-info">
              <span class="user-name">{{ u.name }}</span>
              <span class="user-role">{{ u.role }}</span>
            </div>
            <AppIcon v-if="u.premium" name="star" class="premium-star" />
          </div>
        </div>

        <div class="panel panel-center">
          <div class="panel-heading">
            <h3>Reports Resolved</h3>
          </div>
          <div class="donut" :style="donutStyle">
            <div class="donut-hole">
              <span class="donut-value">{{ reportsResolvedPct }}%</span>
            </div>
          </div>
          <div class="donut-legend">
            <span><i class="dot dot-green"></i> Resolved</span>
            <span><i class="dot dot-grey"></i> Pending</span>
          </div>
        </div>
      </div>

      <!-- Recent Listings -->
      <div class="panel">
        <div class="panel-heading">
          <h3>Recent Listings</h3>
          <router-link to="/admin/listings" class="panel-link">View all</router-link>
        </div>
        <div class="listing-row" v-for="(item, i) in recentListings" :key="i">
          <div class="listing-icon"><AppIcon name="package" /></div>
          <div class="listing-info">
            <span class="listing-name">{{ item.name }}</span>
            <span class="listing-meta">{{ item.seller }} &middot; {{ item.type }}</span>
          </div>
          <span class="listing-status" :class="item.status">{{ item.status }}</span>
        </div>
      </div>

      <!-- Account Management Card -->
      <div class="card">
        <h3 class="card-heading">Account Management</h3>

        <div class="menu-item">
          <router-link to="/admin/users" class="menu-link">
            Manage Users
            <span class="arrow">&gt;</span>
          </router-link>
        </div>

        <div class="menu-item">
          <router-link to="/admin/listings" class="menu-link">
            Manage Listings
            <span class="arrow">&gt;</span>
          </router-link>
        </div>

        <div class="menu-item">
          <router-link to="/admin/reports" class="menu-link">
            Reports & Analytics
            <span class="arrow">&gt;</span>
          </router-link>
        </div>

        <div class="menu-item">
          <router-link to="/checkout" class="menu-link">
            Checkout
            <span class="arrow">&gt;</span>
          </router-link>
        </div>

        <!-- Change Password Section -->
        <div class="password-section">
          <h4 class="password-title">Change Password</h4>

          <div class="form-group">
            <label>Current Password</label>
            <input type="password" v-model="currentPassword" class="form-input" placeholder="Enter current password" />
          </div>

          <div class="form-group">
            <label>New Password</label>
            <input type="password" v-model="newPassword" class="form-input" placeholder="Enter new password" />
          </div>

          <div class="form-group">
            <label>Confirm New Password</label>
            <input type="password" v-model="confirmPassword" class="form-input" placeholder="Re-enter new password" />
          </div>

          <button class="btn-save" @click="changePassword">Update Password</button>
        </div>
      </div>

    </div>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import AppIcon from '../../components/AppIcon.vue'

const store = useStore()

const sideNavOpen = ref(false)
const bottomNavOpen = ref(true)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const userRole = ref('admin')

const users = computed(() => store.state.user?.users || [])
const premiumUsers = computed(() => users.value.filter(u => u.isPremium))

const userInitials = computed(() => {
  const name = store.getters['user/currentUser']?.name || ''
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

// -------- Notifications (honest empty state) --------
function swalNoNotifications() {
  Swal.fire({ icon: 'info', title: 'No notifications', text: 'You have no new notifications.', timer: 1500, showConfirmButton: false })
}

// -------- Side nav --------
function toggleSideNav() {
  sideNavOpen.value = !sideNavOpen.value
  document.body.style.overflow = sideNavOpen.value ? 'hidden' : ''
}

function closeSideNav() {
  sideNavOpen.value = false
  document.body.style.overflow = ''
}

// -------- Logout --------
async function logout() {
  const result = await Swal.fire({
    title: 'Logout?',
    text: 'Are you sure you want to log out of the admin panel?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
  })

  if (result.isConfirmed) {
    Swal.fire('Logged Out', 'You have been logged out successfully.', 'success')
    // this.$router.push('/login') — use useRouter() here if needed
  }
}

// -------- Change password --------
async function changePassword() {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Incomplete',
      text: 'Please fill in all password fields.',
      confirmButtonColor: 'red',
    })
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    await Swal.fire({
      icon: 'error',
      title: 'Passwords Do Not Match',
      text: 'New password and confirmation must match.',
      confirmButtonColor: 'green',
    })
    return
  }

  if (newPassword.value.length < 6) {
    await Swal.fire({
      icon: 'error',
      title: 'Password Too Short',
      text: 'Password must be at least 6 characters long.',
      confirmButtonColor: 'orange',
    })
    return
  }

  await Swal.fire({
    icon: 'success',
    title: 'Password Updated!',
    text: 'Your password has been changed successfully.',
    timer: 2000,
    showConfirmButton: false,
  })

  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

// -------- Export --------
async function exportData() {
  const result = await Swal.fire({
    title: 'Export Data?',
    text: 'This will export all platform data as a CSV file.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: 'green',
    cancelButtonColor: 'red',
    confirmButtonText: 'Export Now',
    cancelButtonText: 'Cancel',
  })

  if (result.isConfirmed) {
    await Swal.fire({
      icon: 'success',
      title: 'Export Started!',
      text: 'Your data export will be ready in a few moments.',
      timer: 2000,
      showConfirmButton: false,
    })
  }
}

// -------- Placeholder data for the new panels --------
const activity = [
  { label: 'Mon', value: 40 },
  { label: 'Tue', value: 65 },
  { label: 'Wed', value: 50 },
  { label: 'Thu', value: 80 },
  { label: 'Fri', value: 55 },
  { label: 'Sat', value: 30 },
  { label: 'Sun', value: 45 },
]

const notifications = [
  { icon: 'megaphone', title: '3 new listings pending review', time: '10 min ago' },
  { icon: 'alert', title: 'New report submitted', time: '1 hr ago' },
  { icon: 'user', title: '2 new users registered', time: 'Today' },
]

const recentUsers = [
  { initials: 'AT', name: 'Anela T.', role: 'Student', premium: true },
  { initials: 'LM', name: 'Lerato M.', role: 'Student', premium: false },
  { initials: 'ZK', name: 'Zaarah K.', role: 'Admin', premium: false },
]

const reportsResolvedPct = 68
const donutStyle = computed(() => ({
  background: `conic-gradient(#2e7d5a 0% ${reportsResolvedPct}%, #e5e7eb ${reportsResolvedPct}% 100%)`
}))

const recentListings = [
  { name: 'Intro to Economics Textbook', seller: 'Lerato M.', type: 'Sell', status: 'active' },
  { name: 'Laptop Bag Rental', seller: 'Anela T.', type: 'Rent', status: 'active' },
  { name: 'Scientific Calculator', seller: 'Zaarah K.', type: 'Swap', status: 'pending' },
]
</script>

<style scoped>
/* ---------- Top Bar ---------- */
.top-bar {
  background-color: #0d1b3d;
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

.top-left { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

.hamburger-btn { background: none; border: none; cursor: pointer; padding: 4px 6px; display: flex; align-items: center; justify-content: center; }
.hamburger-icon { font-size: 28px; color: #fff; line-height: 1; display: inline-flex; }

.brand-link { text-decoration: none; }
.brand { color: #fff; font-size: 22px; margin: 0; font-weight: 600; letter-spacing: 0.5px; white-space: nowrap; }
.brand .green-text, .green-text { color: #2e7d5a; }

.top-center { flex: 1; min-width: 160px; max-width: 520px; }
.search-wrap { display: flex; align-items: center; background-color: rgba(255, 255, 255, 0.12); border-radius: 24px; padding: 6px 16px; border: 1px solid rgba(255, 255, 255, 0.08); }
.search-wrap:hover, .search-wrap:focus-within { background-color: rgba(255, 255, 255, 0.20); border-color: rgba(245, 185, 65, 0.4); }
.search-input { background: transparent; border: none; outline: none; color: #fff; font-size: 14px; padding: 8px 0; width: 100%; }
.search-input::placeholder { color: #9ca3af; }

.top-right { display: flex; align-items: center; flex-shrink: 0; gap: 15px; }
.notification-bell { position: relative; cursor: pointer; font-size: 24px; color: #fff; display: inline-flex; transition: color 0.3s ease; }
.notification-bell:hover { color: #f5b941; }
.bell-icon { display: inline-flex; }
.notification-dot { position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; background-color: #ff4d4f; border-radius: 50%; border: 2px solid #0d1b3d; }
.avatar { background-color: #f5b941; color: #0d1b3d; font-weight: 700; font-size: 14px; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

/* ---------- Side Nav ---------- */
.side-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 200; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; }
.side-overlay-open { opacity: 1; visibility: visible; }
.side-nav { position: fixed; top: 0; left: 0; width: 280px; height: 100%; background-color: #0d1b3d; z-index: 300; transform: translateX(-100%); transition: transform 0.3s ease; padding: 20px 24px; box-shadow: 4px 0 16px rgba(0, 0, 0, 0.3); overflow-y: auto; display: flex; flex-direction: column; }
.side-nav-open { transform: translateX(0); }
.side-nav-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 20px; }
.side-nav-header h3 { color: #fff; font-size: 20px; margin: 0; }
.close-side-btn { background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; }
.close-side-btn:hover { color: #f5b941; }
.side-nav-links { list-style: none; padding: 0; margin: 0; flex: 1; }
.side-nav-links li { margin-bottom: 4px; }
.side-nav-links li a { display: block; color: #d1d5db; text-decoration: none; font-size: 16px; font-weight: 500; padding: 12px 16px; border-radius: 8px; border-left: 3px solid transparent; transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease; }
.side-nav-links li a:hover { background-color: rgba(245, 185, 65, 0.12); color: #f5b941; border-left-color: #f5b941; }
.side-nav-logout { margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
.logout-btn { width: 100%; background: transparent; border: 2px solid #f5b941; color: #f5b941; font-weight: 700; padding: 12px 24px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; }
.logout-btn:hover { background-color: #f5b941; color: #0d1b3d; transform: translateY(-2px); }

/* ---------- Dashboard content ---------- */
.dashboard-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px 130px 20px; /* extra bottom padding clears the pinned bottom nav */
}

.greeting-block { margin-bottom: 24px; }
.dashboard-title { color: #ffffff; font-size: 26px; font-weight: 700; margin: 0 0 6px 0; }
.university-text { color: #d1d5db; font-size: 15px; font-weight: 500; margin: 0; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 16px 0;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title {
  color: #ffffff;
  font-size: 18px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #2e7d5a;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.25s ease;
}
.btn-export:hover { background-color: #256a4b; }

/* Cards (Account Management) */
.card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-heading {
  color: #0d1b3d;
  font-size: 18px;
  margin: 0 0 16px 0;
  font-weight: 700;
  padding-bottom: 10px;
  border-bottom: 2px solid #6c4b6a;
}

/* Stats Grid */
.stats-grid { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }

.stat-card-one, .stat-card-two, .stat-card-three, .stat-card-four {
  flex: 1 1 150px;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
}

.stat-card-highlight {
  background: linear-gradient(135deg, #2e7d5a, #235f45);
  border-bottom: 3px solid #1c4a37;
}
.stat-card-highlight .stat-title-one,
.stat-card-highlight .stat-value-one { color: #ffffff; }
.stat-icon-plain { background: rgba(255,255,255,0.18); color: #ffffff; }

.stat-card-two { background-color: #fffbeb; border-bottom: 3px solid #f5b941; }
.stat-card-three { background-color: #f0fdfa; border-bottom: 3px solid #00a6a6; }
.stat-card-four { background-color: #fef2f2; border-bottom: 3px solid #dc2626; }

.stat-icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  margin: 0 auto 8px auto;
  font-size: 18px;
}

.stat-icon-two { background-color: rgba(245, 185, 65, 0.2); color: #b8860b; }
.stat-icon-three { background-color: rgba(0, 166, 166, 0.12); color: #00a6a6; }
.stat-icon-four { background-color: rgba(220, 38, 38, 0.12); color: #dc2626; }

.stat-title-one, .stat-title-two, .stat-title-three, .stat-title-four {
  color: #334155;
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 5px;
}

.stat-value-one, .stat-value-two, .stat-value-three, .stat-value-four {
  font-weight: bold;
  font-size: 22px;
  display: block;
}
.stat-value-two { color: #b8860b; }
.stat-value-three { color: #00a6a6; }
.stat-value-four { color: #dc2626; }

/* Panels */
.row-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .row-grid { grid-template-columns: 1fr; }
}

.panel {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 16px;
}

.panel-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.panel-heading h3 { font-size: 16px; color: #1a1a2e; margin: 0; }
.panel-sub { font-size: 12px; color: #9ca3af; }
.panel-link { font-size: 13px; color: #2e7d5a; text-decoration: none; font-weight: 600; }
.panel-link:hover { text-decoration: underline; }

.bar-chart { display: flex; align-items: flex-end; justify-content: space-between; height: 140px; gap: 10px; }
.bar-col { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; flex: 1; height: 100%; }
.bar { width: 100%; max-width: 24px; background: linear-gradient(180deg, #2e7d5a, #6bbf9a); border-radius: 6px 6px 0 0; transition: height 0.3s ease; }
.bar-label { margin-top: 8px; font-size: 11px; color: #6b7280; }

.notification-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
.notification-item:last-child { border-bottom: none; }
.notification-icon { width: 36px; height: 36px; border-radius: 10px; background: #f0fdf4; color: #2e7d5a; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.notification-text { display: flex; flex-direction: column; }
.notification-title { font-size: 14px; color: #1a1a2e; font-weight: 500; }
.notification-time { font-size: 12px; color: #9ca3af; }

.user-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
.user-row:last-child { border-bottom: none; }
.user-avatar { width: 36px; height: 36px; border-radius: 50%; background-color: #f5b941; color: #0d1b3d; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; flex: 1; }
.user-name { font-size: 14px; font-weight: 600; color: #1a1a2e; }
.user-role { font-size: 12px; color: #9ca3af; }
.premium-star { color: #f5b941; }

.panel-center { display: flex; flex-direction: column; align-items: center; }
.donut { width: 140px; height: 140px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 8px 0 16px; }
.donut-hole { width: 100px; height: 100px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; }
.donut-value { font-size: 22px; font-weight: 700; color: #1a1a2e; }
.donut-legend { display: flex; gap: 16px; font-size: 13px; color: #6b7280; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
.dot-green { background-color: #2e7d5a; }
.dot-grey { background-color: #e5e7eb; }

.listing-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
.listing-row:last-child { border-bottom: none; }
.listing-icon { width: 36px; height: 36px; border-radius: 10px; background: #f0fdfa; color: #00a6a6; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.listing-info { display: flex; flex-direction: column; flex: 1; }
.listing-name { font-size: 14px; font-weight: 600; color: #1a1a2e; }
.listing-meta { font-size: 12px; color: #9ca3af; }
.listing-status { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; text-transform: capitalize; }
.listing-status.active { background: #ecfdf5; color: #059669; }
.listing-status.pending { background: #fffbeb; color: #b45309; }

/* Menu items */
.menu-item { border-bottom: 1px solid #eeeeee; padding: 12px 0; }
.menu-item:last-child { border-bottom: none; }
.menu-link { color: #0d1b3d; text-decoration: none; font-weight: 500; font-size: 15px; display: flex; align-items: center; justify-content: space-between; transition: color 0.25s ease; }
.menu-link:hover { color: #2e7d5a; }
.menu-link:hover .arrow { transform: translateX(4px); color: #2e7d5a; }
.arrow { font-weight: bold; color: #9ca3af; transition: transform 0.25s ease, color 0.25s ease; }

/* Change Password */
.password-section { margin-top: 20px; border-top: 2px dashed #e5e7eb; padding-top: 20px; }
.password-title { color: #6c4b6a; font-size: 16px; font-weight: 700; margin: 0 0 15px 0; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; color: #0d1b3d; margin-bottom: 8px; }
.form-input { width: 100%; padding: 10px 14px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 15px; font-family: inherit; transition: border-color 0.3s ease; box-sizing: border-box; }
.form-input:focus { outline: none; border-color: #00a6a6; }
.btn-save { width: 100%; background-color: #f5b941; color: #0d1b3d; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; transition: background-color 0.25s ease; }
.btn-save:hover { background-color: #e0a330; }

/* ---------- Bottom Pill Nav ---------- */
.bottom-nav-wrap {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 250;
}

.bottom-nav-toggle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #0d1b3d;
  border: 2px solid #f5b941;
  color: #f5b941;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 8px;
}

.bottom-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #0d1b3d;
  border-radius: 30px;
  padding: 10px 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  max-width: 95vw;
  overflow-x: auto;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #9ca3af;
  text-decoration: none;
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 16px;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.bottom-nav-item:hover {
  color: #f5b941;
}

.bottom-nav-item.active {
  background-color: rgba(245, 185, 65, 0.15);
  color: #f5b941;
}

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .top-center { order: 3; flex-basis: 100%; max-width: 100%; min-width: 0; }
  .top-right { display: flex; }
  .stats-grid { gap: 8px; }
  .stat-card-one, .stat-card-two, .stat-card-three, .stat-card-four { padding: 10px; }
}
</style>
