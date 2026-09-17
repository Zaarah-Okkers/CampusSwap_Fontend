<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-row">
        <span class="brand-name">CampusSwap<span class="dot">.</span></span>

        <div class="header-actions">
          <div class="mode-toggle" role="tablist" aria-label="Switch mode">
            <button
              class="mode-btn"
              :class="{ active: mode === 'buyer' }"
              role="tab"
              :aria-selected="mode === 'buyer'"
              @click="setMode('buyer')"
            >
              Buyer
            </button>
            <button
              class="mode-btn"
              :class="{ active: mode === 'seller' }"
              role="tab"
              :aria-selected="mode === 'seller'"
              @click="setMode('seller')"
            >
              Seller
            </button>
          </div>

          <div class="user-switcher" @click.stop>
            <!-- your existing switcher markup goes here -->
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
// import { useRouter } from 'vue-router' // uncomment if you want to navigate on mode change

// const router = useRouter()
const mode = ref('buyer')

function setMode(newMode) {
  mode.value = newMode
  // router.push(newMode === 'seller' ? '/sell' : '/browse')
}
</script>

<style scoped>
.app-header {
  background: #0f1f3d;
  padding: 0 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.brand-name {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 700;
}

.dot {
  color: #4f8cff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mode-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2px;
}

.mode-btn {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.mode-btn.active {
  background: #ffffff;
  color: #0f1f3d;
}

.mode-btn:not(.active):hover {
  color: #ffffff;
}
</style>