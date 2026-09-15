<script setup>
import { ref, onMounted, watch } from 'vue'

const isDark = ref(true)

onMounted(() => {
  // Check saved theme preference
  const savedTheme = localStorage.getItem('campusswap-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    applyTheme(isDark.value)
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
    applyTheme(prefersDark)
  }
})

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
  localStorage.setItem('campusswap-theme', isDark.value ? 'dark' : 'light')
}

function applyTheme(dark) {
  const root = document.documentElement
  if (dark) {
    root.style.setProperty('--color-background', 'var(--vt-c-black)')
    root.style.setProperty('--color-background-soft', 'var(--vt-c-black-soft)')
    root.style.setProperty('--color-background-mute', 'var(--vt-c-black-mute)')
    root.style.setProperty('--color-border', 'var(--vt-c-divider-dark-2)')
    root.style.setProperty('--color-border-hover', 'var(--vt-c-divider-dark-1)')
    root.style.setProperty('--color-heading', 'var(--vt-c-text-dark-1)')
    root.style.setProperty('--color-text', 'var(--vt-c-text-dark-2)')
  } else {
    root.style.setProperty('--color-background', 'var(--vt-c-white)')
    root.style.setProperty('--color-background-soft', 'var(--vt-c-white-soft)')
    root.style.setProperty('--color-background-mute', 'var(--vt-c-white-mute)')
    root.style.setProperty('--color-border', 'var(--vt-c-divider-light-2)')
    root.style.setProperty('--color-border-hover', 'var(--vt-c-divider-light-1)')
    root.style.setProperty('--color-heading', 'var(--vt-c-text-light-1)')
    root.style.setProperty('--color-text', 'var(--vt-c-text-light-1)')
  }
}

// Watch for changes
watch(isDark, (newVal) => {
  applyTheme(newVal)
})

defineExpose({ toggleTheme, isDark })
</script>

<template>
  <button class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
    <template v-if="isDark">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    </template>
    <template v-else>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </template>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(30deg);
}

.theme-toggle svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 640px) {
  .theme-toggle {
    width: 32px;
    height: 32px;
  }
  
  .theme-toggle svg {
    width: 16px;
    height: 16px;
  }
}
</style>