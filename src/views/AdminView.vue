<template>
  <div class="admin-container">

    <!-- Stats strip — visible above every admin tab -->
     
    <div class="stats-strip">
      <div class="stat-card" style="background-color: #f0fdf4; border-bottom: 3px solid #2e7d5a;">
        <span class="stat-title">Total Users</span>
        <span class="stat-value" style="color: #2e7d5a;">{{ stats.totalUsers }}</span>
      </div>

      <div class="stat-card" style="background-color: #f0fdfa; border-bottom: 3px solid #00a6a6;">
        <span class="stat-title">Total Listings</span>
        <span class="stat-value" style="color: #00a6a6;">{{ stats.totalListings }}</span>
      </div>

      <div class="stat-card" style="background-color: #fffbeb; border-bottom: 3px solid #f5b941;">
        <span class="stat-title">Reports Pending</span>
        <span class="stat-value" style="color: #f5b941;">{{ stats.reportsPending }}</span>
      </div>
    </div>

    <!-- pass stats + user down to whatever tab is active -->
    <router-view v-slot="{ Component }">
      <component :is="Component" :stats="stats" :user="user" />
    </router-view>

    <AdminNav />
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import AdminNav from '../components/AdminNav.vue'
import { dashAPI, authAPI, session } from '@/services/api';

export default {
  name: 'AdminDashboard',

  data() {
    return {
      sideNavOpen: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      user: {},
      // real stats from the backend
      stats: {
        totalUsers: 0,
        totalListings: 0,
        reportsPending: 0
      }
    };
  },

  // fetch real stats when the page loads
  async mounted() {
    this.user = session.get() || {};

    // if not logged in, kick them to login page
    if (!this.user.id) {
      this.$router.push('/login');
      return;
    }

    try {
      const data = await dashAPI.getAdmin();
      this.stats = data;
    } catch (err) {
      console.error('Failed to load admin dashboard:', err.message);
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

    // -------- Logout — clears session --------
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
        session.clear();
        await Swal.fire('Logged Out', 'You have been logged out successfully.', 'success');
        this.$router.push('/login');
      }
    },

    // -------- Change Password — hits the real backend --------
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
    },

    // -------- Placeholder methods — pages not built yet --------
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
        confirmButtonColor: '#2e7d5a',
        cancelButtonColor: '#6b7280',
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
.admin-container {
  min-height: calc(100vh - 85px - 80px);
  padding-bottom: 80px;
}

/* Stats strip above the tab content */
.stats-strip {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
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

/* stack nicely on mobile */
@media (max-width: 640px) {
  .stats-strip {
    gap: 8px;
    padding: 12px;
  }
  .stat-card {
    padding: 10px;
  }
}
</style>