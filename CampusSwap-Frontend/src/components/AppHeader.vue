<script setup>
defineProps({
  search: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:search', 'open-filters'])
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-row">
        <span class="brand-name">CampusSwap<span class="dot">.</span></span>
      </div>

      <div class="search-row">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            :value="search"
            @input="emit('update:search', $event.target.value)"
            type="text"
            placeholder="Search textbooks, tech, rentals..."
          />
        </div>
        <button class="filter-btn" @click="emit('open-filters')" aria-label="Filters">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--ink-elevated);
  border-bottom: 1px solid var(--glass-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 0;
  height: auto;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 24px 10px;
  width: 100%;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.brand-name {
  font-family: 'Fraunces', serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.dot {
  color: var(--gold);
}

.search-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 8px 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-box:focus-within {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(232, 181, 77, 0.15);
}

.search-icon {
  width: 16px;
  height: 16px;
  color: var(--text-faint);
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  width: 100%;
}

.search-box input::placeholder {
  color: var(--text-faint);
}

.filter-btn {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--gold);
}

.filter-btn svg {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (min-width: 641px) and (max-width: 1024px) {
  .header-content {
    padding: 14px 32px 12px;
  }
  
  .brand-name {
    font-size: 20px;
  }
}

@media (min-width: 1025px) {
  .header-content {
    padding: 16px 48px 14px;
  }
  
  .brand-name {
    font-size: 22px;
  }
  
  .search-box {
    padding: 10px 16px;
  }
  
  .search-box input {
    font-size: 14px;
  }
  
  .filter-btn {
    width: 40px;
    height: 40px;
  }
  
  .filter-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>