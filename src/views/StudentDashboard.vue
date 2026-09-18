<!-- 
here I will 4 dashbaord  with their own sections and div or should i just have separe pages for all of them ? thinking...
 
1. dashboard this will be the student dashboard.
2. service provider dashboard
3. admin dashboard 
4. res manager dashboard 
-->

<template>
  <div class="student-dash">

    <!-- TOP BAR -->
    <header class="top-bar">
      <div class="top-left">
        <button class="hamburger-btn" @click="toggleSideNav" aria-label="Open menu">
          <span class="hamburger-icon">
            <AppIcon name="dashboard" />
          </span>
        </button>

        <router-link to="/" class="brand-link">
          <h2 class="brand">
            CampusSwap
            <span class="green-text">SA</span>
          </h2>
        </router-link>
      </div>

      <div class="top-center">
        <form class="search-wrap" @submit.prevent="goToMarketplace">
          <input
            type="text"
            class="search-input"
            placeholder="Search books, services, and more..."
            aria-label="Search the marketplace"
          />
        </form>
      </div>

      <div class="top-right">
        <span class="avatar">{{ userInitials }}</span>
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
          CampusSwap
          <span class="green-text">SA</span>
        </h3>
        <button class="close-side-btn" @click="closeSideNav">&times;</button>
      </div>

      <ul class="side-nav-links">
        <li>
          <router-link to="/" @click="closeSideNav">Home</router-link>
        </li>

        <!-- <li>
          <router-link to="/academic" @click="closeSideNav" v-if="userRole === 'student'">
            Academic Marketplace
          </router-link>
        </li> -->

        <li>
          <router-link to="/safehome" @click="closeSideNav">SafeHome</router-link>
        </li>

        <li>
          <router-link to="/checkout" @click="closeSideNav" v-if="isStudent">
            Checkout
          </router-link>
        </li>

        <li>
          <router-link to="/student-dashboard" @click="closeSideNav">Dashboard</router-link>
        </li>
      </ul>

      <div class="side-nav-logout">
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>

    <!-- MAIN DASHBOARD CONTENT -->
    <div class="dashboard-container">

      <div class="greeting-block">
        <div>
          <h2 class="dashboard-title">
            Hi, {{ user.full_name || user.name || 'Student' }} 👋
          </h2>
          <p class="university-text">
            {{ isStudent ? (user.university || 'CampusSwap Student') : 'Welcome back' }}
          </p>
        </div>
        <span class="greeting-date">{{ formattedDate }}</span>
      </div>

      <div class="dashboard-grid">

      <!-- Profile Details Card -->
      <div class="card profile-overview-card grid-full" id="student-profile-section">
        <div class="profile-header-flex">
          <div class="profile-avatar-large">
            {{ userInitials }}
          </div>
          <div class="profile-header-info">
            <h3 class="profile-name">{{ user.full_name || user.name || 'Zaarah K.' }}</h3>
            <p class="profile-meta">{{ user.email || 'zaarah@campus.co.za' }} · {{ user.university || 'University of Cape Town (UCT)' }}</p>
            <div class="profile-badges">
              <span class="badge-student"><AppIcon name="graduationCap" /> Verified Student</span>
              <span class="badge-campus"><AppIcon name="building" /> On-Campus Resident</span>
            </div>
          </div>
        </div>

        <div class="profile-details-grid">
          <div class="detail-item">
            <span class="detail-label">Student ID</span>
            <strong>{{ user.studentNumber || 'STU-2026-0941' }}</strong>
          </div>
          <div class="detail-item">
            <span class="detail-label">Institution</span>
            <strong>{{ user.university || 'University of Cape Town (UCT)' }}</strong>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <strong class="status-active"><AppIcon name="check" /> Active Member</strong>
          </div>
          <div class="detail-item">
            <span class="detail-label">Residence</span>
            <strong>Smuts Hall · Room 204</strong>
          </div>
        </div>
      </div>

      <!-- Profile Stats Card -->
      <div class="card grid-full">
        <h3 class="card-heading">Activity Overview</h3>

        <div class="stats-grid">
          <div class="stat-card" style="background-color: #f0fdf4; border-bottom: 3px solid #2e7d5a;">
            <span class="stat-title">My Listings</span>
            <span class="stat-value" style="color: #2e7d5a;">{{ myListings.length }}</span>
          </div>

          <div class="stat-card" style="background-color: #f0fdfa; border-bottom: 3px solid #00a6a6;">
            <span class="stat-title">My Orders</span>
            <span class="stat-value" style="color: #00a6a6;">{{ myOrders.length }}</span>
          </div>

          <div class="stat-card" style="background-color: #fffbeb; border-bottom: 3px solid #f5b941;">
            <span class="stat-title">Total Spent</span>
            <span class="stat-value" style="color: #f5b941;">
              R{{ myOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Student Residence Card -->
      <div class="card">
        <h3 class="card-heading">Student Residence</h3>

        <div class="feature-grid">
          <div class="feature-card">
            <span class="feature-icon"><AppIcon name="building" /></span>
            <h4 class="feature-title">Find Accommodation</h4>
            <p class="feature-text">Browse verified on-campus and off-campus rooms near your institution.</p>
          </div>

          <div class="feature-card">
            <span class="feature-icon"><AppIcon name="home" /></span>
            <h4 class="feature-title">My Residence Booking</h4>
            <p class="feature-text">View your current room allocation, lease dates and move-in details.</p>
          </div>

          <div class="feature-card">
            <span class="feature-icon"><AppIcon name="cart" /></span>
            <h4 class="feature-title">Pay Residence Fees</h4>
            <p class="feature-text">Settle rent and deposits securely with escrow-protected payments.</p>
          </div>

          <div class="feature-card">
            <span class="feature-icon"><AppIcon name="check" /></span>
            <h4 class="feature-title">Maintenance Requests</h4>
            <p class="feature-text">Log faults and track repairs with your residence manager.</p>
          </div>
        </div>

        <button class="btn-card-action" @click="goToResidence">
          <AppIcon name="building" />
          {{ isStudent ? 'Go to Residence Portal' : 'Log in to access Residence Portal' }}
        </button>
      </div>

      <!-- Marketplace Card -->
      <div class="card">
        <h3 class="card-heading">Academic Marketplace</h3>

        <div class="feature-grid">
          <div class="feature-card">
            <span class="feature-icon"><AppIcon name="book" /></span>
            <h4 class="feature-title">Textbooks &amp; Study Notes</h4>
            <p class="feature-text">Buy and sell prescribed textbooks, past papers and study guides.</p>
          </div>

          <div class="feature-card">
            <span class="feature-icon"><AppIcon name="cart" /></span>
            <h4 class="feature-title">Buy Campus Gear</h4>
            <p class="feature-text">Shop electronics, stationery and dorm essentials from fellow students.</p>
          </div>

          <div class="feature-card">
            <span class="feature-icon"><AppIcon name="dashboard" /></span>
            <h4 class="feature-title">Sell Your Items</h4>
            <p class="feature-text">List your used items in minutes and reach buyers on your campus.</p>
          </div>

          <div class="feature-card">
            <span class="feature-icon"><AppIcon name="alert" /></span>
            <h4 class="feature-title">Track Orders</h4>
            <p class="feature-text">Follow your purchases from checkout to delivery with escrow protection.</p>
          </div>
        </div>

        <button class="btn-card-action" @click="goToMarketplace">
          <AppIcon name="cart" />
          {{ isStudent ? 'Go to Marketplace' : 'Log in to access Marketplace' }}
        </button>
      </div>

      <!-- Quick Services Card -->
      <div class="card grid-full">
        <h3 class="card-heading">Campus Services</h3>

        <div class="menu-item">
          <router-link to="/marketplace" class="menu-link">
            <span><AppIcon name="book" /> Academic Marketplace</span>
            <span class="arrow">&gt;</span>
          </router-link>
        </div>

        <div class="menu-item">
          <router-link to="/student-residence" class="menu-link">
            <span><AppIcon name="building" /> Student Residence Portal</span>
            <span class="arrow">&gt;</span>
          </router-link>
        </div>

        <div class="menu-item">
          <router-link to="/safehome" class="menu-link">
            <span><AppIcon name="home" /> SafeHome Bookings</span>
            <span class="arrow">&gt;</span>
          </router-link>
        </div>

        <div class="menu-item">
          <router-link to="/checkout" class="menu-link">
            <span><AppIcon name="cart" /> Checkout &amp; Escrow</span>
            <span class="arrow">&gt;</span>
          </router-link>
        </div>
      </div>

      <!-- Account Management Card -->
      <div class="card grid-full">
        <h3 class="card-heading">Account Management</h3>

        <div class="menu-item">
          <router-link to="/marketplace" class="menu-link">
            <span>Active Orders</span>
            <span class="arrow">&gt;</span>
          </router-link>
        </div>

        <div class="menu-item">
          <router-link to="/safehome" class="menu-link">
            SafeHome Bookings
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
                        </div>
                     </div>
                    </template>

<script>
import Swal from 'sweetalert2'
import AppIcon from '../components/AppIcon.vue'
import { dashAPI, authAPI, session } from '@/services/api'

export default {
  name: 'StudentDashboard',
  components: { AppIcon },

  data() {
    return {
      sideNavOpen: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      user: {},
      myListings: [],
      myOrders: [],
      loading: true
    }
  },

  async mounted() {
    this.user = session.get() || {}

    if (!this.user.id) {
      this.$router.push('/login')
      return
    }

    try {
      const data = await dashAPI.getStudent(this.user.id)
      this.myListings = data.mylistings || []
      this.myOrders = data.myOrders || []
    } catch (err) {
      console.error('Failed to load student dashboard:', err.message)
    } finally {
      this.loading = false
    }
  },

  computed: {
    isStudent() {
      return this.user.role === 'student'
    },
    userInitials() {
      const name = this.user.full_name || this.user.name || ''
      if (!name) return ''
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    },
    formattedDate() {
      const now = new Date()
      return now.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },

  methods: {
    // Residency / Marketplace gating:
    // - logged-in student -> straight to the page
    // - anything else (not logged in, or another role) -> login page with a redirect back
    goToStudentPage(path) {
      // not a logged-in student: send them to login, remembering where they wanted to go
      const redirectQuery = { path: '/login', query: { redirect: path } }
      this.$router.push(this.isStudent ? path : redirectQuery)
    },

    goToResidence() {
      this.goToStudentPage('/student-residence')
    },

    goToMarketplace() {
      this.goToStudentPage('/marketplace')
    },

    toggleSideNav() {
      this.sideNavOpen = !this.sideNavOpen
      document.body.style.overflow = this.sideNavOpen ? 'hidden' : ''
    },

    closeSideNav() {
      this.sideNavOpen = false
      document.body.style.overflow = ''
    },

    async logout() {
      const result = await Swal.fire({
        title: 'Logout?',
        text: 'Are you sure you want to log out of your student account?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel'
      })

      if (result.isConfirmed) {
        session.clear()
        await Swal.fire('Logged Out', 'You have been logged out successfully.', 'success')
        this.$router.push('/login')
      }
    },

    async changePassword() {
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        await Swal.fire({
          icon: 'warning',
          title: 'Incomplete',
          text: 'Please fill in all password fields.',
          confirmButtonColor: '#f5b941'
        })
        return
      }

      if (this.newPassword !== this.confirmPassword) {
        await Swal.fire({
          icon: 'error',
          title: 'Passwords Do Not Match',
          text: 'New password and confirmation must match.',
          confirmButtonColor: '#d33'
        })
        return
      }

      if (this.newPassword.length < 6) {
        await Swal.fire({
          icon: 'error',
          title: 'Password Too Short',
          text: 'Password must be at least 6 characters long.',
          confirmButtonColor: '#d33'
        })
        return
      }

      try {
        await authAPI.changePassword(
          this.user.id,
          this.currentPassword,
          this.newPassword
        )

        await Swal.fire({
          icon: 'success',
          title: 'Password Updated!',
          text: 'Your password has been changed successfully.',
          timer: 2000,
          showConfirmButton: false
        })

        this.currentPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
      } catch (err) {
        await Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.message,
          confirmButtonColor: '#d33'
        })
      }
    }
  }
}
</script>

