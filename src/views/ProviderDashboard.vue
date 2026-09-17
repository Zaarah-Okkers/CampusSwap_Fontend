<!-- this is for the service provider dashboard -->

<template>
  <section class="service_provider-dash">

    <!-- TOP BAR -->
    <header class="top-bar">
      <div class="top-left">
        <button class="hamburger-btn" @click="toggleSideNav" aria-label="Open menu">
          <span class="hamburger-icon">&#9776;</span>
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
        <div class="notification-bell" @click="notifyClick">
          <span class="bell-icon">&#128276;</span>
          <span class="notification-dot"></span>
        </div>

        <span class="avatar">{{ initials }}</span>
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
        <h3>CampusSwap<span class="green-text">SA</span></h3>
        <button class="close-side-btn" @click="closeSideNav">&times;</button>
      </div>

      <!-- Menu: role-aware -->
      <ul class="side-nav-links">
        <li>
          <router-link to="/" @click="closeSideNav">Home</router-link>
        </li>

        <template v-if="user && user.id">
          <li v-if="canSeeAcademic">
            <router-link to="/academic" @click="closeSideNav">Academic Marketplace</router-link>
          </li>
          <li>
            <router-link to="/safehome" @click="closeSideNav">SafeHome</router-link>
          </li>
          <li v-if="canSeeCheckout">
            <router-link to="/checkout" @click="closeSideNav">Checkout</router-link>
          </li>
          <li>
            <router-link :to="myDashboard" @click="closeSideNav">Dashboard</router-link>
          </li>
        </template>
      </ul>

      <!-- User footer with logout -->
      <div class="side-nav-user" v-if="user && user.id">
        <p>Hi! {{ user.full_name }}</p>
        <p class="side-user-uni">{{ roleLabel }}</p>
        <button class="side-logout-btn" @click="logout">Logout</button>
      </div>
    </div>

    <!-- MAIN DASHBOARD CONTENT -->
    <div class="dashboard-container">

      <!-- User Greeting -->
      <div class="greeting-block">
        <h2 class="dashboard-title">Hi, {{ user.full_name || 'Provider' }}</h2>
        <p class="university-text">
          {{ roleLabel }}<span v-if="user.service_area"> &middot; {{ user.service_area }}</span>
        </p>
      </div>

      <!-- Profile Stats Card -->
      <div class="card">
        <h3 class="card-heading">My Profile</h3>

        <div class="stats-grid">
          <div class="stat-card" style="background-color: #f0fdf4; border-bottom: 3px solid #2e7d5a;">
            <span class="stat-title">Assigned Jobs</span>
            <span class="stat-value" style="color: #2e7d5a;">{{ assignedJobs.length }}</span>
          </div>

          <div class="stat-card" style="background-color: #f0fdfa; border-bottom: 3px solid #00a6a6;">
            <span class="stat-title">Rating</span>
            <span class="stat-value" style="color: #00a6a6;">{{ user.rating || '0.0' }}</span>
          </div>

          <div class="stat-card" style="background-color: #fffbeb; border-bottom: 3px solid #f5b941;">
            <span class="stat-title">Completed</span>
            <span class="stat-value" style="color: #f5b941;">{{ completedJobs }}</span>
          </div>
        </div>
      </div>

      <!-- Account Management Card -->
      <div class="card">
        <h3 class="card-heading">Account Management</h3>

        <div class="menu-item">
          <router-link to="/safehome" class="menu-link">
            Available Jobs <span class="arrow">&gt;</span>
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

<script>
import Swal from 'sweetalert2'
import { dashAPI, authAPI, session, LOGOUT_MESSAGES } from '@/services/api';

