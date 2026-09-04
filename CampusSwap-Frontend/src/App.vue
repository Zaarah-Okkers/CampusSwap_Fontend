<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import SideNav from './components/SideNav.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import ProductGrid from './components/ProductGrid.vue'
import ProductModal from './components/ProductModal.vue'
import AppFooter from './components/AppFooter.vue'
import SellItemModal from './components/SellItemModal.vue'
import ChatView from './views/ChatView.vue'
import AdminView from './views/AdminView.vue'
import BookStore from './views/Bookstore.vue'
import ToastNotifications from './components/ToastNotifications.vue'
import Breadcrumb from './components/Breadcrumb.vue'

const route = useRoute()
const isChatPage = computed(() => route.path.startsWith('/chat'))
const isAdminPage = computed(() => route.path.startsWith('/admin'))
const isBookPage = computed(() => route.path.startsWith('/books'))
const isHomePage = computed(() => route.path === '/')

const toastRef = ref(null)

// Show welcome toast on mount
onMounted(() => {
  setTimeout(() => {
    if (toastRef.value) {
      toastRef.value.success('👋 Welcome back to CampusSwap!')
    }
  }, 500)
})

const allProducts = ref([
  { id: 1, name: 'HP EliteBook 840 G5', price: 4500, condition: 'Like New', conditionClass: '', rating: 4.8, sales: 12, sellerRating: 4.8, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)', sellerName: 'Thabo M.', description: 'Reliable business laptop in great condition, barely used since I upgraded. Intel Core i5, 8GB RAM, 256GB SSD — more than enough for coding, research, and everyday coursework. Battery still holds a solid full day of charge. Comes with the original charger. No scratches on the screen, light wear on the corners from normal use.' },
  { id: 2, name: 'University Physics Book', listingType: 'swap', swapFor: 'Organic Chemistry Textbook (any edition)', condition: 'Like New', conditionClass: '', rating: 4.8, sales: 4, sellerRating: 4.9, image: 'https://placehold.co/300x200', university: 'Wits', sellerName: 'Aisha K.', description: 'Latest edition prescribed textbook, used for one semester only. No highlighting, no torn pages, no water damage. Covers mechanics, thermodynamics, and electromagnetism in full, with all the practice problem sets intact. I have already finished this module and need a chemistry textbook instead, so looking to trade rather than sell.' },
  { id: 3, name: 'Anti-Theft Laptop Bag', listingType: 'rent', price: 40, rentPeriod: 'week', condition: 'Fair Condition', conditionClass: 'fair', rating: 4.8, sales: 8, sellerRating: 4.6, image: 'https://placehold.co/300x200', university: 'Stellenbosch', sellerName: 'Liam P.', description: 'Padded laptop bag with hidden back-panel zip and slash-resistant strap, fits up to a 15-inch laptop plus books and a charger. Used daily for about a year so there is visible wear on the fabric, but all zips and straps are fully functional. Renting out short-term since I already own a second one.' },
  { id: 4, name: 'Sony ANC Headphones', price: 1800, condition: 'Like New', conditionClass: '', rating: 4.8, sales: 2, sellerRating: 4.7, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)', sellerName: 'Naledi S.', description: 'Sony noise-cancelling over-ear headphones, barely used. Excellent for studying in noisy res common rooms or blocking out lecture hall chatter. Comes with the original case, USB-C charging cable, and audio jack cable. No scuffs on the ear cups or headband.' },
  { id: 5, name: 'Casio Scientific Calculator FX-991', price: 220, condition: 'Like New', conditionClass: '', rating: 4.9, sales: 15, sellerRating: 4.9, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)', sellerName: 'Sipho D.', description: 'Standard-issue engineering/science calculator, exam-approved. Used for one year of first-year modules, still works perfectly, all buttons responsive, screen has no scratches. Comes with the original slide cover. Exact model most first-year courses list on their equipment sheet.' },
  { id: 6, name: 'Desk Lamp with USB Port', price: 180, condition: 'Fair Condition', conditionClass: 'fair', rating: 4.5, sales: 6, sellerRating: 4.4, image: 'https://placehold.co/300x200', university: 'Wits', sellerName: 'Karabo N.', description: 'LED desk lamp with three brightness settings and a built-in USB charging port — handy for res rooms with limited plug points. Some scuffing on the base from moving between digs, but the LED, dimmer, and USB port all work exactly as they should.' },
  { id: 7, name: 'Organic Chemistry Textbook', price: 550, condition: 'Like New', conditionClass: '', rating: 4.7, sales: 3, sellerRating: 4.8, image: 'https://placehold.co/300x200', university: 'Stellenbosch', sellerName: 'Emma V.', description: 'Prescribed organic chemistry textbook, current edition, used for two semesters. Minimal pencil annotations in the margins, no missing pages, spine still intact. Includes access-code page though the code itself has already been used.' },
  { id: 8, name: 'Mini Bar Fridge', listingType: 'rent', price: 120, rentPeriod: 'month', condition: 'Fair Condition', conditionClass: 'fair', rating: 4.3, sales: 5, sellerRating: 4.5, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)', sellerName: 'Zola T.', description: 'Compact bar fridge, perfect size for a res room. A few years old so there is some cosmetic wear on the door, but cooling works fine and it is quiet. Renting out for the semester since I am not around over the holidays.' },
  { id: 9, name: 'TI-84 Plus Graphic Calculator', price: 450, condition: 'Good Condition', conditionClass: '', rating: 4.6, sales: 7, sellerRating: 4.6, image: 'https://placehold.co/300x200', university: 'UKZN', sellerName: 'Nomvula P.', description: 'Graphic calculator required for some stats and engineering modules. Works perfectly, screen is clear, all keys responsive. A bit of surface wear on the back casing from two years of use, nothing that affects function.' },
  { id: 10, name: 'Whiteboard & Marker Set', listingType: 'swap', swapFor: 'A pack of highlighters or sticky notes', condition: 'Good Condition', conditionClass: '', rating: 4.4, sales: 2, sellerRating: 4.5, image: 'https://placehold.co/300x200', university: 'UKZN', sellerName: 'Jordan F.', description: 'Small A3 whiteboard with three markers and an eraser, great for mapping out study schedules or group project brainstorms. Markers still have plenty of ink left. Moving into a smaller room and don\'t have wall space for it anymore.' },
  { id: 11, name: 'JBL Go 3 Bluetooth Speaker', price: 350, condition: 'Like New', conditionClass: '', rating: 4.9, sales: 9, sellerRating: 4.8, image: 'https://placehold.co/300x200', university: 'Stellenbosch', sellerName: 'Ruan B.', description: 'Small waterproof bluetooth speaker, used for maybe two months. Battery life still full. Comes with the original USB-C cable. Selling because I got a bigger speaker as a gift.' },
  { id: 12, name: 'Room Fan (3-speed)', listingType: 'rent', price: 60, rentPeriod: 'week', condition: 'Fair Condition', conditionClass: 'fair', rating: 4.2, sales: 4, sellerRating: 4.3, image: 'https://placehold.co/300x200', university: 'Wits', sellerName: 'Palesa M.', description: 'Compact desk fan with three speed settings, ideal for res rooms without aircon in summer. Some visible dust marks on the grille despite cleaning, but the motor runs quiet and strong on all speeds.' },
  { id: 13, name: 'Intro to Macroeconomics Textbook', price: 400, condition: 'Good Condition', conditionClass: '', rating: 4.5, sales: 6, sellerRating: 4.7, image: 'https://placehold.co/300x200', university: 'UKZN', sellerName: 'Devon C.', description: 'Prescribed textbook for first-year economics, a few pages have highlighter marks but nothing excessive, no torn or missing pages. Great condition for the price given how quickly these get scuffed up.' },
  { id: 14, name: 'iPad 9th Gen (64GB)', price: 6200, condition: 'Like New', conditionClass: '', rating: 4.9, sales: 3, sellerRating: 4.9, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)', sellerName: 'Amahle R.', description: 'Barely-used iPad, great for note-taking and reading course PDFs. Comes with a folio case and Apple Pencil (1st gen) compatible stylus. Battery health still excellent. Selling because I upgraded to a larger model.' }
])

