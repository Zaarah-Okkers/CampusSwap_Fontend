<template>
  <main class="marketplace-page">
    <nav class="marketplace-actions" aria-label="Marketplace tools">
      <router-link to="/marketplace" class="action active">Marketplace</router-link>
      <router-link to="/books" class="action">Booksphere</router-link>
      <router-link to="/sell-item" class="action">Sell an item</router-link>
    </nav>
    <ProductGrid :products="filteredProducts" :category="category" :saved-ids="savedIds" @update:category="category = $event" @select="selectedProduct = $event" @open-sell="goToSell" @toggle-save="toggleSaved" />
    <ProductModal v-if="selectedProduct" :product="selectedProduct" @close="selectedProduct = null" />
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductGrid from '../components/ProductGrid.vue'
import ProductModal from '../components/ProductModal.vue'

const router = useRouter()
const category = ref('all')
const selectedProduct = ref(null)
const savedIds = ref(new Set())
const products = ref([
  { id: 1, name: 'Organic Chemistry Lecture Notes', price: 65, rating: 4.8, condition: 'Like New', listingType: 'sell', sellerName: 'Aisha K.', sellerRating: 4.8, category: 'sell', image: 'https://placehold.co/600x400/6C5CE7/FFFFFF?text=Chemistry' },
  { id: 2, name: 'Scientific Calculator', price: 240, rating: 4.6, condition: 'Used: Like New', listingType: 'sell', sellerName: 'Sipho D.', sellerRating: 4.6, category: 'sell', image: 'https://placehold.co/600x400/E8B54D/FFFFFF?text=Calculator' },
  { id: 3, name: 'Calculus Textbook', price: 40, rating: 4.9, condition: 'Fair Condition', listingType: 'rent', sellerName: 'Naledi S.', sellerRating: 4.9, category: 'rent', image: 'https://placehold.co/600x400/4ADE80/FFFFFF?text=Calculus' }
])
const filteredProducts = computed(() => category.value === 'all' ? products.value : products.value.filter(product => product.category === category.value))

function toggleSaved(productId) {
  const next = new Set(savedIds.value)
  next.has(productId) ? next.delete(productId) : next.add(productId)
  savedIds.value = next
}
function goToSell() { router.push('/sell-item') }
</script>

<style scoped>
.marketplace-page { min-height: 100vh; padding: 20px 24px 0; }
.marketplace-actions { display: flex; gap: 8px; margin: 0 auto 12px; max-width: 1100px; overflow-x: auto; }
.action { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 9px; color: var(--text-muted); font-size: 13px; font-weight: 700; padding: 10px 14px; white-space: nowrap; }
.action.active, .action:hover { background: var(--gold-soft); color: var(--gold); }
@media (max-width: 640px) { .marketplace-page { padding: 12px 14px 0; } }
</style>
