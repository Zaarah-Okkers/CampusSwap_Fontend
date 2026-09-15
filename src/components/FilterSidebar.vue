<script setup>
import { ref } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'apply'])

const condition = ref(props.filters.condition || 'any')
const maxPrice = ref(props.filters.maxPrice || '')
const university = ref(props.filters.university || '')
const listingType = ref(props.filters.listingType || 'all')
const sortBy = ref(props.filters.sortBy || 'recommended')

function apply() {
  emit('apply', {
    condition: condition.value,
    maxPrice: maxPrice.value,
    university: university.value,
    listingType: listingType.value,
    sortBy: sortBy.value
  })
}

function reset() {
  condition.value = 'any'
  maxPrice.value = ''
  university.value = ''
  listingType.value = 'all'
  sortBy.value = 'recommended'
}
</script>

<template>
  <div class="sheet-overlay" @click.self="emit('close')">
    <div class="sheet-box glass-panel">
      <div class="sheet-header">
        <div class="drag-handle"></div>
        <button class="close-btn" @click="emit('close')" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="sheet-body">
        <h3>Filters</h3>

        <div class="field">
          <label>Listing type</label>
          <div class="pill-row">
            <button
              v-for="t in ['all', 'sell', 'rent', 'swap']"
              :key="t"
              :class="{ active: listingType === t }"
              @click="listingType = t"
            >
              {{ t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1) }}
            </button>
          </div>
        </div>

        <div class="field">
          <label>Condition</label>
          <div class="pill-row">
            <button
              v-for="c in ['any', 'New', 'Good', 'Fair']"
              :key="c"
              :class="{ active: condition === c }"
              @click="condition = c"
            >
              {{ c === 'any' ? 'Any' : c }}
            </button>
          </div>
        </div>

        <div class="field">
          <label>Max price (R)</label>
          <input v-model="maxPrice" type="number" placeholder="No limit" class="input" />
        </div>

        <div class="field">
          <label>University</label>
          <input v-model="university" type="text" placeholder="e.g. UKZN, DUT..." class="input" />
        </div>

        <div class="field">
          <label>Sort by</label>
          <div class="pill-row sort-row">
            <button
              v-for="s in [
                { key: 'recommended', label: 'Recommended' },
                { key: 'price-asc', label: 'Price ↑' },
                { key: 'price-desc', label: 'Price ↓' },
                { key: 'newest', label: 'Newest' },
                { key: 'rating', label: 'Top rated' }
              ]"
              :key="s.key"
              :class="{ active: sortBy === s.key }"
              @click="sortBy = s.key"
            >
              {{ s.label }}
            </button>
          </div>
        </div>

        <div class="btn-row">
          <button class="reset-btn" @click="reset">Reset</button>
          <button class="apply-btn" @click="apply">Apply filters</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 20, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fade-in 0.25s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.sheet-box {
  background: var(--ink-elevated);
  border-radius: 24px;
  max-width: 560px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 0;
  animation: slide-up 0.3s ease;
  border: 1px solid var(--glass-border);
}

@keyframes slide-up {
  from { transform: translateY(30px) scale(0.97); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.sheet-header {
  position: sticky;
  top: 0;
  background: var(--ink-elevated);
  padding: 12px 20px 0;
  z-index: 2;
  border-radius: 24px 24px 0 0;
}

.drag-handle {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--glass-border);
  margin: 0 auto 10px;
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(10, 14, 39, 0.6);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.close-btn svg {
  width: 14px;
  height: 14px;
}

.sheet-body {
  padding: 0 20px 26px;
}

.sheet-body h3 {
  margin: 0 0 20px;
  font-size: 22px;
  color: var(--text);
  font-family: 'Fraunces', serif;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.pill-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sort-row {
  gap: 6px;
}

.pill-row button {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-row button:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.pill-row button.active {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--ink);
}

.input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(232, 181, 77, 0.15);
}

.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.reset-btn {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.apply-btn {
  flex: 2;
  padding: 13px;
  border-radius: 12px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(232, 181, 77, 0.3);
}

.apply-btn:active {
  transform: scale(0.98);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .sheet-box {
    width: 100%;
    max-height: 100vh;
    border-radius: 24px 24px 0 0;
    bottom: 0;
    position: absolute;
    animation: slide-up-mobile 0.3s ease;
  }
  
  @keyframes slide-up-mobile {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  
  .sheet-overlay {
    align-items: flex-end;
  }
  
  .sheet-body h3 {
    font-size: 19px;
  }
  
  .pill-row button {
    padding: 7px 12px;
    font-size: 12px;
  }
}

@media (min-width: 641px) {
  .sheet-box {
    max-width: 560px;
  }
}
</style>