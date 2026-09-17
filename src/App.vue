<template>
  <div id="app">
    <div id="layout">
      <div class="main-column">
        <div class="page-body">
          <router-view />
        </div>
      </div>
    </div>

    <SideNav />

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