<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Books data
const books = ref([
  {
    id: 1,
    title: 'Introduction to Computer Science',
    author: 'Dr. Sarah Johnson',
    category: 'Academic',
    type: 'ebook',
    price: 299,
    cover: 'https://placehold.co/300x400/6C5CE7/FFFFFF?text=CS',
    description: 'A comprehensive guide to computer science fundamentals, covering algorithms, data structures, and programming paradigms.',
    rating: 4.8,
    reviews: 127,
    university: 'University of Cape Town',
    pages: 450,
    year: 2024
  },
  {
    id: 2,
    title: 'The Art of Negotiation',
    author: 'Michael Chen',
    category: 'Business',
    type: 'audiobook',
    price: 199,
    cover: 'https://placehold.co/300x400/E8B54D/FFFFFF?text=Negotiate',
    description: 'Master the art of negotiation with practical strategies and real-world examples from business and life.',
    rating: 4.6,
    reviews: 89,
    university: 'Stellenbosch',
    duration: '8 hours 45 minutes',
    narrator: 'David Williams',
    year: 2024
  },
  {
    id: 3,
    title: 'Organic Chemistry Explained',
    author: 'Prof. Maria Santos',
    category: 'Academic',
    type: 'ebook',
    price: 349,
    cover: 'https://placehold.co/300x400/4ADE80/FFFFFF?text=O-Chem',
    description: 'A clear and concise guide to organic chemistry, perfect for first-year university students.',
    rating: 4.9,
    reviews: 203,
    university: 'Wits',
    pages: 520,
    year: 2023
  },
  {
    id: 4,
    title: 'Mindset for Success',
    author: 'Dr. James Peterson',
    category: 'Self-Help',
    type: 'audiobook',
    price: 149,
    cover: 'https://placehold.co/300x400/FF8577/FFFFFF?text=Mindset',
    description: 'Develop the growth mindset needed to achieve your goals and overcome obstacles.',
    rating: 4.7,
    reviews: 156,
    university: 'University of Cape Town',
    duration: '6 hours 30 minutes',
    narrator: 'Emma Thompson',
    year: 2024
  },
  {
    id: 5,
    title: 'Calculus Made Easy',
    author: 'Prof. Robert Lee',
    category: 'Academic',
    type: 'ebook',
    price: 399,
    cover: 'https://placehold.co/300x400/6FA8FF/FFFFFF?text=Calc',
    description: 'Master calculus with this step-by-step guide featuring hundreds of practice problems and solutions.',
    rating: 4.8,
    reviews: 178,
    university: 'UKZN',
    pages: 680,
    year: 2024
  },
  {
    id: 6,
    title: 'Powerful Habits',
    author: 'Lisa Morgan',
    category: 'Self-Help',
    type: 'audiobook',
    price: 129,
    cover: 'https://placehold.co/300x400/9B59B6/FFFFFF?text=Habits',
    description: 'Transform your life by building powerful habits that stick.',
    rating: 4.5,
    reviews: 92,
    university: 'Stellenbosch',
    duration: '5 hours 15 minutes',
    narrator: 'John Davis',
    year: 2024
  },
  {
    id: 7,
    title: 'Financial Literacy for Students',
    author: 'Mr. Peter Mokoena',
    category: 'Finance',
    type: 'ebook',
    price: 249,
    cover: 'https://placehold.co/300x400/F39C12/FFFFFF?text=Finance',
    description: 'Essential financial skills every student needs to know - from budgeting to investing.',
    rating: 4.4,
    reviews: 67,
    university: 'University of Cape Town',
    pages: 320,
    year: 2024
  },
  {
    id: 8,
    title: 'The Psychology of Learning',
    author: 'Dr. Anna Chen',
    category: 'Psychology',
    type: 'audiobook',
    price: 179,
    cover: 'https://placehold.co/300x400/1ABC9C/FFFFFF?text=Learn',
    description: 'Understand how the brain learns and apply proven techniques to study more effectively.',
    rating: 4.7,
    reviews: 134,
    university: 'Wits',
    duration: '7 hours',
    narrator: 'Sarah Mitchell',
    year: 2024
  },
  {
    id: 9,
    title: 'Data Science Fundamentals',
    author: 'Dr. Michael Okafor',
    category: 'Academic',
    type: 'ebook',
    price: 449,
    cover: 'https://placehold.co/300x400/2ECC71/FFFFFF?text=Data',
    description: 'A comprehensive introduction to data science, including Python, statistics, and machine learning.',
    rating: 4.9,
    reviews: 215,
    university: 'UKZN',
    pages: 750,
    year: 2024
  },
  {
    id: 10,
    title: 'Effective Communication',
    author: 'Prof. Jane Smith',
    category: 'Business',
    type: 'audiobook',
    price: 159,
    cover: 'https://placehold.co/300x400/E74C3C/FFFFFF?text=Comm',
    description: 'Master the art of effective communication in both professional and personal settings.',
    rating: 4.6,
    reviews: 98,
    university: 'Stellenbosch',
    duration: '6 hours 20 minutes',
    narrator: 'David Chen',
    year: 2024
  },
  {
    id: 11,
    title: 'Introduction to Psychology',
    author: 'Dr. Sarah Williams',
    category: 'Psychology',
    type: 'ebook',
    price: 279,
    cover: 'https://placehold.co/300x400/E67E22/FFFFFF?text=Psych',
    description: 'A comprehensive introduction to psychology, covering key theories and research findings.',
    rating: 4.7,
    reviews: 156,
    university: 'University of Cape Town',
    pages: 480,
    year: 2024
  },
  {
    id: 12,
    title: 'Business Strategy 101',
    author: 'Prof. David Chen',
    category: 'Business',
    type: 'audiobook',
    price: 189,
    cover: 'https://placehold.co/300x400/3498DB/FFFFFF?text=Strategy',
    description: 'Learn the fundamentals of business strategy with real-world case studies and examples.',
    rating: 4.5,
    reviews: 78,
    university: 'Stellenbosch',
    duration: '7 hours 30 minutes',
    narrator: 'Michael Brown',
    year: 2024
  }
])

