<script setup>
import ProductCard from './ProductCard.vue'
import CategoryPills from './CategoryPills.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  products: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    default: 'all'
  },
  savedIds: {
    type: Set,
    default: () => new Set()
  }
})

const emit = defineEmits(['select', 'open-sell', 'update:category', 'toggle-save'])

// Handle product click - navigate to chat for swap items
function handleProductClick(product) {
  if (product.listingType === 'swap') {
    // Navigate to chat with the seller
    router.push({
      path: '/chat',
      query: {
        userId: product.sellerName || 'Unknown',
        productName: product.name,
        productId: product.id
      }
    })
  } else {
    emit('select', product)
  }
}

// Handle card click from ProductCard
function handleCardSelect(product) {
  handleProductClick(product)
}
</script>

<template>
  <section class="product-grid-section">
    <div class="hero glass-panel">
      <span class="hero-eyebrow">South Africa's student marketplace</span>
      <h2>Buy, swap &amp; rent your way through campus</h2>
      <p class="hero-sub">Textbooks, tech and room essentials, traded safely between students.</p>
    </div>

    <CategoryPills :model-value="category" @update:model-value="emit('update:category', $event)" />

    <div class="grid-header">
      <p class="subtitle">{{ products.length }} listing{{ products.length === 1 ? '' : 's' }}</p>
    </div>

    <div class="product-grid" v-if="products.length">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        :saved="savedIds.has(p.id)"
        @select="handleCardSelect"
        @toggle-save="emit('toggle-save', $event)"
      />
    </div>
    <div v-else class="empty glass-panel">
      <p class="empty-title">Nothing matches yet</p>
      <p class="empty-sub">Try a different category or clear your filters.</p>
    </div>

    <button class="fab" @click="emit('open-sell')" aria-label="Sell an item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>
  </section>
</template>

<style scoped>
.product-grid-section {
  flex: 1;
  width: 100%;
  padding: 16px 0 120px;
  margin-top: 0;
}

.hero {
  border-radius: 22px;
  padding: 32px 28px;
  margin-bottom: 20px;
  background:
    linear-gradient(135deg, rgba(108, 92, 231, 0.35), rgba(232, 181, 77, 0.12)),
    var(--glass);
}

.hero-eyebrow {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero h2 {
  font-size: 28px;
  line-height: 1.2;
  margin-bottom: 10px;
}

.hero-sub {
  font-size: 15px;
  color: var(--text-muted);
  max-width: 40ch;
}

.grid-header {
  margin: 20px 0 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--text-faint);
  font-weight: 600;
}

.product-grid {
  display: grid;
  gap: 20px;
  width: 100%;
}

.empty {
  border-radius: 18px;
  padding: 60px 20px;
  text-align: center;
}

.empty-title {
  font-family: 'Fraunces', serif;
  font-size: 20px;
  margin-bottom: 8px;
}

.empty-sub {
  font-size: 14px;
  color: var(--text-muted);
}

.fab {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--gold);
  color: var(--ink);
  border: none;
  box-shadow: 0 10px 28px rgba(232, 181, 77, 0.4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 45;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fab:hover {
  transform: scale(1.05);
  box-shadow: 0 14px 36px rgba(232, 181, 77, 0.5);
}

.fab:active {
  transform: scale(0.95);
}

.fab svg {
  width: 24px;
  height: 24px;
}

/* Responsive grid - full screen */
@media (max-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .hero {
    padding: 20px 16px;
  }
  
  .hero h2 {
    font-size: 22px;
  }
  
  .product-grid-section {
    padding: 12px 0 100px;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1281px) and (max-width: 1536px) {
  .product-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1537px) {
  .product-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 28px;
  }
}
</style>