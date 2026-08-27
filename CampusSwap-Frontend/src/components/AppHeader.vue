<template>
  <header class="app-header">
    <div class="brand">
      <span class="logo-badge">⊗</span>
      <span class="brand-name">CampusSwap<span class="brand-accent">SA</span></span>
    </div>

    <div class="search-wrap">
      <input type="text" placeholder="Search textbooks, tech, rooms, tutors..." />
    </div>

    <nav class="nav-links">
      <a href="#" class="active">Marketplace</a>
      <a href="#">Home</a>
      <a href="#">SafeHome</a>
      <a href="#">BookSphere</a>
    </nav>

    <div class="header-icons">
      <span class="icon">🔔</span>
      <span class="icon">🛒</span>
      <span class="avatar">MN</span>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-header {
  background: var(--navy);
  color: white;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 28px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  white-space: nowrap;
}

.logo-badge {
  background: var(--accent-orange);
  color: var(--navy);
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.brand-accent {
  color: var(--accent-orange);
}

.search-wrap {
  flex: 1;
  max-width: 420px;
}

.search-wrap input {
  width: 100%;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 14px;
}

.search-wrap input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.nav-links {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
}

.nav-links a.active {
  color: var(--accent-orange);
  font-weight: 600;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.icon {
  cursor: pointer;
}

.avatar {
  background: var(--accent-orange);
  color: var(--navy);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
</style>