// Filters
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedType = ref('all')

const categories = ['All', 'Academic', 'Business', 'Self-Help', 'Finance', 'Psychology']

const filteredBooks = computed(() => {
  let filtered = books.value
  
  if (selectedType.value !== 'all') {
    filtered = filtered.filter(b => b.type === selectedType.value)
  }
  
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(b => b.category === selectedCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(b => 
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Subscription plans
const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 149,
    type: 'ebook',
    features: [
      'Access to 50+ ebooks',
      'Read offline',
      'Basic support',
      'New books monthly'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 249,
    type: 'both',
    features: [
      'Access to 100+ ebooks',
      'Access to 50+ audiobooks',
      'Read & listen offline',
      'Priority support',
      'New releases weekly',
      'Download unlimited'
    ]
  },
  {
    id: 'student',
    name: 'Student Pro',
    price: 99,
    type: 'both',
    features: [
      'Access to 100+ ebooks',
      'Access to 50+ audiobooks',
      'Student discount rate',
      'Read & listen offline',
      'Standard support',
      'New books monthly'
    ]
  }
]

const selectedPlan = ref(null)
const showSubscribeModal = ref(false)

function selectPlan(plan) {
  selectedPlan.value = plan
  showSubscribeModal.value = true
}

function subscribe() {
  alert(`✅ Successfully subscribed to ${selectedPlan.value.name} plan!\n\nYou now have access to all ${selectedPlan.value.type === 'both' ? 'ebooks and audiobooks' : 'ebooks'}.\n\nThank you for supporting CampusSwap!`)
  showSubscribeModal.value = false
}

// Shopping cart
const cart = ref([])

function addToCart(book) {
  if (cart.value.find(b => b.id === book.id)) {
    alert(`${book.title} is already in your cart`)
    return
  }
  cart.value.push(book)
  alert(`✅ Added "${book.title}" to your cart`)
}

function removeFromCart(bookId) {
  cart.value = cart.value.filter(b => b.id !== bookId)
}

function getTotalPrice() {
  return cart.value.reduce((sum, book) => sum + book.price, 0)
}

function checkout() {
  if (cart.value.length === 0) {
    alert('Your cart is empty')
    return
  }
  alert(`✅ Purchase successful!\n\nYou bought ${cart.value.length} items for R${getTotalPrice()}.00\n\nThank you for shopping at CampusSwap Books!`)
  cart.value = []
}

function getTypeIcon(type) {
  return type === 'ebook' ? '📚' : '🎧'
}

function getTypeLabel(type) {
  return type === 'ebook' ? 'E-Book' : 'Audiobook'
}

function getCategoryColor(category) {
  const colors = {
    'Academic': 'var(--violet)',
    'Business': 'var(--gold)',
    'Self-Help': 'var(--mint)',
    'Finance': 'var(--sky)',
    'Psychology': 'var(--coral)'
  }
  return colors[category] || 'var(--text)'
}

// Cart count badge
const cartCount = computed(() => cart.value.length)
</script>

<template>
  <div class="book-store">
    <!-- Header -->
    <div class="store-header">
      <div class="store-title">
        <h1>📚 BookSphere</h1>
        <p>Your academic and personal development library</p>
      </div>
      <div class="cart-btn" @click="router.push('/books')">
        <span>🛒</span>
        <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
      </div>
    </div>

    <!-- Subscription Banner -->
    <div class="subscription-banner glass-panel">
      <div class="banner-content">
        <h2>🎓 Student Subscription</h2>
        <p>Get unlimited access to our entire library for one low monthly price</p>
        <button class="subscribe-btn" @click="selectedPlan = subscriptionPlans[2]; showSubscribeModal = true">
          View Plans
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search books by title, author, or description..."
          class="search-input"
        />
      </div>
      <div class="filter-group">
        <select v-model="selectedType" class="filter-select">
          <option value="all">All Types</option>
          <option value="ebook">📚 E-Books</option>
          <option value="audiobook">🎧 Audiobooks</option>
        </select>
        <select v-model="selectedCategory" class="filter-select">
          <option value="all">All Categories</option>
          <option v-for="cat in categories.slice(1)" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <!-- Results Count -->
    <div class="results-header">
      <span class="results-count">{{ filteredBooks.length }} {{ filteredBooks.length === 1 ? 'book' : 'books' }} available</span>
    </div>

    <!-- Book Grid -->
    <div class="book-grid">
      <div v-for="book in filteredBooks" :key="book.id" class="book-card glass-panel">
        <div class="book-cover">
          <img :src="book.cover" :alt="book.title" loading="lazy" />
          <span class="book-type">{{ getTypeIcon(book.type) }} {{ getTypeLabel(book.type) }}</span>
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">by {{ book.author }}</p>
          <span class="book-category" :style="{ background: getCategoryColor(book.category) }">
            {{ book.category }}
          </span>
          <p class="book-description">{{ book.description.substring(0, 100) }}...</p>
          <div class="book-meta">
            <span class="book-university">🏛️ {{ book.university }}</span>
            <span class="book-rating">⭐ {{ book.rating }} ({{ book.reviews }})</span>
          </div>
          <div class="book-footer">
            <span class="book-price">R{{ book.price }}.00</span>
            <button class="add-btn" @click="addToCart(book)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredBooks.length === 0" class="empty-state glass-panel">
      <span class="empty-icon">📚</span>
      <h3>No books found</h3>
      <p>Try adjusting your filters or search query</p>
    </div>

    <!-- Cart Sidebar -->
    <div class="cart-sidebar" v-if="cartCount > 0">
      <div class="cart-content glass-panel">
        <div class="cart-header">
          <h3>🛒 Your Cart</h3>
          <span class="cart-item-count">{{ cartCount }} items</span>
        </div>
        <div class="cart-items">
          <div v-for="book in cart" :key="book.id" class="cart-item">
            <span class="cart-item-title">{{ book.title }}</span>
            <span class="cart-item-price">R{{ book.price }}.00</span>
            <button class="remove-btn" @click="removeFromCart(book.id)">✕</button>
          </div>
        </div>
        <div class="cart-footer">
          <span class="cart-total">Total: R{{ getTotalPrice() }}.00</span>
          <button class="checkout-btn" @click="checkout">Checkout</button>
        </div>
      </div>
    </div>

    <!-- Subscription Plans Modal -->
    <div v-if="showSubscribeModal" class="modal-overlay" @click.self="showSubscribeModal = false">
      <div class="modal-box glass-panel">
        <div class="modal-header">
          <div class="drag-handle"></div>
          <button class="close-btn" @click="showSubscribeModal = false" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <h2>📚 Subscription Plans</h2>
          <p class="subtitle">Choose the plan that works best for you</p>

          <div class="plans-grid">
            <div v-for="plan in subscriptionPlans" :key="plan.id" class="plan-card" :class="{ featured: plan.id === 'premium' }">
              <div class="plan-header">
                <h3>{{ plan.name }}</h3>
                <span class="plan-price">R{{ plan.price }}<span class="plan-period">/month</span></span>
              </div>
              <div class="plan-features">
                <div v-for="feature in plan.features" :key="feature" class="feature-item">
                  <span class="feature-icon">✅</span>
                  <span>{{ feature }}</span>
                </div>
              </div>
              <button class="subscribe-plan-btn" :class="{ premium: plan.id === 'premium' }" @click="subscribe">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-store {
  width: 100%;
  padding: 20px 0 100px;
}

/* Header */
.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.store-title h1 {
  font-size: 28px;
  color: var(--text);
  margin: 0;
  font-family: 'Fraunces', serif;
}

.store-title p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 4px 0 0;
}

.cart-btn {
  position: relative;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cart-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.05);
}

.cart-count {
  background: var(--gold);
  color: var(--ink);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Subscription Banner */
.subscription-banner {
  padding: 24px 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(232, 181, 77, 0.15));
  border: 1px solid var(--glass-border);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.banner-content h2 {
  font-size: 20px;
  color: var(--text);
  margin: 0;
  font-family: 'Fraunces', serif;
}

.banner-content p {
  flex: 1;
  color: var(--text-muted);
  margin: 0;
}

.subscribe-btn {
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

.subscribe-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(232, 181, 77, 0.3);
}

/* Filters */
.filters-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 10px 14px;
  min-width: 200px;
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-faint);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--text-faint);
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-select {
  padding: 10px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--gold);
}

