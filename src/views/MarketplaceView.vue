<template>
  <main class="marketplace-page">
    <nav class="marketplace-actions" aria-label="Marketplace sections">
      <button class="action" :class="{ active: activeTab === 'marketplace' }" @click="selectTab('marketplace')">Marketplace</button>
      <button class="action" :class="{ active: activeTab === 'books' }" @click="selectTab('books')">Booksphere</button>
    </nav>
    <ProductGrid v-if="activeTab === 'marketplace'" :products="filteredProducts" :category="category" :saved-ids="savedIds" @update:category="category = $event" @select="selectedProduct = $event" @open-sell="goToSell" @toggle-save="toggleSaved" />
    <Bookstore v-else embedded />
    <ProductModal
      v-if="selectedProduct"
      :product="selectedProduct"
      @close="selectedProduct = null"
      @add-to-cart="handleAddToCart"
      @request-swap="handleRequestSwap"
    />
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ProductGrid from '../components/ProductGrid.vue'
import ProductModal from '../components/ProductModal.vue'
import Bookstore from './Bookstore.vue'
import swalTheme from '../utils/swalTheme'

const router = useRouter()
const route = useRoute()
const store = useStore()
const activeTab = ref(route.query.tab === 'books' ? 'books' : 'marketplace')
const category = ref('all')
const selectedProduct = ref(null)
const savedIds = ref(new Set())
const products = ref([
  { id: 1, name: 'Organic Chemistry Lecture Notes', price: 65, rating: 4.8, condition: 'Like New', listingType: 'sell', sellerName: 'Aisha K.', sellerRating: 4.8, university: 'University of Cape Town', category: 'sell', image: 'https://placehold.co/600x400/6C5CE7/FFFFFF?text=Chemistry+Notes' },
  { id: 2, name: 'Scientific Calculator', price: 240, rating: 4.6, condition: 'Used: Like New', listingType: 'sell', sellerName: 'Sipho D.', sellerRating: 4.6, university: 'University of Cape Town', category: 'sell', image: 'https://placehold.co/600x400/E8B54D/FFFFFF?text=Calculator' },
  { id: 3, name: 'Calculus Textbook', price: 40, rating: 4.9, condition: 'Fair Condition', conditionClass: 'fair', listingType: 'rent', rentPeriod: 'week', sellerName: 'Naledi S.', sellerRating: 4.9, university: 'University of Cape Town', category: 'rent', image: 'https://placehold.co/600x400/4ADE80/0A0E27?text=Calculus' },
  { id: 4, name: 'LED Study Desk Lamp', price: 180, rating: 4.7, condition: 'Like New', listingType: 'sell', sellerName: 'Thabo M.', sellerRating: 4.7, university: 'Stellenbosch University', category: 'sell', image: 'https://placehold.co/600x400/6FA8FF/0A0E27?text=Study+Lamp' },
  { id: 5, name: 'Mini Fridge for Residence', price: 125, rating: 4.5, condition: 'Good', listingType: 'rent', rentPeriod: 'month', sellerName: 'Lerato M.', sellerRating: 4.5, university: 'University of the Western Cape', category: 'furniture', image: 'https://placehold.co/600x400/FF8577/FFFFFF?text=Mini+Fridge' },
  { id: 6, name: 'Noise-cancelling Headphones', price: 450, rating: 4.9, condition: 'Like New', listingType: 'sell', sellerName: 'Karabo N.', sellerRating: 4.9, university: 'University of Pretoria', category: 'sell', image: 'https://placehold.co/600x400/9B59B6/FFFFFF?text=Headphones' },
  { id: 7, name: 'Dorm Storage Crates', price: 80, rating: 4.4, condition: 'Good', listingType: 'swap', sellerName: 'Mia D.', sellerRating: 4.4, university: 'University of Johannesburg', category: 'furniture', image: 'https://placehold.co/600x400/2E7D5A/FFFFFF?text=Storage+Crates' },
  { id: 8, name: 'Engineering Drawing Set', price: 95, rating: 4.8, condition: 'Good', listingType: 'sell', sellerName: 'Sibusiso K.', sellerRating: 4.8, university: 'Cape Peninsula University of Technology', category: 'sell', image: 'https://placehold.co/600x400/EF8354/FFFFFF?text=Drawing+Set' },
  { id: 9, name: 'Graphic Design Textbook', price: 55, rating: 4.6, condition: 'Fair Condition', conditionClass: 'fair', listingType: 'swap', sellerName: 'Zanele P.', sellerRating: 4.6, university: 'University of the Witwatersrand', category: 'swap', image: 'https://placehold.co/600x400/3D5A80/FFFFFF?text=Design+Book' },
  { id: 10, name: 'Portable Clothes Rail', price: 110, rating: 4.3, condition: 'Good', listingType: 'rent', rentPeriod: 'semester', sellerName: 'Amahle R.', sellerRating: 4.3, university: 'University of KwaZulu-Natal', category: 'furniture', image: 'https://placehold.co/600x400/7B2CBF/FFFFFF?text=Clothes+Rail' },
  { id: 11, name: 'Compact Study Desk', price: 350, rating: 4.8, condition: 'Like New', listingType: 'sell', sellerName: 'Nandi M.', sellerRating: 4.8, university: 'University of Cape Town', category: 'furniture', image: 'https://placehold.co/600x400/8B5E3C/FFFFFF?text=Study+Desk' },
  { id: 12, name: 'Dorm Room Wall Prints Set', price: 75, rating: 4.7, condition: 'New', listingType: 'sell', sellerName: 'Jade L.', sellerRating: 4.7, university: 'Rhodes University', category: 'furniture', image: 'https://placehold.co/600x400/D26A8D/FFFFFF?text=Wall+Prints' },
  { id: 13, name: 'Bedside Storage Unit', price: 140, rating: 4.5, condition: 'Good', listingType: 'swap', sellerName: 'Neo T.', sellerRating: 4.5, university: 'University of Pretoria', category: 'furniture', image: 'https://placehold.co/600x400/4F772D/FFFFFF?text=Bedside+Unit' }
])
const filteredProducts = computed(() => category.value === 'all' ? products.value : products.value.filter(product => product.category === category.value))

