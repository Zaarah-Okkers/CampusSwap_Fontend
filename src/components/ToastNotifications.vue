<script setup>
import { ref } from 'vue'

const toasts = ref([])

// Toast types with icons
const toastIcons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
}

// Toast colors
const toastColors = {
  success: 'var(--mint)',
  error: 'var(--coral)',
  warning: 'var(--gold)',
  info: 'var(--sky)'
}

// Add a toast notification
function showToast(message, type = 'info', duration = 4000) {
  const id = Date.now()
  toasts.value.push({ id, message, type, duration })
  
  // Auto-remove after duration
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

// Remove a toast
function removeToast(id) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expose methods
defineExpose({
  showToast,
  success: (msg, dur) => showToast(msg, 'success', dur),
  error: (msg, dur) => showToast(msg, 'error', dur),
  warning: (msg, dur) => showToast(msg, 'warning', dur),
  info: (msg, dur) => showToast(msg, 'info', dur)
})

// Get toast class
function getToastClass(type) {
  return {
    'toast-success': type === 'success',
    'toast-error': type === 'error',
    'toast-warning': type === 'warning',
    'toast-info': type === 'info'
  }
}
</script>

<template>
  <div class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="getToastClass(toast.type)"
      :style="{ borderColor: toastColors[toast.type] }"
      @click="removeToast(toast.id)"
    >
      <span class="toast-icon">{{ toastIcons[toast.type] }}</span>
      <span class="toast-message">{{ toast.message }}</span>
      <button class="toast-close" @click.stop="removeToast(toast.id)">✕</button>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  width: 100%;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  background: var(--ink-elevated);
  border: 1px solid;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: slideIn 0.3s ease;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.toast:hover {
  transform: scale(1.02);
}

.toast-success {
  border-color: var(--mint);
}

.toast-error {
  border-color: var(--coral);
}

.toast-warning {
  border-color: var(--gold);
}

.toast-info {
  border-color: var(--sky);
}

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-faint);
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  transition: color 0.2s ease;
}

.toast-close:hover {
  color: var(--text);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .toast-container {
    top: 80px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .toast {
    padding: 12px 14px;
  }
}
</style>