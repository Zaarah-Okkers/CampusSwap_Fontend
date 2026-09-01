<script setup>
import { ref } from 'vue'

const isOpen = ref(true)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="side-nav-wrap">
    <button class="toggle-btn" @click="toggle">☰</button>
    <aside class="side-nav" :class="{ closed: !isOpen }">
      <div class="nav-content">
        <p class="section-label">MENU</p>
        <nav class="nav-links">
          <a href="#">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Dashboard
          </a>
          <a href="#" class="active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Market
          </a>
          <a href="#">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            Maintenance
          </a>
          <a href="#">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Bookings
          </a>
          <a href="#">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            Messages
          </a>
          <a href="#">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Payments
          </a>
        </nav>

        <p class="section-label account-label">ACCOUNT</p>
        <nav class="nav-links">
          <a href="#">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </a>
          <a href="#">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Settings
          </a>
        </nav>

        <div class="nav-divider"></div>

        <a href="#" class="logout-link">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </a>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.side-nav-wrap {
  display: flex;
  background: #0d1b38;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 20px 14px;
  align-self: flex-start;
}

.side-nav {
  width: 190px;
  min-height: 100vh;
  padding: 20px 16px 20px 0;
  transition: width 0.2s ease, padding 0.2s ease, opacity 0.2s ease;
  overflow: hidden;
}

.side-nav.closed {
  width: 0;
  padding: 20px 0;
  opacity: 0;
}

.nav-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100vh - 40px);
}

.section-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 14px 12px;
  text-transform: uppercase;
}

.account-label {
  margin-top: 24px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  white-space: nowrap;
}

.nav-links a,
.logout-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 16px;
  padding: 12px 14px;
  border-radius: 6px;
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.nav-links a:hover,
.logout-link:hover {
  background: rgba(255, 255, 255, 0.06);
}

.nav-links a.active {
  color: var(--accent-orange);
  font-weight: 600;
}

.nav-divider {
  flex: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 20px;
  align-self: stretch;
}

.logout-link {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.6);
}
</style>