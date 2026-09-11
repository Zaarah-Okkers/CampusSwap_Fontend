<template>
  <div id="app">
    <AppHeader v-if="!isAdminRoute" v-model:search="searchQuery" @open-filters="showFilters = true" />
    <AppHeader v-else hide-search />

    <div id="layout">
      <div class="main-column">
        <div class="page-body">
          <router-view />
        </div>
      </div>
    </div>

    <SideNav />

    <!-- Filter sidebar only applies to the marketplace, not admin -->
    <FilterSidebar
      v-if="showFilters && !isAdminRoute"
      :filters="filters"
      @apply="handleApplyFilters"
      @close="showFilters = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import SideNav from './components/SideNav.vue'
import FilterSidebar from './components/FilterSidebar.vue'

const route = useRoute()
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

const searchQuery = ref('')
const showFilters = ref(false)

const filters = ref({
  condition: 'any',
  maxPrice: '',
  university: '',
  listingType: 'all',
  sortBy: 'recommended'
})

function handleApplyFilters(newFilters) {
  filters.value = newFilters
  showFilters.value = false
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --ink: #0A0E27;
  --ink-elevated: #12173F;
  --glass: rgba(255,255,255,0.05);
  --glass-border: rgba(255,255,255,0.1);
  --text: #F4F2FF;
  --text-muted: rgba(244,242,255,0.62);
  --text-faint: rgba(244,242,255,0.4);
  --gold: #E8B54D;
  --gold-soft: rgba(232,181,77,0.15);
  --mint: #4ADE80;
  --coral: #FF8577;
  --sky: #6FA8FF;
  --violet: #6C5CE7;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: radial-gradient(120% 60% at 15% 0%, rgba(108,92,231,0.35) 0%, transparent 55%), #0A0E27;
  color: var(--text);
  padding-top: 85px;
  padding-bottom: 80px;
  min-height: 100vh;
}

#app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

#layout {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 85px - 80px);
}

.main-column {
  flex: 1;
}

.page-body {
  flex: 1;
}

.glass-panel {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

@media (min-width: 640px) {
  #app { padding: 0 24px; }
}
@media (min-width: 1024px) {
  #app { padding: 0 32px; }
}
</style>