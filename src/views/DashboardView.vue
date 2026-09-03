<template>
  <div class="dashboard-page">

    <!-- TOP BAR  -->
    <header class="top-bar">
      <!-- Left: Hamburger + Logo -->
      <div class="top-left">
        <button class="hamburger-btn" @click="toggleSideNav" aria-label="Open menu">
          <span class="hamburger-icon">&#9776;</span>
        </button>
        <h2 class="brand">
          CampusSwap<span class="green-text">SA</span>
        </h2>
      </div>

      <!-- Center: Search Bar -->
      <div class="top-center">
        <div class="search-wrap">
          <input
            type="text"
            class="search-input"
            placeholder="Search books, services, and more..."
          />
        </div>
      </div>

      <!-- Right: Profile Avatar (initials) -->
      <div class="top-right" v-if="isLoggedIn">
        <span class="avatar">MN</span>
      </div>

      <div class="top-right" v-else>
        <span class="avatar-placeholder"></span>
      </div>
    </header>

    <!-- SIDE NAV (Copied from Homepage) -->
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
      <ul class="side-nav-links">
        <li><router-link to="/" @click="closeSideNav">Home</router-link></li>
        <li><router-link to="/login" @click="closeSideNav">Login</router-link></li>
        <li><router-link to="/academic" @click="closeSideNav">Academic Marketplace</router-link></li>
        <li><router-link to="/safehome" @click="closeSideNav">SafeHome</router-link></li>
        <li><router-link to="/checkout" @click="closeSideNav">Checkout</router-link></li>
        <li><router-link to="/dashboard" @click="closeSideNav">Dashboard</router-link></li>
        <li><router-link to="/contact" @click="closeSideNav">Contact</router-link></li>
      </ul>
      <div class="side-nav-user" v-if="isLoggedIn">
        <p>Hi! {{ user.name }}</p>
        <p class="side-user-uni">{{ user.university }}</p>
      </div>
    </div>

    <!-- MAIN DASHBOARD CONTENT -->
    <div class="dashboard-container">
      
      <!-- User Greeting -->
      <div class="greeting-block">
        <h2 class="dashboard-title">Hi, Myles 👋</h2>
        <p class="university-text">University of Cape Town</p>

        <!-- Demo Role Switcher (For Testing ONLY) -->
        <div class="demo-role-switcher">
          <label>Demo View:</label>
          <button :class="{ 'active-btn': userRole === 'student' }" @click="userRole = 'student'">Student Section</button>
          <button :class="{ 'active-btn': userRole === 'provider' }" @click="userRole = 'provider'">Provider Section</button>
        </div>
      </div>

      <!-- Profile Stats Card -->
      <div class="card">
        <h3 class="card-heading">My Profile</h3>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-title">Seller Rating</span>
            <span class="stat-value" style="color: #2e7d5a;">4.9</span>
          </div>

          <div class="stat-card">
            <span class="stat-title">Active Listings</span>
            <span class="stat-value" style="color: #00a6a6;">3</span>
          </div>

          <div class="stat-card">
            <span class="stat-title">Saved Total</span>
            <span class="stat-value" style="color: #f5b941;">R1,200</span>
          </div>
        </div>
      </div>

      <!-- Account Management Card -->
      <div class="card">
        <h3 class="card-heading">Account Management</h3>
        
        <!-- STUDENT SECTION -->
        <div v-if="userRole === 'student'" class="role-section student-section">
          <h4 class="role-title">Student Section</h4>
          <div class="menu-item">
            <router-link to="/academic" class="menu-link">Active Orders <span class="arrow">&gt;</span></router-link>
          </div>
          <div class="menu-item">
            <router-link to="/safehome" class="menu-link">SafeHome Bookings <span class="arrow">&gt;</span></router-link>
          </div>
          <div class="menu-item">
            <router-link to="/checkout" class="menu-link">Checkout <span class="arrow">&gt;</span></router-link>
          </div>
        </div>

        <!-- SERVICE PROVIDER SECTION -->
        <div v-else class="role-section provider-section">
          <h4 class="role-title">Service Provider Section</h4>
          <div class="menu-item">
            <router-link to="/safehome" class="menu-link">Manage Bookings <span class="arrow">&gt;</span></router-link>
          </div>
          <div class="menu-item">
            <router-link to="/dashboard" class="menu-link">My Service Listings <span class="arrow">&gt;</span></router-link>
          </div>
          <div class="menu-item">
            <router-link to="/contact" class="menu-link">Support Center <span class="arrow">&gt;</span></router-link>
          </div>
        </div>
      </div>

      <!-- CHANGE PASSWORD CARD -->
      <div class="card">
        <h3 class="card-heading">Change Password</h3>
        
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

        <button class="btn-primary btn-save" @click="changePassword">Update Password</button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',
  data() {
    return {
      isLoggedIn: true,  // For demo, assume user is logged in on dashboard
      sideNavOpen: false,
      userRole: 'student', // Toggle between 'student' and 'provider'
      
      // Password Data
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',

      user: {
        name: 'Myles N.',
        university: 'University of Cape Town'
      }
    };
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
    changePassword() {
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        alert('Please fill in all password fields.');
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        alert('New passwords do not match.');
        return;
      }
      // Fake success logic - actual backend to come later
      alert('Password updated successfully! (This is a demo)');
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }
};
</script>

