<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select', 'open-sell'])
</script>

<template>
  <section class="product-grid-section">
    <div class="grid-header">
      <div>
        <h2>Tech & Textbooks</h2>
        <p class="subtitle">Campus Academic Marketplace</p>
      </div>
      <button class="sell-btn" @click="emit('open-sell')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Sell an Item
      </button>
    </div>

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

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.product-grid-section h2 {
  margin: 0 0 4px;
  font-size: 22px;
  color: var(--text-dark);
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}

.sell-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--accent-orange);
  color: var(--navy);
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.sell-btn svg {
  width: 16px;
  height: 16px;
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