.filter-select option {
  background: var(--ink-elevated);
}

/* Results */
.results-header {
  margin-bottom: 16px;
}

.results-count {
  font-size: 14px;
  color: var(--text-muted);
}

/* Book Grid */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.book-card {
  border-radius: 16px;
  overflow: hidden;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(5, 7, 20, 0.4);
}

.book-cover {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-type {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 11px;
  font-weight: 600;
}

.book-info {
  padding: 16px;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 4px;
  font-family: 'Fraunces', serif;
}

.book-author {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 8px;
}

.book-category {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.book-description {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0 0 10px;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-faint);
  margin-bottom: 12px;
}

.book-university {
  display: flex;
  align-items: center;
  gap: 4px;
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.book-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--glass-border);
}

.book-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--mint);
}

.add-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: scale(1.05);
}

/* Cart Sidebar */
.cart-sidebar {
  position: fixed;
  right: 20px;
  bottom: 100px;
  z-index: 50;
  max-width: 320px;
  width: 100%;
}

.cart-content {
  padding: 16px;
  border-radius: 16px;
  background: var(--ink-elevated);
  border: 1px solid var(--glass-border);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.cart-header h3 {
  font-size: 16px;
  color: var(--text);
  margin: 0;
}

.cart-item-count {
  font-size: 12px;
  color: var(--text-muted);
}

.cart-items {
  max-height: 200px;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 13px;
}

.cart-item-title {
  flex: 1;
  color: var(--text);
}

.cart-item-price {
  color: var(--mint);
  font-weight: 600;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--coral);
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--glass-border);
  margin-top: 8px;
}

