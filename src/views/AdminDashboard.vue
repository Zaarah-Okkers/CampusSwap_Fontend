<!-- this is for the company to monitor all usage of the app -->

<template>
  <section class="admin-dash">

    <!-- TOP BAR -->
    <header class="top-bar">

      <div class="top-left">

        <button class="hamburger-btn" @click="toggleSideNav" aria-label="Open menu">

          <span class="hamburger-icon">
            &#9776;
          </span>

        </button>
        
        <!-- Added Router Link so clicking the logo goes Home   - CHECK WHTHER IF IYT WORSK AND NOT REMOVE IT -->

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

      <!-- Added Alert Bell next to Avatar -->
      <div class="top-right">

        <div class="notification-bell" @click="alert('You have 3 new notifications!')">

          <span class="bell-icon">
            &#128276;
          </span>

          <span class="notification-dot">

          </span>
          
        </div>

        <span class="avatar">
          MN
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

        <button class="close-side-btn" @click="closeSideNav">&times;
        </button>

      </div>
      
      <!-- Navigation links -->

      <ul class="side-nav-links">
        
        <li>
          <router-link to="/" @click="closeSideNav">
          Home
        </router-link>
      </li>

        <!-- Academic Marketplace: Students & Admins ONLY -->

        <!-- <li v-if="userRole === 'student' || userRole === 'admin'">
          <router-link to="/academic" @click="closeSideNav">
            Academic Marketplace
          </router-link>
        </li> -->

        <!-- SafeHome: Visible to EVERYONE -->

        <!-- <li>
          <router-link to="/safehome" @click="closeSideNav">
            SafeHome
          </router-link>
        </li> -->

        <!-- Checkout: Students, Admins & Res Managers ONLY (NOT Providers) -->

        <li v-if="userRole === 'student' || userRole === 'admin' || userRole === 'resmanager'">
          <router-link to="/checkout" @click="closeSideNav">
            Checkout
          </router-link>
        </li>

        
        <!-- Dashboard: Visible to EVERYONE -->
        <li>
          <router-link to="/dashboard" @click="closeSideNav">
            Dashboard
          </router-link>
        </li>

            

      </ul>

      <!-- Logout Button at bottom -->

      <div class="side-nav-logout">
        <button class="logout-btn" @click="logout">
          Logout
        </button>
      </div>

    </div>

    <!-- MAIN DASHBOARD CONTENT -->
    <div class="dashboard-container">
      

      <!-- User Greeting -->

      <div class="greeting-block">

        <h2 class="dashboard-title">
          Hi, Admin
        </h2>

        <p class="university-text">
          Platform Administrator
        </p>

      </div>


      <!-- Profile cards -->

      <div class="card">

        <h3 class="card-heading">
          My Profile
        </h3>


        <div class="stats-grid">

          <div class="stat-card-one">

            <span class="stat-title-one">
              Total Users
            </span>

            <span class="stat-value-one">
              4.9
            </span>

          </div>


          <div class="stat-card-two">

            <span class="stat-title-two">
              Total Listings
            </span>

            <span class="stat-value-two">
              3
            </span>
            
          </div>


          <div class="stat-card-three">

            <span class="stat-title-three">
              Reports Pending
            </span>

            <span class="stat-value-three">
              R1,200
            </span>

          </div>
        </div>
      </div>


      <!-- Account Management Card -->

      <div class="card">

        <h3 class="card-heading">
          Account Management
        </h3>

        <div class="menu-item">
          <router-link to="/admin/users" class="menu-link">
            
            Manage Users 

            <span class="arrow">
              &gt;
            </span>

          </router-link>
        </div>

        <div class="menu-item">
          <router-link to="/admin/listings" class="menu-link">

            Manage Listings 

            <span class="arrow">
              &gt;
            </span>

          </router-link>
        </div>

        <div class="menu-item">

          <router-link to="/admin/reports" class="menu-link">
            
            Reports & Analytics 

            <span class="arrow">
              &gt;
            </span>

          </router-link>
        </div>

        <div class="menu-item">
          
          <router-link to="/checkout" class="menu-link">
            
            Checkout 

            <span class="arrow">
              &gt;
            </span>

          </router-link>
        </div>


        <!-- Change Password Section -->

        <div class="password-section">

          <h4 class="password-title">
            Change Password
          </h4>
          
          <div class="form-group">

            <label>
              Current Password
            </label>

            <input type="password" v-model="currentPassword" class="form-input" placeholder="Enter current password"/>

          </div>

          <div class="form-group">

            <label>
              New Password
            </label>

            <input type="password" v-model="newPassword" class="form-input" placeholder="Enter new password" />

          </div>

          <div class="form-group">

            <label>
              Confirm New Password
            </label>

            <input type="password" v-model="confirmPassword" class="form-input" placeholder="Re-enter new password" />

          </div>

          <button class="btn-save" @click="changePassword">
            Update Password
          </button>

        </div>

      </div>

    </div>
  
  </section>
