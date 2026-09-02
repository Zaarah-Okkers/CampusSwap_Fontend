<script setup>
import { ref, computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import SideNav from './components/SideNav.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import ProductGrid from './components/ProductGrid.vue'
import ProductModal from './components/ProductModal.vue'
import AppFooter from './components/AppFooter.vue'
import SellItemModal from './components/SellItemModal.vue'

const allProducts = ref([
  { id: 1, name: 'HP EliteBook 840 G5', price: 4500, condition: 'Used: Like New', conditionClass: '', rating: 4.8, sales: 12, sellerRating: 4.8, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)', sellerName: 'Thabo M.', description: 'Reliable business laptop in great condition, barely used since I upgraded. Intel Core i5, 8GB RAM, 256GB SSD — more than enough for coding, research, and everyday coursework. Battery still holds a solid full day of charge. Comes with the original charger. No scratches on the screen, light wear on the corners from normal use. Perfect for a student who needs something dependable without paying laptop-shop prices.' },
  { id: 2, name: 'University Physics Book', listingType: 'swap', swapFor: 'Organic Chemistry Textbook (any edition)', condition: 'Like New', conditionClass: '', rating: 4.8, sales: 4, sellerRating: 4.9, image: 'https://placehold.co/300x200', university: 'Wits', sellerName: 'Aisha K.', description: 'Latest edition prescribed textbook, used for one semester only. No highlighting, no torn pages, no water damage — genuinely looks almost new. Covers mechanics, thermodynamics, and electromagnetism in full, with all the practice problem sets intact. I have already finished this module and need a chemistry textbook instead, so looking to trade rather than sell.' },
  { id: 3, name: 'Anti-Theft Laptop Bag', listingType: 'rent', price: 40, rentPeriod: 'week', condition: 'Fair Condition', conditionClass: 'fair', rating: 4.8, sales: 8, sellerRating: 4.6, image: 'https://placehold.co/300x200', university: 'Stellenbosch', sellerName: 'Liam P.', description: 'Padded laptop bag with hidden back-panel zip and slash-resistant strap, fits up to a 15-inch laptop plus books and a charger. Used daily for about a year so there\'s visible wear on the fabric and one small mark near the base, but all zips and straps are fully functional and the padding is still solid. Renting this out short-term since I already own a second one — great if you just need coverage for exam season or a trip.' },
  { id: 4, name: 'Sony ANC Headphones', price: 1800, condition: 'Like New', conditionClass: '', rating: 4.8, sales: 2, sellerRating: 4.7, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)', sellerName: 'Naledi S.', description: 'Sony noise-cancelling over-ear headphones, barely used — I got a pair as a gift and already had these. Excellent for studying in noisy res common rooms or blocking out lecture hall chatter. Comes with the original case, USB-C charging cable, and audio jack cable. Battery life is still exactly as advertised. No scuffs on the ear cups or headband.' },
  { id: 5, name: 'Casio Scientific Calculator FX-991', price: 220, condition: 'Like New', conditionClass: '', rating: 4.9, sales: 15, sellerRating: 4.9, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)', sellerName: 'Sipho D.', description: 'Standard-issue engineering/science calculator, exam-approved. Used for one year of first-year modules, still works perfectly, all buttons responsive, screen has no scratches. Comes with the original slide cover. This is the exact model most first-year courses list on their equipment sheet, so it\'ll save you a trip to the bookstore.' },
  { id: 6, name: 'Desk Lamp with USB Port', price: 180, condition: 'Fair Condition', conditionClass: 'fair', rating: 4.5, sales: 6, sellerRating: 4.4, image: 'https://placehold.co/300x200', university: 'Wits', sellerName: 'Karabo N.', description: 'LED desk lamp with three brightness settings and a built-in USB charging port — handy for res rooms with limited plug points. Some scuffing on the base from moving between digs, but the LED, dimmer, and USB port all work exactly as they should. Great for late-night study sessions without waking a roommate with a harsh overhead light.' },

  { id: 7, name: 'Organic Chemistry Textbook', price: 550, condition: 'Used: Like New', conditionClass: '', rating: 4.7, sales: 3, sellerRating: 4.8, image: 'https://placehold.co/300x200', university: 'Stellenbosch', sellerName: 'Emma V.', description: 'Prescribed organic chemistry textbook, current edition, used for two semesters. Minimal pencil annotations in the margins (easily erased), no missing pages, spine still intact. Includes access-code page though the code itself has already been used — check with your module coordinator whether a fresh code is required before relying on it.' },

 { id: 8, name: 'Mini Bar Fridge', listingType: 'rent', price: 120, rentPeriod: 'month', condition: 'Fair Condition', conditionClass: 'fair', rating: 4.3, sales: 5, sellerRating: 4.5, image: 'https://placehold.co/300x200', university: 'University of Cape Town (UCT)', sellerName: 'Zola T.', description: 'Compact bar fridge, perfect size for a res room. A few years old so there is some cosmetic wear on the door, but cooling works fine and it is quiet enough not to disturb sleep. Renting out for the semester since I am not around over the holidays — buyer/renter arranges collection, it is a bit heavy to move alone.' }
])

const filters = ref({
  university: '',
  condition: '',
  maxPrice: 5000
})

const searchQuery = ref('')
const selectedProduct = ref(null)
const showSellModal = ref(false)

const filteredProducts = computed(() => {
  return allProducts.value.filter(p => {
    if (filters.value.university && p.university !== filters.value.university) return false
    if (filters.value.condition && p.condition !== filters.value.condition) return false
    if (p.price > filters.value.maxPrice) return false
    if (searchQuery.value && !p.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    return true
  })
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
}
</script>

<template>
  <div id="layout">
    <SideNav />
    <div class="main-column">
      <AppHeader v-model:search="searchQuery" />
      <div class="page-body">
        <FilterSidebar :filters="filters" @update:filters="filters = $event" />
        <ProductGrid :products="filteredProducts" @select="openProduct" @open-sell="openSellModal" />
      </div>
      <AppFooter />
    </div>

    <ProductModal
  v-if="selectedProduct"
  :product="selectedProduct"
  @close="closeProduct"
  @submit-review="submitReview"
/>
    <SellItemModal v-if="showSellModal" @close="closeSellModal" @submit="addProduct" />
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
  display: flex;
  flex-direction: column;
}

.page-body {
  display: flex;
  gap: 24px;
  padding: 24px 28px;
  flex: 1;
}
</style>