<template>
  <div class="home">
    <!-- Promo carousel -->
    <div class="promo-carousel glass-panel">
      <div class="promo-track" :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
        <div
          v-for="(slide, i) in promoSlides"
          :key="i"
          class="promo-slide"
          :style="{ background: slide.bg }"
        >
          <span class="promo-eyebrow">{{ slide.eyebrow }}</span>
          <h3>{{ slide.title }}</h3>
          <p>{{ slide.sub }}</p>
          <button class="promo-cta">{{ slide.cta }}</button>
        </div>
      </div>
      <button class="promo-arrow prev" @click="prevSlide" aria-label="Previous">‹</button>
      <button class="promo-arrow next" @click="nextSlide" aria-label="Next">›</button>
      <div class="promo-dots">
        <span
          v-for="(slide, i) in promoSlides"
          :key="i"
          class="dot"
          :class="{ active: i === activeSlide }"
          @click="activeSlide = i"
        />
      </div>
    </div>

    <div class="hero glass-panel">
      <span class="hero-eyebrow">South Africa's student marketplace</span>
      <h2>Buy, swap &amp; rent your way through campus</h2>
      <p class="hero-sub">Textbooks, tech and room essentials, traded safely between students.</p>
    </div>

    <div class="pills">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="pill"
        :class="{ active: category === cat.key }"
        @click="category = cat.key"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="grid-header">
      <p class="subtitle">{{ filteredProducts.length }} listing{{ filteredProducts.length === 1 ? '' : 's' }}</p>
    </div>

    <div class="product-grid" v-if="filteredProducts.length">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card glass-panel"
        @click="openProduct(product)"
      >
        <div class="card-image">
          <img :src="product.image" :alt="product.name" loading="lazy" />
          <span class="condition-badge" :class="product.conditionClass">
            {{ product.condition }}
          </span>
          <span v-if="product.listingType === 'rent'" class="type-badge rent">Rent</span>
          <span v-else-if="product.listingType === 'swap'" class="type-badge swap">Swap</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">{{ product.name }}</h3>
          <p class="card-university">{{ product.university }}</p>
          <div class="card-footer">
            <span v-if="product.listingType === 'swap'" class="card-price swap-text">Swap</span>
            <span v-else class="card-price">
              R{{ product.price }}<span v-if="product.listingType === 'rent'" class="rent-period">/{{ product.rentPeriod }}</span>
            </span>
            <span class="card-rating">
              ⭐ {{ product.rating || 'New' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty glass-panel">
      <p class="empty-title">Nothing matches yet</p>
      <p class="empty-sub">Try a different category or clear your filters.</p>
    </div>

    <!-- Product detail panel -->
    <transition name="panel-fade">
      <div v-if="selectedProduct" class="detail-overlay" @click.self="selectedProduct = null">
        <div class="detail-panel glass-panel">
          <button class="detail-close" @click="selectedProduct = null" aria-label="Close">✕</button>
          <div class="detail-image">
            <img :src="selectedProduct.image" :alt="selectedProduct.name" />
            <span class="condition-badge" :class="selectedProduct.conditionClass">
              {{ selectedProduct.condition }}
            </span>
          </div>
          <div class="detail-body">
            <h3 class="detail-title">{{ selectedProduct.name }}</h3>
            <p class="detail-university">🏛️ {{ selectedProduct.university }}</p>
            <p class="detail-seller">👤 Listed by {{ selectedProduct.sellerName }}</p>

            <div class="detail-price-row">
              <span v-if="selectedProduct.listingType === 'swap'" class="detail-price swap-text">
                Swap for: {{ selectedProduct.swapFor }}
              </span>
              <span v-else class="detail-price">
                R{{ selectedProduct.price }}<span v-if="selectedProduct.listingType === 'rent'" class="rent-period">/{{ selectedProduct.rentPeriod }}</span>
              </span>
              <span class="card-rating">⭐ {{ selectedProduct.rating || 'New' }}</span>
            </div>

            <p class="detail-description">{{ selectedProduct.description }}</p>

            <button class="detail-cta" @click="contactSeller(selectedProduct)">
              {{ selectedProduct.listingType === 'swap' ? 'Propose Swap' : 'Contact Seller' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Premium features -->
    <section class="features-section">
      <h2 class="features-heading">Why students choose CampusSwap</h2>
      <div class="features-grid">
        <div class="feature-card glass-panel">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </div>
          <h3>Smart category filters</h3>
          <p>Narrow listings by university, faculty, module code, condition and price in a few taps.</p>
        </div>

        <div class="feature-card glass-panel">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
              <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <h3>Verified student sellers</h3>
          <p>Every seller is tied to a real campus account, so you know who you're trading with.</p>
        </div>

        <div class="feature-card glass-panel">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
              <path d="M12 21s-7-4.4-9.5-8.5C.7 9 2 5.5 5.5 5c2-.3 3.6.7 4.5 2 .9-1.3 2.5-2.3 4.5-2 3.5.5 4.8 4 3 7.5C19 16.6 12 21 12 21z"/>
            </svg>
          </div>
          <h3>Wishlist &amp; saved items</h3>
          <p>Keep an eye on listings you're not ready to buy yet, and get notified if the price drops.</p>
        </div>

        <div class="feature-card glass-panel">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
              <path d="M4 4v5h5"/>
              <path d="M20 20v-5h-5"/>
              <path d="M4 9a8 8 0 0 1 14-4.5L20 9"/>
              <path d="M20 15a8 8 0 0 1-14 4.5L4 15"/>
            </svg>
          </div>
          <h3>Swap &amp; rent options</h3>
          <p>Not every trade needs cash — swap textbooks directly or rent gear for a week or a semester.</p>
        </div>

        <div class="feature-card glass-panel">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
              <path d="M12 22s7-7.5 7-12a7 7 0 0 0-14 0c0 4.5 7 12 7 12z"/>
              <circle cx="12" cy="10" r="2.5"/>
            </svg>
          </div>
          <h3>Campus pickup points</h3>
          <p>Arrange handoffs at familiar, well-lit spots on your own campus — no strangers at your door.</p>
        </div>

        <div class="feature-card cta-card">
          <h3>Got something to sell?</h3>
          <p>List it in minutes and reach students on your campus today.</p>
          <button class="cta-btn" @click="openSellModal">List an item</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="marketplace-footer">
      <div class="footer-brand">CampusSwap<span class="brand-dot">.</span></div>
      <div class="social-links">
        <a href="#" class="social-link" aria-label="Instagram" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/>
          </svg>
        </a>
        <a href="mailto:hello@campusswap.co.za" class="social-link" aria-label="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m2 7 10 6 10-6"/>
          </svg>
        </a>
        <a href="#" class="social-link" aria-label="Facebook" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <path d="M14 9h3V5h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V9a1 1 0 0 1 1-1z"/>
          </svg>
        </a>
        <a href="#" class="social-link" aria-label="Reddit" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <circle cx="12" cy="13" r="8"/>
            <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none"/>
            <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none"/>
            <path d="M8.5 16.5c1 .8 2.2 1.2 3.5 1.2s2.5-.4 3.5-1.2"/>
            <path d="M12 5v3"/>
            <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </a>
      </div>
    </footer>

    <button class="fab" @click="openSellModal">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const category = ref('all')

const categories = [
  { key: 'all', label: 'All' },
  { key: 'sell', label: 'Textbooks & Tech' },
  { key: 'rent', label: 'Rentals' },
  { key: 'swap', label: 'Swaps' }
]

const products = ref([
  { 
    id: 1, 
    name: 'HP EliteBook 840 G5', 
    price: 4500, 
    condition: 'Like New', 
    conditionClass: '', 
    rating: 4.8, 
    sales: 12, 
    image: 'https://placehold.co/300x200/6C5CE7/FFFFFF?text=Laptop',
    university: 'University of Cape Town (UCT)', 
    sellerName: 'Thabo M.', 
    description: 'Reliable business laptop in great condition...' 
  },
  { 
    id: 2, 
    name: 'University Physics Book', 
    listingType: 'swap', 
    swapFor: 'Organic Chemistry Textbook', 
    condition: 'Like New', 
    conditionClass: '', 
    rating: 4.8, 
    sales: 4, 
    image: 'https://placehold.co/300x200/4ADE80/FFFFFF?text=Physics',
    university: 'Wits', 
    sellerName: 'Aisha K.', 
    description: 'Latest edition prescribed textbook...' 
  },
  { 
    id: 3, 
    name: 'Anti-Theft Laptop Bag', 
    listingType: 'rent', 
    price: 40, 
    rentPeriod: 'week', 
    condition: 'Fair Condition', 
    conditionClass: 'fair', 
    rating: 4.8, 
    sales: 8, 
    image: 'https://placehold.co/300x200/FF8577/FFFFFF?text=Bag',
    university: 'Stellenbosch', 
    sellerName: 'Liam P.', 
    description: 'Padded laptop bag with hidden back-panel zip...' 
  },
  { 
    id: 4, 
    name: 'Sony ANC Headphones', 
    price: 1800, 
    condition: 'Like New', 
    conditionClass: '', 
    rating: 4.8, 
    sales: 2, 
    image: 'https://placehold.co/300x200/6FA8FF/FFFFFF?text=Headphones',
    university: 'University of Cape Town (UCT)', 
    sellerName: 'Naledi S.', 
    description: 'Sony noise-cancelling over-ear headphones...' 
  },
  { 
    id: 5, 
    name: 'Casio Scientific Calculator', 
    price: 220, 
    condition: 'Like New', 
    conditionClass: '', 
    rating: 4.9, 
    sales: 15, 
    image: 'https://placehold.co/300x200/E8B54D/FFFFFF?text=Calc',
    university: 'University of Cape Town (UCT)', 
    sellerName: 'Sipho D.', 
    description: 'Standard-issue engineering/science calculator...' 
  },
  { 
    id: 6, 
    name: 'Desk Lamp with USB Port', 
    price: 180, 
    condition: 'Fair Condition', 
    conditionClass: 'fair', 
    rating: 4.5, 
    sales: 6, 
    image: 'https://placehold.co/300x200/9B59B6/FFFFFF?text=Lamp',
    university: 'Wits', 
    sellerName: 'Karabo N.', 
    description: 'LED desk lamp with three brightness settings...' 
  }
])

const filteredProducts = computed(() => {
  let filtered = products.value
  
  if (category.value !== 'all') {
    const type = category.value
    filtered = filtered.filter(p => {
      const pType = p.listingType || 'sell'
      return pType === type
    })
  }
  
  return filtered
})

const selectedProduct = ref(null)

function openProduct(product) {
  selectedProduct.value = product
}

function contactSeller(product) {
  alert(`Messaging feature coming soon! You'd be contacting ${product.sellerName}.`)
}

function openSellModal() {
  alert('🛒 Sell feature coming soon!')
}

// Promo carousel
const activeSlide = ref(0)

const promoSlides = [
  {
    eyebrow: 'Back to campus',
    title: 'Fresh textbook listings, added daily',
    sub: 'Find your set books before lectures start — priced by students, for students.',
    cta: 'Browse textbooks',
    bg: 'linear-gradient(135deg, rgba(108,92,231,0.45), rgba(10,14,39,0.15))'
  },
  {
    eyebrow: 'Save on tech',
    title: 'Laptops & gadgets at campus prices',
    sub: 'Verified sellers, fair conditions, no bidding wars.',
    cta: 'Shop tech',
    bg: 'linear-gradient(135deg, rgba(111,168,255,0.4), rgba(10,14,39,0.15))'
  },
  {
    eyebrow: 'Zero waste',
    title: 'Swap instead of buying new',
    sub: 'Trade textbooks and gear directly with other students.',
    cta: 'Start a swap',
    bg: 'linear-gradient(135deg, rgba(232,181,77,0.4), rgba(10,14,39,0.15))'
  }
]

let carouselTimer = null

function nextSlide() {
  activeSlide.value = (activeSlide.value + 1) % promoSlides.length
}

function prevSlide() {
  activeSlide.value = (activeSlide.value - 1 + promoSlides.length) % promoSlides.length
}

onMounted(() => {
  carouselTimer = setInterval(nextSlide, 6000)
})

onUnmounted(() => {
  clearInterval(carouselTimer)
})
</script>

<style scoped>
.home {
  padding: 16px 0 120px;
}

/* Promo carousel */
.promo-carousel {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  margin-bottom: 20px;
}

.promo-track {
  display: flex;
  transition: transform 0.5s ease;
}

.promo-slide {
  min-width: 100%;
  padding: 36px 60px 40px 28px;
}

.promo-eyebrow {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.promo-slide h3 {
  font-size: 24px;
  line-height: 1.25;
  margin-bottom: 8px;
  color: var(--text);
}

.promo-slide p {
  font-size: 14px;
  color: var(--text-muted);
  max-width: 42ch;
  margin-bottom: 16px;
}

.promo-cta {
  padding: 10px 22px;
  border-radius: 24px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.promo-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.promo-arrow.prev {
  left: 12px;
}

.promo-arrow.next {
  right: 12px;
}

.promo-dots {
  position: absolute;
  bottom: 14px;
  left: 28px;
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dot.active {
  background: var(--gold);
  width: 20px;
  border-radius: 4px;
}

.hero {
  border-radius: 22px;
  padding: 32px 28px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.35), rgba(232, 181, 77, 0.12));
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
  color: var(--text);
}

.hero-sub {
  font-size: 15px;
  color: var(--text-muted);
  max-width: 40ch;
}

.pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0 8px;
  scrollbar-width: none;
}

.pills::-webkit-scrollbar {
  display: none;
}

.pill {
  flex-shrink: 0;
  padding: 10px 20px;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
}

.pill:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.pill.active {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--ink);
}

.grid-header {
  margin: 18px 2px 10px;
}

.subtitle {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-faint);
  font-weight: 600;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.product-card {
  border-radius: 20px;
  overflow: visible;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 0;
  box-shadow: 0 10px 28px rgba(5, 7, 20, 0.28);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  background: var(--glass);
  border: 1px solid var(--glass-border);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(5, 7, 20, 0.4);
}

.card-image {
  position: relative;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
  border-radius: 16px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.condition-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 10px;
  background: rgba(74, 222, 128, 0.2);
  color: var(--mint);
  text-transform: uppercase;
}

.condition-badge.fair {
  background: rgba(232, 181, 77, 0.2);
  color: var(--gold);
}

.type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 10px;
  color: white;
  text-transform: uppercase;
}

.type-badge.rent {
  background: var(--sky);
  color: var(--ink);
}

.type-badge.swap {
  background: var(--violet);
}

.card-body {
  padding: 10px 4px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 4px;
  line-height: 1.3;
}

.card-university {
  font-size: 11.5px;
  color: var(--text-faint);
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-price {
  font-weight: 700;
  font-size: 15px;
  color: var(--mint);
}

.rent-period {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
}

.swap-text {
  color: var(--gold);
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--text-muted);
}

/* Product detail panel */
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 20, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 60;
}

.detail-panel {
  width: 100%;
  max-width: 480px;
  max-height: 88vh;
  overflow-y: auto;
  border-radius: 24px 24px 0 0;
  position: relative;
  background: var(--ink-elevated);
}

.detail-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: rgba(255,255,255,0.08);
  color: var(--text);
  font-size: 16px;
  cursor: pointer;
  z-index: 2;
}