.cart-total {
  font-weight: 700;
  color: var(--text);
  font-size: 16px;
}

.checkout-btn {
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkout-btn:hover {
  transform: scale(1.05);
}

/* Empty State */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  border-radius: 16px;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  color: var(--text);
  margin: 0 0 8px;
}

.empty-state p {
  color: var(--text-muted);
  margin: 0;
}

/* Subscription Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 20, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fade-in 0.25s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-box {
  background: var(--ink-elevated);
  border-radius: 24px;
  max-width: 800px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slide-up 0.3s ease;
  border: 1px solid var(--glass-border);
}

@keyframes slide-up {
  from { transform: translateY(30px) scale(0.97); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.modal-header {
  position: sticky;
  top: 0;
  background: var(--ink-elevated);
  padding: 12px 20px 0;
  z-index: 2;
  border-radius: 24px 24px 0 0;
}

.drag-handle {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--glass-border);
  margin: 0 auto 6px;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(10, 14, 39, 0.6);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.close-btn svg {
  width: 14px;
  height: 14px;
}

.modal-body {
  padding: 0 24px 24px;
}

.modal-body h2 {
  font-size: 24px;
  color: var(--text);
  margin: 0 0 4px;
  font-family: 'Fraunces', serif;
}

.modal-body .subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0 0 24px;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.plan-card {
  padding: 20px;
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease;
}

.plan-card.featured {
  border-color: var(--gold);
  background: rgba(232, 181, 77, 0.08);
  position: relative;
}

.plan-card.featured::before {
  content: '⭐ Best Value';
  position: absolute;
  top: -10px;
  right: 12px;
  padding: 2px 12px;
  border-radius: 10px;
  background: var(--gold);
  color: var(--ink);
  font-size: 11px;
  font-weight: 700;
}

.plan-header h3 {
  font-size: 18px;
  color: var(--text);
  margin: 0 0 8px;
  font-family: 'Fraunces', serif;
}

.plan-price {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
}

.plan-period {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-muted);
}

.plan-features {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-item {
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.feature-icon {
  font-size: 12px;
}

.subscribe-plan-btn {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.subscribe-plan-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.subscribe-plan-btn.premium {
  background: var(--gold);
  color: var(--ink);
  border-color: var(--gold);
}

.subscribe-plan-btn.premium:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(232, 181, 77, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .book-store {
    padding: 12px 0 100px;
  }
  
  .store-title h1 {
    font-size: 22px;
  }
  
  .filters-row {
    flex-direction: column;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .book-grid {
    grid-template-columns: 1fr;
  }
  
  .subscription-banner {
    padding: 16px;
  }
  
  .banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-box {
    width: 100%;
    max-height: 100vh;
    border-radius: 24px 24px 0 0;
    bottom: 0;
    position: absolute;
    animation: slide-up-mobile 0.3s ease;
  }
  
  @keyframes slide-up-mobile {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  
  .modal-overlay {
    align-items: flex-end;
  }
  
  .modal-body {
    padding: 0 16px 20px;
  }
  
  .cart-sidebar {
    right: 10px;
    bottom: 85px;
    max-width: 280px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .book-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>