const filters = ref({
  condition: 'any',
  maxPrice: '',
  university: '',
  listingType: 'all',
  sortBy: 'recommended'
})

const searchQuery = ref('')
const selectedProduct = ref(null)
const showSellModal = ref(false)
const showFilters = ref(false)
const savedIds = ref(new Set())

const filteredProducts = computed(() => {
  let list = allProducts.value.filter(p => {
    const type = p.listingType || 'sell'

    if (filters.value.listingType !== 'all' && type !== filters.value.listingType) return false

    if (filters.value.condition !== 'any') {
      if (!p.condition || !p.condition.toLowerCase().includes(filters.value.condition.toLowerCase())) return false
    }

    if (filters.value.maxPrice) {
      const max = Number(filters.value.maxPrice)
      if (p.price && p.price > max) return false
    }

    if (filters.value.university) {
      if (!p.university || !p.university.toLowerCase().includes(filters.value.university.toLowerCase())) return false
    }

    if (searchQuery.value && !p.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false

    return true
  })

  const sorted = [...list]
  switch (filters.value.sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
      break
    case 'price-desc':
      sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
      break
    case 'newest':
      sorted.sort((a, b) => b.id - a.id)
      break
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating)
      break
  }
  return sorted
})

function openProduct(product) {
  selectedProduct.value = product
}