<style scoped>
/* Base layout */
.student-dash {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

/* Top Bar */
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

.top-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hamburger-icon {
  font-size: 28px;
  color: #fff;
  line-height: 1;
}

.brand-link {
  text-decoration: none;
}

.brand {
  color: #fff;
  font-size: 22px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.brand .green-text,
.green-text {
  color: #2e7d5a;
}

.top-center {
  flex: 1;
  min-width: 160px;
  max-width: 520px;
}

.search-wrap {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.search-wrap:hover,
.search-wrap:focus-within {
  background-color: rgba(255, 255, 255, 0.20);
  border-color: rgba(245, 185, 65, 0.4);
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  padding: 8px 0;
  width: 100%;
}

.search-input::placeholder {
  color: #9ca3af;
}

.top-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 15px;
}

.avatar {
  background-color: #f5b941;
  color: #0d1b3d;
  font-weight: 700;
  font-size: 14px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Side Nav */
.side-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.side-overlay-open {
  opacity: 1;
  visibility: visible;
}

.side-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background-color: #0d1b3d;
  z-index: 300;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  padding: 20px 24px;
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.side-nav-open {
  transform: translateX(0);
}

.side-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.side-nav-header h3 {
  color: #fff;
  font-size: 20px;
  margin: 0;
}

.close-side-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
}

.close-side-btn:hover {
  color: #f5b941;
}

.side-nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.side-nav-links li {
  margin-bottom: 4px;
}

.side-nav-links li a {
  display: block;
  color: #d1d5db;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.side-nav-links li a:hover {
  background-color: rgba(245, 185, 65, 0.12);
  color: #f5b941;
  border-left-color: #f5b941;
}

.side-nav-logout {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  background: transparent;
  border: 2px solid #f5b941;
  color: #f5b941;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #f5b941;
  color: #0d1b3d;
  transform: translateY(-2px);
}

/* Dashboard Content */
.dashboard-container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* Two-column responsive grid: cards stack on small screens, flow into
   columns on desktop. `.grid-full` cards span both columns. */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 20px;
  align-items: start;
}

.dashboard-grid .card {
  margin-bottom: 0;
}

.grid-full {
  grid-column: 1 / -1;
}

.greeting-block {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-title {
  color: #0d1b3d;
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.university-text {
  color: #64748b;
  font-size: 15px;
  font-weight: 500;
  margin: 0;
}

.greeting-date {
  color: #64748b;
  font-size: 13.5px;
  font-weight: 500;
  white-space: nowrap;
}

/* Cards */
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

/* Profile overview card */
.profile-header-flex {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eef1f5;
  flex-wrap: wrap;
}

.profile-avatar-large {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #2e7d5a;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-header-info {
  flex: 1;
  min-width: 180px;
}

.profile-name {
  color: #0d1b3d;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.profile-meta {
  color: #64748b;
  font-size: 13.5px;
  margin: 0 0 10px 0;
  word-break: break-word;
}

.profile-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge-student,
.badge-campus {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
}

.badge-student {
  background-color: #e6f4ee;
  color: #2e7d5a;
}

.badge-campus {
  background-color: #fff6e0;
  color: #b5811a;
}

.profile-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  padding-top: 18px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.detail-item strong {
  color: #0d1b3d;
  font-size: 14.5px;
  font-weight: 600;
}

.status-active {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #2e7d5a;
}

.stats-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1 1 150px;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
}

.stat-title {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 5px;
  font-weight: 500;
}

.stat-value {
  font-weight: bold;
  font-size: 22px;
  display: block;
}

/* Feature cards (Residence / Marketplace) */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.feature-card {
  background-color: #f8f9fa;
  border: 1px solid #eceff3;
  border-radius: 12px;
  padding: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(13, 27, 61, 0.08);
  border-color: #2e7d5a;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-color: #e6f4ee;
  color: #2e7d5a;
  font-size: 20px;
  margin-bottom: 10px;
}

.feature-title {
  color: #0d1b3d;
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.feature-text {
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.45;
  margin: 0;
}

.btn-card-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background-color: #0d1b3d;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.2s ease;
}

.btn-card-action:hover {
  background-color: #2e7d5a;
  transform: translateY(-2px);
}

/* Menu items */
.menu-item {
  border-bottom: 1px solid #eeeeee;
  padding: 12px 0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-link {
  color: #0d1b3d;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: color 0.25s ease;
}

.menu-link:hover {
  color: #2e7d5a;
}

.menu-link:hover .arrow {
  transform: translateX(4px);
  color: #2e7d5a;
}

.arrow {
  font-weight: bold;
  color: #9ca3af;
  transition: transform 0.25s ease, color 0.25s ease;
}

/* Change Password */
.password-section {
  margin-top: 20px;
  border-top: 2px dashed #e5e7eb;
  padding-top: 20px;
}

.password-title {
  color: #6c4b6a;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 15px 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0d1b3d;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #00a6a6;
}

.btn-save {
  width: 100%;
  background-color: #f5b941;
  color: #0d1b3d;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.btn-save:hover {
  background-color: #e0a330;
}

/* Responsive */
@media (max-width: 768px) {
  .top-center {
    order: 3;
    flex-basis: 100%;
    max-width: 100%;
    min-width: 0;
  }
  .top-right {
    display: flex;
  }
  .dashboard-container {
    padding: 20px 14px;
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .stats-grid {
    gap: 8px;
  }
  .stat-card {
    padding: 10px;
  }
  .greeting-block {
    align-items: flex-start;
  }
  .dashboard-title {
    font-size: 22px;
  }
}
</style>