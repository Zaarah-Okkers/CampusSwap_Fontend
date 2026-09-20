<template>
  <div id="app">
    <div id="layout">
      <div class="main-column">
        <div class="page-body">
          <router-view />
        </div>
      </div>
    </div>

    <SideNav v-if="!isAdminRoute" />
    <NotificationBell v-if="isLoggedIn && !isAdminRoute" />

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
import { useStore } from 'vuex'
import SideNav from './components/SideNav.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import NotificationBell from './components/NotificationBell.vue'

const route = useRoute()
const store = useStore()

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

const isLoggedIn = computed(() => store.getters['user/isLoggedIn'] || localStorage.getItem('isLoggedIn') === 'true')

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
