<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select'])
</script>

<template>
  <section class="product-grid-section">
    <h2>Tech & Textbooks</h2>
    <p class="subtitle">Campus Academic Marketplace</p>

    <div class="product-grid" v-if="products.length">
      <ProductCard v-for="p in products" :key="p.id" :product="p" @select="emit('select', $event)" />
    </div>
    <p v-else class="empty">No products match those filters.</p>
  </section>
</template>

<style scoped>
.product-grid-section {
  flex: 1;
}

.product-grid-section h2 {
  margin: 0 0 4px;
  font-size: 22px;
  color: var(--text-dark);
}

.subtitle {
  margin: 0 0 20px;
  font-size: 13px;
  color: var(--text-muted);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.empty {
  color: var(--text-muted);
  font-size: 14px;
}
</style>