function closeProduct() {
  selectedProduct.value = null
}

function openSellModal() {
  showSellModal.value = true
}

function closeSellModal() {
  showSellModal.value = false
}

function toggleSave(product) {
  const next = new Set(savedIds.value)
  if (next.has(product.id)) {
    next.delete(product.id)
  } else {
    next.add(product.id)
  }
  savedIds.value = next
  // Show toast notification
  if (toastRef.value) {
    if (savedIds.value.has(product.id)) {
      toastRef.value.success(`💾 "${product.name}" saved to your list!`)
    } else {
      toastRef.value.info(`🗑️ "${product.name}" removed from your list.`)
    }
  }
}

function handleApplyFilters(newFilters) {
  filters.value = newFilters
  showFilters.value = false
  if (toastRef.value) {
    toastRef.value.success('✅ Filters applied successfully!')
  }
}

function updateListingType(type) {
  filters.value = { ...filters.value, listingType: type }
}

function addProduct(newItem) {
  const conditionClassMap = {
    'Fair Condition': 'fair'
  }
  allProducts.value.unshift({
    id: Date.now(),
    listingType: newItem.listingType,
    name: newItem.name,
    price: newItem.price,
    rentPeriod: newItem.rentPeriod,
    swapFor: newItem.swapFor,
    condition: newItem.condition,
    conditionClass: conditionClassMap[newItem.condition] || '',
    rating: 0,
    sales: 0,
    sellerRating: 0,
    image: newItem.image || 'https://placehold.co/300x200',
    university: '',
    sellerName: newItem.sellerName,
    description: newItem.description
  })
  showSellModal.value = false
  if (toastRef.value) {
    toastRef.value.success(`✅ "${newItem.name}" has been listed successfully!`)
  }
}

function submitReview({ id, productRating, sellerRating, reviewerName, comment }) {
  const product = allProducts.value.find(p => p.id === id)
  if (!product) return

  if (!product.reviews) product.reviews = []
  product.reviews.unshift({ reviewerName, productRating, sellerRating, comment })

  if (productRating > 0) {
    const newSales = product.sales + 1
    product.rating = Number((((product.rating * product.sales) + productRating) / newSales).toFixed(1))
    product.sales = newSales
  }

  if (sellerRating > 0) {
    product.sellerRating = product.sellerRating
      ? Number(((product.sellerRating + sellerRating) / 2).toFixed(1))
      : sellerRating
  }

  if (selectedProduct.value && selectedProduct.value.id === id) {
    selectedProduct.value = product
  }
  
  if (toastRef.value) {
    toastRef.value.success('⭐ Thank you for your feedback!')
  }
}

