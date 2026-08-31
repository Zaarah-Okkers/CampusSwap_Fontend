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
      <nav class="nav-links">
        <a href="#" class="active">Marketplace</a>
        <a href="#">Home</a>
        <a href="#">SafeHome</a>
        <a href="#">BookSphere</a>
      </nav>
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
  width: 170px;
  min-height: 100vh;
  padding: 64px 16px 20px 0;
  transition: width 0.2s ease, padding 0.2s ease, opacity 0.2s ease;
  overflow: hidden;
}
.side-nav.closed {
  width: 0;
  padding: 20px 0;
  opacity: 0;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  white-space: nowrap;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  padding: 10px 12px;
  border-radius: 6px;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.06);
}

.nav-links a.active {
  color: var(--accent-orange);
  font-weight: 600;
}
</style>