</template>

<script>
import Swal from 'sweetalert2'

export default {

  name: 'AdminDashboard',
  data() {
    return {
      sideNavOpen: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      userRole: 'admin'
    };
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
    }
  },

  methods: {
    // -------- Toggle side navigation --------
    toggleSideNav() {
      this.sideNavOpen = !this.sideNavOpen;
      document.body.style.overflow = this.sideNavOpen ? 'hidden' : '';
    },

    closeSideNav() {
      this.sideNavOpen = false;
      document.body.style.overflow = '';
    },

    // -------- Logout with confirmation --------
    async logout() {
      const result = await Swal.fire({
        title: 'Logout?',
        text: 'Are you sure you want to log out of the admin panel?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        Swal.fire('Logged Out', 'You have been logged out successfully.', 'success');
        this.$router.push('/login');
      }
    },

    // -------- Change Password with SweetAlert --------
    async changePassword() {
      
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        await Swal.fire({
          icon: 'warning',
          title: 'Incomplete',
          text: 'Please fill in all password fields.',
          confirmButtonColor: 'red',
        });
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        await Swal.fire({
          icon: 'error',
          title: 'Passwords Do Not Match',
          text: 'New password and confirmation must match.',
          confirmButtonColor: 'green',
        });
        return;
      }

      if (this.newPassword.length < 6) {
        await Swal.fire({
          icon: 'error',
          title: 'Password Too Short',
          text: 'Password must be at least 6 characters long.',
          confirmButtonColor: 'orange',
        });
        return;
      }

    
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
    },

    // -------- Quick Actions with SweetAlert --------
    async manageUsers() {
      await Swal.fire({
        icon: 'info',
        title: 'Manage Users',
        text: 'Navigating to User Management...',
        timer: 1500,
        showConfirmButton: false,
      });
    },

    async viewListings() {
      await Swal.fire({
        icon: 'info',
        title: 'View Listings',
        text: 'Navigating to All Listings...',
        timer: 1500,
        showConfirmButton: false,
      });
    },

    async viewReports() {
      await Swal.fire({
        icon: 'info',
        title: 'View Reports',
        text: 'Navigating to Reports Center...',
        timer: 1500,
        showConfirmButton: false,
      });
    },

    async exportData() {

      const result = await Swal.fire({
        title: 'Export Data?',
        text: 'This will export all platform data as a CSV file.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        confirmButtonText: 'Export Now',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        await Swal.fire({
          icon: 'success',
          title: 'Export Started!',
          text: 'Your data export will be ready in a few moments.',
          timer: 2000,
          showConfirmButton: false,
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

/* Make logo a link */
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

/* Logout Button at bottom (Gold on hover) */
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
  border-bottom: 2px solid #6c4b6a; /* Purple accent */
}

/* Stats Grid */
.stats-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap; 
}

.stat-card-one {
  flex: 1 1 150px; 
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  background-color: #f0fdf4; 
  border-bottom: 3px solid #2e7d5a;

}
.stat-card-two {
  flex: 1 1 150px; 
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  background-color: #f0fdfa; 
  border-bottom: 3px solid #00a6a6;
  

}
.stat-card-three {
  flex: 1 1 150px; 
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  background-color: #fffbeb; 
  border-bottom: 3px solid #f5b941;
  

}

.stat-title {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 5px;
  font-weight: 500;
}

.stat-value-one {
  font-weight: bold;
  font-size: 22px;
  display: block;
  color: #2e7d5a;
  
}
.stat-value-two {
  font-weight: bold;
  font-size: 22px;
  display: block;
  color: #00a6a6;
  
}
.stat-value-three {
  font-weight: bold;
  font-size: 22px;
  display: block;
  color: #f5b941;
  
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
  
  /* No more stacking, just smaller gap */
  .stats-grid {
    gap: 8px;
  }
  .stat-card-one {
    padding: 10px;
  }
  .stat-card-two {
    padding: 10px;
  }
  .stat-card-three {
    padding: 10px;
  }
}
</style>

 