// Keyboard shortcuts
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      const searchInput = document.querySelector('.search-box input')
      if (searchInput) {
        searchInput.focus()
      }
    }
    // Escape to close modals
    if (e.key === 'Escape') {
      if (selectedProduct.value) {
        closeProduct()
      }
      if (showSellModal.value) {
        closeSellModal()
      }
      if (showFilters.value) {
        showFilters.value = false
      }
    }
  })
})
</script>

<template>
  <div id="app">
    <!-- Toast Notifications -->
    <ToastNotifications ref="toastRef" />
    
    <!-- Header -->
    <AppHeader v-model:search="searchQuery" @open-filters="showFilters = true" />
    
    <!-- Layout -->
    <div id="layout">
      <div class="main-column">
        <div class="page-body">
          <!-- Breadcrumb (show on all pages except home) -->
          <Breadcrumb v-if="!isHomePage" />
          
          <!-- BookStore -->
          <BookStore v-if="isBookPage" />
          
          <!-- AdminView -->
          <AdminView v-else-if="isAdminPage" />
          
          <!-- ChatView -->
          <ChatView v-else-if="isChatPage" />
          
          <!-- ProductGrid (Home) -->
          <ProductGrid
            v-else-if="isHomePage"
            :products="filteredProducts"
            :category="filters.listingType"
            :saved-ids="savedIds"
            @select="openProduct"
            @open-sell="openSellModal"
            @toggle-save="toggleSave"
            @update:category="updateListingType"
          />
          
          <!-- Empty state for unknown routes -->
          <div v-else class="empty-page glass-panel">
            <h2>Page Not Found</h2>
            <p>Sorry, we couldn't find the page you're looking for.</p>
            <button @click="$router.push('/')" class="go-home-btn">Go Home</button>
          </div>
        </div>
        <AppFooter v-if="!isChatPage && !isAdminPage && !isBookPage" />
      </div>

      <!-- Bottom Navigation -->
      <SideNav />

      <!-- Filter Sidebar -->
      <FilterSidebar
        v-if="showFilters && !isChatPage && !isAdminPage && !isBookPage"
        :filters="filters"
        @apply="handleApplyFilters"
        @close="showFilters = false"
      />

      <!-- Product Modal -->
      <ProductModal
        v-if="selectedProduct && !isChatPage && !isAdminPage && !isBookPage"
        :product="selectedProduct"
        @close="closeProduct"
        @submit-review="submitReview"
      />
      
      <!-- Sell Item Modal -->
      <SellItemModal 
        v-if="showSellModal && !isChatPage && !isAdminPage && !isBookPage" 
        @close="closeSellModal" 
        @submit="addProduct" 
      />
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

body {
  padding-top: 85px !important;
  padding-bottom: 80px !important;
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 0 16px;
  flex: 1;
}

.main-column {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.page-body {
  flex: 1;
  width: 100%;
}

/* Empty Page */
.empty-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  border-radius: 16px;
  text-align: center;
  background: var(--glass);
  border: 1px solid var(--glass-border);
}

.empty-page h2 {
  font-size: 24px;
  color: var(--text);
  margin: 0 0 8px;
  font-family: 'Fraunces', serif;
}

.empty-page p {
  color: var(--text-muted);
  margin: 0 0 20px;
}

.go-home-btn {
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.go-home-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(232, 181, 77, 0.3);
}

/* Keyboard shortcut hint */
.keyboard-hint {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: var(--text-faint);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 11px;
  z-index: 40;
  border: 1px solid var(--glass-border);
  display: none;
}

@media (min-width: 1024px) {
  .keyboard-hint {
    display: block;
  }
}

/* Responsive */
@media (min-width: 640px) {
  #layout {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  #layout {
    padding: 0 32px;
  }
}

@media (min-width: 1280px) {
  #layout {
    padding: 0 48px;
  }
}

@media (min-width: 1536px) {
  #layout {
    padding: 0 64px;
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Selection */
::selection {
  background: var(--gold-soft);
  color: var(--text);
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
</style>