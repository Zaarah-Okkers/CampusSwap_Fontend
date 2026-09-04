<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue'])

const categories = [
  { key: 'all', label: 'All' },
  { key: 'sell', label: 'Textbooks & Tech' },
  { key: 'rent', label: 'Rentals' },
  { key: 'swap', label: 'Swaps' }
]
</script>

<template>
  <div class="pills">
    <button
      v-for="c in categories"
      :key="c.key"
      class="pill"
      :class="{ active: modelValue === c.key }"
      @click="emit('update:modelValue', c.key)"
    >
      {{ c.label }}
    </button>
  </div>
</template>

<style scoped>
.pills {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 4px 0 8px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.pills::-webkit-scrollbar {
  display: none;
}

.pill {
  flex-shrink: 0;
  padding: 10px 20px;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
}

.pill:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  transform: translateY(-1px);
}

.pill.active {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--ink);
  box-shadow: 0 4px 12px rgba(232, 181, 77, 0.3);
}

.pill.active:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(232, 181, 77, 0.4);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .pills {
    gap: 6px;
    padding: 2px 0 6px;
  }
  
  .pill {
    padding: 7px 14px;
    font-size: 12px;
    border-radius: 18px;
  }
}

@media (min-width: 1025px) {
  .pills {
    gap: 12px;
    justify-content: center;
  }
  
  .pill {
    padding: 12px 28px;
    font-size: 15px;
  }
}
</style>