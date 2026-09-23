<template>
  <main class="marketplace-page">
    <nav class="marketplace-actions" aria-label="Marketplace sections">
      <button class="action" :class="{ active: activeTab === 'marketplace' }" @click="selectTab('marketplace')">Marketplace</button>
      <button class="action" :class="{ active: activeTab === 'books' }" @click="selectTab('books')">Booksphere</button>
    </nav>
    <label v-if="activeTab === 'marketplace'" class="market-search">
      <span>Search listings</span>
      <input v-model="searchQuery" type="search" placeholder="Books, electronics, furniture…" />
    </label>
    <p v-if="loadMessage && activeTab === 'marketplace'" class="listing-status">{{ loadMessage }}</p>
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
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ProductGrid from '../components/ProductGrid.vue'
import ProductModal from '../components/ProductModal.vue'
import Bookstore from './Bookstore.vue'
import swalTheme from '../utils/swalTheme'
import { api } from '../services/api'

const router = useRouter()
const route = useRoute()
const store = useStore()
const activeTab = ref(route.query.tab === 'books' ? 'books' : 'marketplace')
const category = ref('all')
const selectedProduct = ref(null)
const savedIds = ref(new Set())
const products = ref([])
const searchQuery = ref(route.query.q || '')
const loadMessage = ref('')
const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return products.value.filter(product => {
    const categoryMatch = category.value === 'all' || product.category === category.value
    const searchable = [product.name, product.title, product.description, product.category].filter(Boolean).join(' ').toLowerCase()
    return categoryMatch && (!q || searchable.includes(q))
  })
})

const addToCart = (product) => {
  const currentCart = JSON.parse(localStorage.getItem('campusswap_cart') || '[]');
  
  // Check if item already exists in cart
  if (!currentCart.some(item => item.id === product.id)) {
    currentCart.push(product);
    localStorage.setItem('campusswap_cart', JSON.stringify(currentCart));
    
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${product.name || product.title} added to cart`,
      showConfirmButton: false,
      timer: 2000
    });
  } else {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Item already in cart',
      showConfirmButton: false,
      timer: 2000
    });
  }
};

async function loadListings() {
  try {
    const data = await api.getProducts()
    products.value = Array.isArray(data) ? data : (data.products || [])
    if (!products.value.length) loadMessage.value = 'No listings are available yet.'
  } catch {
    products.value = []
    loadMessage.value = 'Listings coming soon — we could not connect to the listings service.'
  }
}

onMounted(loadListings)

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
watch(() => route.query.q, (q) => { searchQuery.value = q || '' })
</script>

<style scoped>
.marketplace-page { background: var(--ink); min-height: 100vh; padding: 42px 24px 120px; }
.marketplace-actions { display: flex; gap: 8px; margin: 0 auto 12px; max-width: 1100px; overflow-x: auto; scrollbar-width: none; }
.marketplace-actions::-webkit-scrollbar { display: none; }
.action { background: var(--glass-strong); border: 1px solid var(--glass-border); border-radius: 9px; color: var(--text-muted); cursor: pointer; font-size: 13px; font-weight: 700; padding: 10px 14px; transition: background .2s ease, color .2s ease; white-space: nowrap; }
.action.active, .action:hover { background: var(--gold-soft); color: var(--gold); }
.market-search { display: grid; gap: 6px; max-width: 1100px; margin: 0 auto 18px; color: var(--text-muted); font-size: 13px; font-weight: 700; }
.market-search input { background: var(--glass-strong); border: 1px solid var(--glass-border); border-radius: 10px; color: var(--text); font: inherit; padding: 12px 14px; }
.listing-status { max-width: 1100px; margin: 0 auto 18px; color: var(--text-muted); }
@media (max-width: 640px) { .marketplace-page { padding: 24px 14px 110px; } }
</style>
