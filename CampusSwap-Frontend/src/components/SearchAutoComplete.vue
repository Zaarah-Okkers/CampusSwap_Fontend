<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  minChars: {
    type: Number,
    default: 2
  }
})

const emit = defineEmits(['select', 'update:modelValue'])

const searchQuery = ref('')
const showSuggestions = ref(false)
const selectedIndex = ref(-1)
const searchInput = ref(null)

// Filter items based on search query
const suggestions = computed(() => {
  if (searchQuery.value.length < props.minChars) return []
  const query = searchQuery.value.toLowerCase()
  return props.items
    .filter(item => 
      item.name?.toLowerCase().includes(query) ||
      item.title?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      item.university?.toLowerCase().includes(query)
    )
    .slice(0, 8)
})

// Select a suggestion
function selectSuggestion(item) {
  emit('select', item)
  emit('update:modelValue', item)
  searchQuery.value = item.name || item.title || ''
  showSuggestions.value = false
  selectedIndex.value = -1
}

// Keyboard navigation
function handleKeydown(event) {
  if (!showSuggestions.value) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
        selectSuggestion(suggestions.value[selectedIndex.value])
      } else if (suggestions.value.length > 0) {
        selectSuggestion(suggestions.value[0])
      }
      break
    case 'Escape':
      showSuggestions.value = false
      selectedIndex.value = -1
      break
  }
}

// Handle input focus
function onFocus() {
  if (searchQuery.value.length >= props.minChars) {
    showSuggestions.value = true
  }
}

// Handle click outside
function onBlur() {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// Clear search
function clearSearch() {
  searchQuery.value = ''
  emit('update:modelValue', null)
  showSuggestions.value = false
  selectedIndex.value = -1
  nextTick(() => {
    searchInput.value?.focus()
  })
}

// Watch search query
watch(searchQuery, (newVal) => {
  if (newVal.length >= props.minChars) {
    showSuggestions.value = true
  } else {
    showSuggestions.value = false
  }
  if (!newVal) {
    emit('update:modelValue', null)
  }
})

defineExpose({ clearSearch, searchInput })
</script>

<template>
  <div class="search-autocomplete">
    <div class="search-input-wrapper">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="handleKeydown"
        class="search-input"
        autocomplete="off"
      />
      <button v-if="searchQuery" class="clear-btn" @click="clearSearch" aria-label="Clear search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Suggestions dropdown -->
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-dropdown glass-panel">
      <div class="suggestions-header">
        <span class="suggestions-title">Suggestions</span>
        <span class="suggestions-count">{{ suggestions.length }} results</span>
      </div>
      <div
        v-for="(item, index) in suggestions"
        :key="item.id || index"
        class="suggestion-item"
        :class="{ active: selectedIndex === index }"
        @mousedown.prevent="selectSuggestion(item)"
      >
        <div class="suggestion-content">
          <span class="suggestion-name">{{ item.name || item.title }}</span>
          <span v-if="item.category" class="suggestion-category">{{ item.category }}</span>
        </div>
        <span v-if="item.university" class="suggestion-university">{{ item.university }}</span>
      </div>
    </div>

    <!-- No results -->
    <div v-if="showSuggestions && searchQuery.length >= minChars && suggestions.length === 0" class="suggestions-dropdown glass-panel">
      <div class="no-results">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>No results found for "<strong>{{ searchQuery }}</strong>"</p>
        <span class="no-results-hint">Try different keywords</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-autocomplete {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 8px 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input-wrapper:focus-within {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(232, 181, 77, 0.15);
}

.search-icon {
  width: 16px;
  height: 16px;
  color: var(--text-faint);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  padding: 0 8px;
}

.search-input::placeholder {
  color: var(--text-faint);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-faint);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
}

.clear-btn svg {
  width: 14px;
  height: 14px;
}

/* Suggestions Dropdown */
.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--ink-elevated);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 100;
  max-height: 320px;
  overflow-y: auto;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px 8px;
  border-bottom: 1px solid var(--glass-border);
}

.suggestions-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.suggestions-count {
  font-size: 11px;
  color: var(--text-faint);
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.suggestion-item:hover,
.suggestion-item.active {
  background: rgba(255, 255, 255, 0.05);
}

.suggestion-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.suggestion-name {
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
}

.suggestion-category {
  font-size: 11px;
  color: var(--text-faint);
}

.suggestion-university {
  font-size: 11px;
  color: var(--text-muted);
}

/* No Results */
.no-results {
  padding: 24px 16px;
  text-align: center;
  color: var(--text-muted);
}

.no-results svg {
  width: 32px;
  height: 32px;
  color: var(--text-faint);
  margin-bottom: 8px;
}

.no-results p {
  font-size: 14px;
  margin: 0 0 4px;
}

.no-results strong {
  color: var(--text);
}

.no-results-hint {
  font-size: 12px;
  color: var(--text-faint);
}
</style>