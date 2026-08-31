<script setup>
</script>

<template>
  <header class="app-header">
    <div class="brand">
      <img src="../assets/logo.png" alt="CampusSwap SA" class="logo-badge" />
    </div>

    <div class="search-wrap">
      <input type="text" placeholder="Search textbooks, tech, rooms, tutors..." />
    </div>

    <div class="header-icons">
      <span class="icon">🔔</span>
      <span class="icon">🛒</span>
      <span class="avatar">MN</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--navy);
  color: white;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 10px 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.logo-badge {
  height: 44px;
  width: auto;
  max-width: 200px;
  object-fit: contain;
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