.detail-image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-body {
  padding: 20px;
}

.detail-title {
  font-size: 19px;
  color: var(--text);
  margin: 0 0 6px;
}

.detail-university,
.detail-seller {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 4px;
}

.detail-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 14px 0;
}

.detail-price {
  font-weight: 700;
  font-size: 20px;
  color: var(--mint);
}

.detail-description {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 18px;
}

.detail-cta {
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.2s ease;
}
.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
}

@media (min-width: 640px) {
  .detail-overlay {
    align-items: center;
  }
  .detail-panel {
    border-radius: 24px;
  }
}

/* Premium features */
.features-section {
  margin-top: 44px;
}

.features-heading {
  font-size: 20px;
  color: var(--text);
  margin: 0 0 16px 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.feature-card {
  border-radius: 18px;
  padding: 22px;
}

.feature-icon {
  color: var(--gold);
  margin-bottom: 14px;
}

.feature-card h3 {
  font-size: 15px;
  color: var(--text);
  margin: 0 0 6px;
}

.feature-card p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

.cta-card {
  background: var(--ink);
  border: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cta-card h3 {
  font-size: 17px;
}

.cta-btn {
  margin-top: 14px;
  padding: 10px 20px;
  border-radius: 24px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  align-self: flex-start;
}

/* Footer */
.marketplace-footer {
  margin-top: 44px;
  padding: 24px 4px;
  border-top: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-brand {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.footer-brand .brand-dot {
  color: var(--gold);
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.social-link:hover {
  color: var(--gold);
  border-color: var(--gold);
}

.fab {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--gold);
  color: var(--ink);
  border: none;
  box-shadow: 0 10px 28px rgba(232, 181, 77, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 45;
  transition: transform 0.2s ease;
}

.fab:hover {
  transform: scale(1.05);
}

.empty {
  border-radius: 18px;
  padding: 60px 20px;
  text-align: center;
}

.empty-title {
  font-size: 17px;
  margin-bottom: 6px;
  color: var(--text);
}

.empty-sub {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

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
  .promo-slide {
    padding: 28px 44px 34px 20px;
  }
  .promo-slide h3 {
    font-size: 19px;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
  .marketplace-footer {
    justify-content: center;
    text-align: center;
  }
}
</style>