function toggleSaved(productId) {
  const next = new Set(savedIds.value)
  next.has(productId) ? next.delete(productId) : next.add(productId)
  savedIds.value = next
}
function goToSell() { router.push('/sell-item') }

// Buy / rent -> cart. Swap -> alert the seller, who then accepts or declines.
function handleAddToCart(product) {
  store.dispatch('market/addToCart', product)
  swalTheme.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `${product.name} added to cart`,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true
  })
  selectedProduct.value = null
}

function handleRequestSwap(product) {
  const buyer = store.getters['user/currentUser']?.full_name || 'A student'
  store.dispatch('market/requestSwap', { product, buyerName: buyer })
  swalTheme.fire({
    icon: 'success',
    title: 'Seller alerted',
    text: `${product.sellerName || 'The seller'} has been notified of your swap request for "${product.name}". They can accept or decline it.`,
    confirmButtonText: 'Got it'
  })
  selectedProduct.value = null
}

function selectTab(tab) {
  activeTab.value = tab
  router.replace({ path: '/marketplace', query: tab === 'books' ? { tab: 'books' } : {} })
}

watch(() => route.query.tab, (tab) => {
  activeTab.value = tab === 'books' ? 'books' : 'marketplace'
})
</script>

<style scoped>
.marketplace-page { background: var(--ink); min-height: 100vh; padding: 42px 24px 120px; }
.marketplace-actions { display: flex; gap: 8px; margin: 0 auto 12px; max-width: 1100px; overflow-x: auto; scrollbar-width: none; }
.marketplace-actions::-webkit-scrollbar { display: none; }
.action { background: var(--glass-strong); border: 1px solid var(--glass-border); border-radius: 9px; color: var(--text-muted); cursor: pointer; font-size: 13px; font-weight: 700; padding: 10px 14px; transition: background .2s ease, color .2s ease; white-space: nowrap; }
.action.active, .action:hover { background: var(--gold-soft); color: var(--gold); }
@media (max-width: 640px) { .marketplace-page { padding: 24px 14px 110px; } }
</style>
