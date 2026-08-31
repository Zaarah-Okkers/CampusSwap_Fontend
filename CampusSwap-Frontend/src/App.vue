<script setup>
import { ref, computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import SideNav from './components/SideNav.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import ProductGrid from './components/ProductGrid.vue'

const allProducts = ref([
  { id: 1, name: 'HP EliteBook 840 G5', price: 4500, condition: 'Used: Like New', conditionClass: '', rating: 4.8, sales: 12, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)' },
  { id: 2, name: 'University Physics Book', price: 450, condition: 'Like New', conditionClass: '', rating: 4.8, sales: 4, image: 'https://placehold.co/300x200', university: 'Wits' },
  { id: 3, name: 'Anti-Theft Laptop Bag', price: 290, condition: 'Fair Condition', conditionClass: 'fair', rating: 4.8, sales: 8, image: 'https://placehold.co/300x200', university: 'Stellenbosch' },
  { id: 4, name: 'Sony ANC Headphones', price: 1800, condition: 'Like New', conditionClass: '', rating: 4.8, sales: 2, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)' }
])

const filters = ref({
  university: '',
  condition: '',
  maxPrice: 5000
})

const filteredProducts = computed(() => {
  return allProducts.value.filter(p => {
    if (filters.value.university && p.university !== filters.value.university) return false
    if (filters.value.condition && p.condition !== filters.value.condition) return false
    if (p.price > filters.value.maxPrice) return false
    return true
  })
})
</script>

<template>
  <div id="layout">
    <SideNav />
    <div class="main-column">
      <AppHeader />
      <div class="page-body">
        <FilterSidebar :filters="filters" @update:filters="filters = $event" />
        <ProductGrid :products="filteredProducts" />
      </div>
    </div>
  </div>
</template>

<style>
#layout {
  display: flex;
  min-height: 100vh;
}

.main-column {
  flex: 1;
  min-width: 0;
}

.page-body {
  display: flex;
  gap: 24px;
  padding: 24px 28px;
}
</style>