export default {
  name: 'ProviderDashboard',

  data() {
    return {
      sideNavOpen: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      user: {},
      // jobs assigned to this provider
      assignedJobs: []
    };
  },

  async mounted() {
    this.user = session.get() || {};

    if (!this.user.id) {
      this.$router.push('/login');
      return;
    }

    try {
      const data = await dashAPI.getProvider(this.user.id);
      this.assignedJobs = data.assignedJobs || [];
    } catch (err) {
      console.error('Failed to load provider dashboard:', err.message);
    }
  },

  computed: {
    formattedDate() {
      const now = new Date();
      return now.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    // count of jobs marked as completed
    completedJobs() {
      return this.assignedJobs.filter(j => j.status === 'completed').length;
    },

    // avatar initials — "Cape Town Express Plumbing" becomes "CT"
    initials() {
      if (!this.user.full_name) return 'SP';
      return this.user.full_name
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    },

    // friendly label for the backend role ENUM
    roleLabel() {
      const labels = {
        student: 'Student',
        service_provider: 'Service Provider',
        res_manager: 'Residence Manager',
        admin: 'Administrator'
      };
      return labels[this.user.role] || 'Service Provider';
    },

    // who can see Academic Marketplace? students, admins, res managers (NOT providers)
    canSeeAcademic() {
      return ['student', 'admin', 'res_manager'].includes(this.user.role);
    },

    // who can see Checkout? students, admins, res managers (NOT providers)
    canSeeCheckout() {
      return ['student', 'admin', 'res_manager'].includes(this.user.role);
    },

    // own dashboard route — same on every dashboard
    myDashboard() {
      const routes = {
        student: '/student-dashboard',
        service_provider: '/provider-dashboard',
        admin: '/admin-dashboard',
        res_manager: '/resmanager-dashboard'
      };
      return routes[this.user.role] || '/login';
    }
  },

  methods: {
    toggleSideNav() {
      this.sideNavOpen = !this.sideNavOpen;
      document.body.style.overflow = this.sideNavOpen ? 'hidden' : '';
    },

    closeSideNav() {
      this.sideNavOpen = false;
      document.body.style.overflow = '';
    },

    // notification bell
    notifyClick() {
      Swal.fire({
        icon: 'info',
        title: 'Notifications',
        text: 'You have 3 new notifications.',
        timer: 1500,
        showConfirmButton: false,
      });
    },

    // logout — role-specific message + clears session
    async logout() {
      const result = await Swal.fire({
        title: 'Logout?',
        text: 'Are you sure you want to log out of your provider account?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const message = LOGOUT_MESSAGES[this.user.role] || 'Logged out.';
        session.clear();
        await Swal.fire({
          icon: 'success',
          title: message,
          timer: 1800,
          showConfirmButton: false
        });
        this.$router.push('/login');
      }
    },

    // change password — hits the real backend
    async changePassword() {
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        await Swal.fire({
          icon: 'warning',
          title: 'Incomplete',
          text: 'Please fill in all password fields.',
          confirmButtonColor: '#f5b941',
        });
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        await Swal.fire({
          icon: 'error',
          title: 'Passwords Do Not Match',
          text: 'New password and confirmation must match.',
          confirmButtonColor: '#d33',
        });
        return;
      }

      if (this.newPassword.length < 6) {
        await Swal.fire({
          icon: 'error',
          title: 'Password Too Short',
          text: 'Password must be at least 6 characters long.',
          confirmButtonColor: '#d33',
        });
        return;
      }

      try {
        await authAPI.changePassword(
          this.user.id,
          this.currentPassword,
          this.newPassword
        );

        await Swal.fire({
          icon: 'success',
          title: 'Password Updated!',
          text: 'Your password has been changed successfully.',
          timer: 2000,
          showConfirmButton: false,
        });

        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      } catch (err) {
        await Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.message,
          confirmButtonColor: '#d33',
        });
      }
    }
  }
};
</script>

<style scoped>
/* Base layout */
.dashboard-page {
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

/* Top Right & Alert Bell */
.top-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 15px;
}

.notification-bell {
  position: relative;
  cursor: pointer;
  font-size: 24px;
  color: #fff;
  transition: color 0.3s ease;
}

.notification-bell:hover {
  color: #f5b941;
}

.notification-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background-color: #ff4d4f;
  border-radius: 50%;
  border: 2px solid #0d1b3d;
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

/* user footer with inline logout */
.side-nav-user {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #d1d5db;
}

.side-nav-user p {
  margin: 4px 0;
  font-size: 14px;
}

.side-user-uni {
  font-size: 12px;
  opacity: 0.7;
}

.side-logout-btn {
  margin-top: 12px;
  width: 100%;
  background: transparent;
  border: 2px solid #f5b941;
  color: #f5b941;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.side-logout-btn:hover {
  background-color: #f5b941;
  color: #0d1b3d;
}

/* Dashboard Content */
.dashboard-container {
  max-width: 650px;
  margin: 0 auto;
  padding: 30px 20px;
}

.greeting-block {
  margin-bottom: 24px;
}

.dashboard-title {
  color: #0d1b3d;
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.university-text {
  color: #6c4b6a;
  font-size: 15px;
  font-weight: 500;
  margin: 0;
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
}

.arrow {
  font-weight: bold;
  color: #9ca3af;
  transition: transform 0.25s ease, color 0.25s ease;
}

.menu-link:hover .arrow {
  color: #2e7d5a;
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
  .stats-grid {
    gap: 8px;
  }
  .stat-card {
    padding: 10px;
  }
}
</style>