<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import ProductGrid from './components/ProductGrid.vue'
</script>

<template>
  <div id="app">
    <AppHeader />
    <div class="page-body">
      <FilterSidebar />
      <ProductGrid :products="[]" />
    </div>
  </div>
</template>

<style>
.page-body {
  display: flex;
  gap: 24px;
  padding: 24px 28px;
}
</style>