<style scoped>
/* Copied Top Bar & Side Nav Styles from Homepage */
.dashboard-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

/* ... [Your Existing Top Bar and Side Nav styles remain exactly the same] ... */

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
  transition: background-color 0.3s ease, border-color 0.3s ease;
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
  font-weight: 400;
}

.search-input::placeholder {
  color: #9ca3af;
  font-weight: 300;
}

.top-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
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

.avatar-placeholder {
  width: 36px;
  height: 36px;
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
  padding: 0 4px;
  line-height: 1;
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

/* ============================================
   DASHBOARD CONTENT STYLES
   ============================================ */
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
  color: #6c4b6a; /* Scholar Purple */
  font-size: 15px;
  font-weight: 500;
  margin: 0;
}

/* Demo Role Switcher */
.demo-role-switcher {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  border: 1px dashed #00a6a6;
  font-size: 14px;
}

.demo-role-switcher label {
  font-weight: bold;
  color: #0d1b3d;
}

.demo-role-switcher button {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background: #f0f2f5;
  color: #64748b;
  font-weight: 600;
}

.demo-role-switcher button.active-btn {
  background: #0d1b3d;
  color: #fff;
}

/* Cards */
.card {
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-top: 3px solid #0d1b3d; /* Navy accent */
}

.card-heading {
  color: #0d1b3d;
  font-size: 18px;
  margin: 0 0 16px 0;
  font-weight: 600;
}

/* Role Sections */
.role-section {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fcfcfc;
}

.student-section {
  border-left: 5px solid #2e7d5a; /* Green */
}

.provider-section {
  border-left: 5px solid #00a6a6; /* Teal */
}

.role-title {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
}

.student-section .role-title { color: #2e7d5a; }
.provider-section .role-title { color: #00a6a6; }

/* Stats Grid */
.stats-grid {
  display: flex;
  gap: 12px;
}

.stat-card {
  width: 33.33%;
  background-color: #f4f6f8;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  border-bottom: 2px solid transparent;
}

.stat-card:hover {
  border-bottom-color: #f5b941;
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

/* Account Menu Items */
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

/* Change Password Form Styles */
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

.btn-primary {
  background-color: #f5b941;
  color: #0d1b3d;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.15s ease;
}

.btn-primary:hover {
  background-color: #e0a330;
  transform: translateY(-2px);
}

.btn-save {
  width: 100%;
}

/* Responsive tweaks for dashboard */
@media (max-width: 768px) {
  .top-bar {
    padding: 10px 16px;
    gap: 10px;
  }

  .brand {
    font-size: 18px;
  }

  .top-center {
    order: 3;
    flex-basis: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .top-right {
    display: none;
  }

  .dashboard-container {
    padding: 20px 15px;
  }

  .stats-grid {
    flex-direction: column;
  }

  .stat-card {
    width: 100%;
  }

  .demo-role-switcher {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>