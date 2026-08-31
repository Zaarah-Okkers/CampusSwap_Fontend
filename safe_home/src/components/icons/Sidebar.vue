```vue
<template>
  <aside
    class="sidebar"
    :class="{ collapsed: isCollapsed }"
  >

    <!-- Logo / Toggle -->
    <div class="sidebar-header">

      <div class="logo">

        <div class="logo-icon">
          🏠
        </div>

        <div
          v-if="!isCollapsed"
          class="logo-text"
        >
          <span>SafeHome</span>
          <strong>ZA</strong>
        </div>

      </div>

      <!-- Toggle Button -->
      <button
        class="toggle-button"
        @click="toggleSidebar"
        :aria-label="isCollapsed ? 'Open sidebar' : 'Close sidebar'"
      >
        {{ isCollapsed ? '☰' : '←' }}
      </button>

    </div>


    <!-- Navigation -->
    <nav class="navigation">

      <p
        v-if="!isCollapsed"
        class="nav-title"
      >
        MENU
      </p>


      <!-- Dashboard -->
      <RouterLink
        to="/"
        class="nav-item"
        title="Dashboard"
      >
        <span class="nav-icon">⌂</span>

        <span
          v-if="!isCollapsed"
          class="nav-label"
        >
          Dashboard
        </span>
      </RouterLink>


      <!-- Maintenance -->
      <RouterLink
        to="/maintenance"
        class="nav-item"
        active-class="active"
        title="Maintenance"
      >
        <span class="nav-icon">🔧</span>

        <span
          v-if="!isCollapsed"
          class="nav-label"
        >
          Maintenance
        </span>
      </RouterLink>


      <!-- Bookings -->
      <RouterLink
        to="/bookings"
        class="nav-item"
        title="Bookings"
      >
        <span class="nav-icon">📅</span>

        <span
          v-if="!isCollapsed"
          class="nav-label"
        >
          Bookings
        </span>
      </RouterLink>


      <!-- Messages -->
      <RouterLink
        to="/messages"
        class="nav-item"
        title="Messages"
      >
        <span class="nav-icon">💬</span>

        <span
          v-if="!isCollapsed"
          class="nav-label"
        >
          Messages
        </span>
      </RouterLink>


      <!-- Payments -->
      <RouterLink
        to="/payments"
        class="nav-item"
        title="Payments"
      >
        <span class="nav-icon">💳</span>

        <span
          v-if="!isCollapsed"
          class="nav-label"
        >
          Payments
        </span>
      </RouterLink>


      <!-- Account -->
      <p
        v-if="!isCollapsed"
        class="nav-title account-title"
      >
        ACCOUNT
      </p>


      <!-- Profile -->
      <RouterLink
        to="/profile"
        class="nav-item"
        title="Profile"
      >
        <span class="nav-icon">👤</span>

        <span
          v-if="!isCollapsed"
          class="nav-label"
        >
          Profile
        </span>
      </RouterLink>


      <!-- Settings -->
      <RouterLink
        to="/settings"
        class="nav-item"
        title="Settings"
      >
        <span class="nav-icon">⚙️</span>

        <span
          v-if="!isCollapsed"
          class="nav-label"
        >
          Settings
        </span>
      </RouterLink>

    </nav>


    <!-- Logout -->
    <div class="sidebar-bottom">

      <button
        class="logout-button"
        title="Logout"
      >

        <span class="nav-icon">
          ↪
        </span>

        <span
          v-if="!isCollapsed"
          class="nav-label"
        >
          Logout
        </span>

      </button>

    </div>

  </aside>
</template>


<script setup>

import { ref } from 'vue'

const isCollapsed = ref(false)

function toggleSidebar() {

  isCollapsed.value =
    !isCollapsed.value

}

</script>


<style scoped>

.sidebar {

  width: 250px;

  height: 100vh;

  position: fixed;

  left: 0;

  top: 0;

  display: flex;

  flex-direction: column;

  background: #ffffff;

  border-right:
    1px solid #e2e8f0;

  z-index: 1000;

  transition:
    width 0.25s ease;

}


/* COLLAPSED */

.sidebar.collapsed {

  width: 72px;

}


/* HEADER */

.sidebar-header {

  height: 80px;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  padding: 0 14px;

  border-bottom:
    1px solid #f1f5f9;

}


.logo {

  display: flex;

  align-items: center;

  min-width: 0;

}


.logo-icon {

  width: 40px;

  height: 40px;

  display: grid;

  place-items: center;

  flex-shrink: 0;

  background: #2563eb;

  border-radius: 10px;

  font-size: 19px;

}


.logo-text {

  margin-left: 10px;

  display: flex;

  align-items: center;

  gap: 4px;

  font-size: 18px;

  font-weight: 700;

  white-space: nowrap;

}


.logo-text span {

  color: #1e293b;

}


.logo-text strong {

  color: #7c3aed;

}


/* TOGGLE */

.toggle-button {

  width: 30px;

  height: 30px;

  display: grid;

  place-items: center;

  flex-shrink: 0;

  border: none;

  border-radius: 7px;

  background: #f1f5f9;

  color: #475569;

  cursor: pointer;

  font-size: 14px;

  transition: 0.2s ease;

}


.toggle-button:hover {

  background: #eff6ff;

  color: #2563eb;

}


/* NAVIGATION */

.navigation {

  flex: 1;

  padding: 25px 12px;

  overflow-y: auto;

}


.nav-title {

  margin: 0 10px 12px;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 1.5px;

  color: #94a3b8;

}


.account-title {

  margin-top: 30px;

}


.nav-item {

  height: 46px;

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 0 12px;

  margin-bottom: 5px;

  border-radius: 9px;

  color: #64748b;

  text-decoration: none;

  font-size: 14px;

  font-weight: 600;

  transition: 0.2s ease;

  white-space: nowrap;

}


.nav-item:hover {

  background: #f1f5f9;

  color: #2563eb;

}


.nav-item.active {

  background: #eff6ff;

  color: #2563eb;

}


.nav-icon {

  width: 24px;

  min-width: 24px;

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 17px;

}


/* COLLAPSED NAV */

.sidebar.collapsed .nav-item {

  justify-content: center;

  padding: 0;

}


.sidebar.collapsed .nav-icon {

  margin: 0;

}


/* LOGOUT */

.sidebar-bottom {

  padding: 20px 12px;

  border-top:
    1px solid #f1f5f9;

}


.logout-button {

  width: 100%;

  height: 44px;

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 0 12px;

  border: none;

  border-radius: 9px;

  background: transparent;

  color: #64748b;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  text-align: left;

}


.logout-button:hover {

  background: #fef2f2;

  color: #dc2626;

}


.sidebar.collapsed .logout-button {

  justify-content: center;

  padding: 0;

}


/* MOBILE */

@media (max-width: 800px) {

  .sidebar {

    width: 72px;

  }

  .sidebar.collapsed {

    width: 0;

    overflow: hidden;

  }

  .sidebar:not(.collapsed) {

    width: 250px;

  }

}

</style>

