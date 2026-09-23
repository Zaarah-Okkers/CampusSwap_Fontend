<template>
  <div class="checkout-wrapper">
    <div class="checkout-card">
      
      <!-- Back Button -->
      <button type="button" class="btn-back" @click="goHome" aria-label="Back to home">
        ← Back to Home
      </button>

      <!-- Navigation Tabs -->
      <div class="nav-tabs">
        <button 
          :class="['tab-btn', { active: activeTab === 'cart' }]" 
          @click="activeTab = 'cart'"
        >
          <AppIcon name="cart" /> Cart ({{ cartItems.length }})
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'repairs' }]" 
          @click="activeTab = 'repairs'"
        >
          <AppIcon name="tools" /> SafeHome (Repairs)
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'orders' }]" 
          @click="activeTab = 'orders'"
        >
          <AppIcon name="package" /> My Orders ({{ orders.length }})
        </button>
      </div>

      <!-- TAB 1: MARKETPLACE CART & CHECKOUT -->
      <div v-if="activeTab === 'cart'" class="tab-body">
        <h2 class="title">Marketplace Cart</h2>

        <div v-if="cartItems.length === 0" class="empty-box">
          <p>Your shopping cart is empty.</p>
        </div>

        <div v-else class="cart-content">
          <div v-for="item in cartItems" :key="item.id" class="item-card">
            <div class="item-info">
              <h4>{{ item.title || item.name }}</h4>
              <p class="price">R{{ Number(item.price).toFixed(2) }}</p>
            </div>
            <button class="btn-remove" @click="removeItem(item.id)" title="Remove item">&times;</button>
          </div>

          <!-- Dynamic Pickup Zone -->
          <div class="pickup-box">
            <label><AppIcon name="building" /> Secure On-Campus Pickup Zone</label>
            <select v-model="selectedCampus" class="select-input">
              <option v-for="uni in universities" :key="uni.id || uni.name" :value="uni.name">
                {{ uni.name }} {{ uni.province ? `(${uni.province})` : '' }}
              </option>
            </select>
          </div>

          <!-- Escrow Protection Banner -->
          <div class="escrow-banner">
            <AppIcon name="shield" /> <strong>Escrow Protection Active:</strong> Funds are held safely by CampusSwap SA until you verify receipt.
          </div>

          <!-- Summary Breakdown -->
          <div class="summary-box">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>R{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Platform Escrow Fee</span>
              <span>R{{ escrowFee.toFixed(2) }}</span>
            </div>
            <hr class="divider" />
            <div class="summary-row total">
              <span>Total Payable</span>
              <span class="total-price">R{{ totalPayable.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Payment Method Selection -->
          <div class="payment-selection">
            <label class="section-label">Select Payment Method</label>
            <div class="method-options">
              <label :class="['method-card', { selected: paymentMethod === 'card' }]">
                <input type="radio" v-model="paymentMethod" value="card" />
                <span>Credit / Debit Card</span>
              </label>
              <label :class="['method-card', { selected: paymentMethod === 'ozow' }]">
                <input type="radio" v-model="paymentMethod" value="ozow" />
                <span>Ozow Instant EFT</span>
              </label>
              <label :class="['method-card', { selected: paymentMethod === 'payfast' }]">
                <input type="radio" v-model="paymentMethod" value="payfast" />
                <span>PayFast</span>
              </label>
            </div>
          </div>

          <!-- Card Payment Form -->
          <div v-if="paymentMethod === 'card'" class="card-form-box">
            <div class="test-cards-hint">
              <small><AppIcon name="info" /> <strong>Test Cards:</strong> Use standard 16 digits for Success. End in <code>4000</code> or <code>0000</code> to test Declined state.</small>
            </div>
            <div class="form-group">
              <label>Cardholder Name</label>
              <input type="text" v-model="cardForm.holder" placeholder="e.g. Zaarah Khan" class="form-input" />
            </div>
            <div class="form-group">
              <label>Card Number</label>
              <input type="text" v-model="cardForm.number" placeholder="4532 1234 5678 9010" maxlength="19" class="form-input" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Expiry (MM/YY)</label>
                <input type="text" v-model="cardForm.expiry" placeholder="12/26" maxlength="5" class="form-input" />
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input type="password" v-model="cardForm.cvv" placeholder="123" maxlength="4" class="form-input" />
              </div>
            </div>
          </div>

          <button class="btn-pay-main" :disabled="isProcessing" @click="processPayment">
            <span v-if="isProcessing" class="spinner-text">Processing Payment...</span>
            <span v-else>Pay R{{ totalPayable.toFixed(2) }} Now</span>
          </button>

        </div>
      </div>

      <!-- TAB 2: SAFEHOME REPAIRS -->
      <div v-if="activeTab === 'repairs'" class="tab-body">
        <h2 class="title">SafeHome Requests</h2>
        <p class="payment-note">SafeHome repairs are paid by the Residence Manager. Students can track requests here and are not charged.</p>

        <div v-if="repairs.length === 0" class="empty-box">
          <p>No active repair requests found.</p>
        </div>

        <div v-else>
          <div v-for="repair in repairs" :key="repair.id" class="item-card repair-card">
            <div class="item-info">
              <h4>{{ repair.title }}</h4>
              <p class="repair-desc">{{ repair.description }}</p>
              <p class="location-tag"><AppIcon name="building" /> {{ repair.residence_name }} - {{ repair.room_number }}</p>
              <p class="price">Estimated Cost: R{{ Number(repair.estimated_cost).toFixed(2) }}</p>
            </div>
            <button class="btn-pay-main btn-sm" @click="router.push('/safehome')">
              Track request in SafeHome
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 3: ORDERS -->
      <div v-if="activeTab === 'orders'" class="tab-body">
        <h2 class="title">My Orders & Escrow Status</h2>
        <div v-if="orders.length === 0" class="empty-box">
          <p>No active orders placed.</p>
        </div>
        <div v-else class="orders-list">
          <div v-for="ord in orders" :key="ord.id" class="order-card">
            <div class="order-header">
              <span><strong>Order #{{ ord.ref || ord.id }}</strong> ({{ ord.title }})</span>
              <span :class="['badge', ord.status === 'Completed' ? 'success' : 'escrow']">{{ ord.status }}</span>
            </div>
            <p><strong>Total:</strong> R{{ ord.total.toFixed(2) }}</p>
            <p v-if="ord.ref" class="ref-text"><strong>Ref:</strong> <code>{{ ord.ref }}</code></p>
            
            <div class="order-actions">
              <button class="btn-track" @click="openTracker(ord)">
                Track Order
              </button>
              <button v-if="ord.status === 'In Escrow'" class="btn-release" @click="releaseFunds(ord.id)">
                Confirm Delivery & Release Funds
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ORDER TRACKING POPUP MODAL -->
    <div v-if="showTrackModal" class="modal-overlay" @click.self="showTrackModal = false">
      <div class="modal-card">
        <button class="modal-close" @click="showTrackModal = false">&times;</button>
        
        <h2 class="track-title">
          Track order <span class="track-ref">#{{ activeTrackOrder?.ref || activeTrackOrder?.id }}</span>
        </h2>
        <p class="track-status">{{ activeTrackOrder?.trackingStatus || 'confirmed' }}</p>

        <!-- Progress Tracker Bar -->
        <div class="tracker-stepper">
          <div :class="['step-item', { completed: getStepLevel(activeTrackOrder) >= 1 }]">
            <div class="step-circle">✓</div>
            <span class="step-label">Order placed</span>
          </div>
          <div class="step-line" :class="{ active: getStepLevel(activeTrackOrder) >= 2 }"></div>
          
          <div :class="['step-item', { completed: getStepLevel(activeTrackOrder) >= 2 }]">
            <div class="step-circle">✓</div>
            <span class="step-label">Payment confirmed</span>
          </div>
          <div class="step-line" :class="{ active: getStepLevel(activeTrackOrder) >= 3 }"></div>

          <div :class="['step-item', { completed: getStepLevel(activeTrackOrder) >= 3 }]">
            <div class="step-circle">📦</div>
            <span class="step-label">Packing</span>
          </div>
          <div class="step-line" :class="{ active: getStepLevel(activeTrackOrder) >= 4 }"></div>

          <div :class="['step-item', { completed: getStepLevel(activeTrackOrder) >= 4 }]">
            <div class="step-circle">🚚</div>
            <span class="step-label">Out for delivery</span>
          </div>
          <div class="step-line" :class="{ active: getStepLevel(activeTrackOrder) >= 5 }"></div>

          <div :class="['step-item', { completed: getStepLevel(activeTrackOrder) >= 5 }]">
            <div class="step-circle">🏠</div>
            <span class="step-label">Delivered</span>
          </div>
        </div>

        <hr class="modal-divider" />

        <div class="track-items-section">
          <h3>Items in this order</h3>
          <div v-if="activeTrackOrder?.items && activeTrackOrder.items.length > 0">
            <div v-for="(item, idx) in activeTrackOrder.items" :key="idx" class="track-item-row">
              <span class="track-item-name">{{ item.title || item.name }}</span>
              <span class="track-item-qty">Qty: 1</span>
            </div>
          </div>
          <div v-else class="track-item-row">
            <span class="track-item-name">{{ activeTrackOrder?.title || 'Marketplace Item' }}</span>
            <span class="track-item-qty">Qty: 1</span>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-back-shop" @click="showTrackModal = false">Back to shop</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import AppIcon from './AppIcon.vue'
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { api } from '../services/api';

const activeTab = ref('cart');
const cartItems = ref([]);
const universities = ref([]);
const repairs = ref([]);
const orders = ref([]);
const selectedCampus = ref('');
const paymentMethod = ref('card');
const isProcessing = ref(false);

// Tracker Popup Modal State
const showTrackModal = ref(false);
const activeTrackOrder = ref(null);

const cardForm = ref({
  holder: '',
  number: '',
  expiry: '',
  cvv: ''
});

const emit = defineEmits(['go-home']);
const router = useRouter();

const goHome = () => {
  router.push('/');
};

// Helper: load cart state from LocalStorage
const loadCartFromStorage = () => {
  const stored = localStorage.getItem('campusswap_cart');
  if (stored) {
    try {
      cartItems.value = JSON.parse(stored);
    } catch (e) {
      cartItems.value = [];
    }
  } else {
    cartItems.value = [];
  }
};

// Helper: save cart state to LocalStorage
const saveCartToStorage = () => {
  localStorage.setItem('campusswap_cart', JSON.stringify(cartItems.value));
};

const loadBackendData = async () => {
  try {
    universities.value = await api.getUniversities();
    if (universities.value.length > 0) {
      selectedCampus.value = universities.value[0].name;
    }
    repairs.value = await api.getRepairs();
  } catch (err) {
    universities.value = [
      { id: 1, name: 'University of Cape Town (UCT)', province: 'Western Cape' },
      { id: 2, name: 'University of the Witwatersrand (Wits)', province: 'Gauteng' },
      { id: 3, name: 'Stellenbosch University (SU)', province: 'Western Cape' }
    ];
    repairs.value = [];
  }
};

onMounted(() => {
  loadCartFromStorage();
  loadBackendData();
  
  // Load saved orders if any
  const savedOrders = localStorage.getItem('campusswap_orders');
  if (savedOrders) {
    try {
      orders.value = JSON.parse(savedOrders);
    } catch (e) {
      orders.value = [];
    }
  }
});

const subtotal = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + Number(item.price || 0), 0);
});

const escrowFee = computed(() => {
  return cartItems.value.length > 0 ? 25.00 : 0.00;
});

const totalPayable = computed(() => {
  return subtotal.value + escrowFee.value;
});

const removeItem = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
  saveCartToStorage();
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'info',
    title: 'Item removed from cart',
    showConfirmButton: false,
    timer: 2000
  });
};

const processPayment = async () => {
  if (cartItems.value.length === 0) return;

  if (paymentMethod.value === 'card') {
    if (!cardForm.value.holder || !cardForm.value.number || !cardForm.value.expiry || !cardForm.value.cvv) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Payment Details',
        text: 'Please fill in all card details before proceeding.'
      });
      return;
    }

    const rawNum = cardForm.value.number.replace(/\s+/g, '');
    if (rawNum.length < 12) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Card Number',
        text: 'Please enter a valid card number.'
      });
      return;
    }
  }

  isProcessing.value = true;

  setTimeout(() => {
    isProcessing.value = false;

    const rawNum = cardForm.value.number.replace(/\s+/g, '');
    if (paymentMethod.value === 'card' && (rawNum.endsWith('4000') || rawNum.endsWith('0000'))) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Declined',
        text: 'Your card was declined by the simulated bank. Please try another card.'
      });
      return;
    }

    const refNum = 'LC-' + Math.floor(10000 + Math.random() * 90000);
    const orderId = Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      id: orderId,
      title: cartItems.value.map(i => i.title || i.name).join(', '),
      total: totalPayable.value,
      status: 'In Escrow',
      ref: refNum,
      items: [...cartItems.value],
      trackingStatus: 'confirmed',
      stepLevel: 3
    };

    orders.value.unshift(newOrder);
    localStorage.setItem('campusswap_orders', JSON.stringify(orders.value));

    // Clear cart and update local storage
    cartItems.value = [];
    saveCartToStorage();
    activeTab.value = 'orders';

    Swal.fire({
      icon: 'success',
      title: 'Payment Secured in Escrow!',
      html: `<p>Transaction Ref: <strong>${refNum}</strong></p><p>Pickup Location: <strong>${selectedCampus.value}</strong></p>`,
      confirmButtonColor: '#2e7d5a'
    }).then(() => {
      openTracker(newOrder);
    });
  }, 1500);
};

const openTracker = (order) => {
  activeTrackOrder.value = order;
  showTrackModal.value = true;
};

const getStepLevel = (order) => {
  if (!order) return 1;
  return order.stepLevel || 3;
};

const releaseFunds = (orderId) => {
  Swal.fire({
    title: 'Release Funds to Seller/Provider?',
    text: 'Only confirm if you have received your item or verified repair completion.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2e7d5a',
    confirmButtonText: 'Yes, Release Funds'
  }).then((result) => {
    if (result.isConfirmed) {
      const target = orders.value.find(o => o.id === orderId);
      if (target) {
        target.status = 'Completed';
        target.stepLevel = 5;
        target.trackingStatus = 'Delivered & Funds Released';
        localStorage.setItem('campusswap_orders', JSON.stringify(orders.value));
      }
      Swal.fire('Funds Released!', 'Transaction successfully completed.', 'success');
    }
  });
};
</script>

<style scoped>
.checkout-wrapper {
  display: flex;
  justify-content: center;
  padding: 30px 15px 120px 15px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.checkout-card {
  width: 100%;
  max-width: 560px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.nav-tabs {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 6px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 10px 8px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #0d1b3d;
  color: #ffffff;
}

.title {
  font-size: 1.25rem;
  color: #0d1b3d;
  margin-bottom: 16px;
}

.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.item-info h4 {
  margin: 0 0 4px 0;
  color: #1e293b;
}

.price {
  font-weight: 700;
  color: #2e7d5a;
  margin: 0;
}

.btn-remove {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #94a3b8;
  cursor: pointer;
}

.pickup-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0 12px 0;
}

.pickup-box label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #166534;
  margin-bottom: 6px;
}

.select-input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

.escrow-banner {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

.summary-box {
  margin-top: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 8px;
}

.summary-row.total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0d1b3d;
}

.total-price {
  color: #2e7d5a;
}

.divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 12px 0;
}

.payment-selection {
  margin-top: 16px;
}

.section-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0d1b3d;
  margin-bottom: 8px;
}

.method-options {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.method-card {
  flex: 1;
  border: 1px solid #e2e8f0;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background: #f8fafc;
  color: darkgreen;
}

.method-card.selected {
  border-color: #2e7d5a;
  background: #f0fdf4;
  color: #166534;
}

.card-form-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;
}

.test-cards-hint {
  margin-bottom: 12px;
  color: #64748b;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  gap: 12px;
}

.btn-pay-main {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #2e7d5a;
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-pay-main:hover {
  background-color: #235f45;
}

.btn-pay-main:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.order-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ref-text {
  font-size: 0.85rem;
  color: #64748b;
  margin: 4px 0 8px 0;
}

.badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.escrow {
  background: #dbeafe;
  color: #1e40af;
}

.badge.success {
  background: #dcfce7;
  color: #166534;
}

.order-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-track {
  flex: 1;
  padding: 8px 12px;
  background-color: #e2e8f0;
  color: #0f172a;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-release {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: #2e7d5a;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
}

/* TRACKER MODAL STYLES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-card {
  position: relative;
  background: #ffffff;
  border-radius: 16px;
  width: 90%;
  max-width: 520px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
}

.track-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.track-ref {
  color: #e67e22;
}

.track-status {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 24px;
}

.tracker-stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 2;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  border: 1px solid #cbd5e1;
}

.step-item.completed .step-circle {
  background: #f1f5f9;
  color: #334155;
  border-color: #cbd5e1;
}

.step-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  max-width: 65px;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: 0 -8px 18px -8px;
}

.step-line.active {
  background: #cbd5e1;
}

.modal-divider {
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 20px 0;
}

.track-items-section h3 {
  font-size: 0.9rem;
  color: #0f172a;
  margin-bottom: 12px;
}

.track-item-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #1e293b;
  margin-bottom: 8px;
}

.track-item-qty {
  color: #64748b;
  font-size: 0.85rem;
}

.modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.btn-back-shop {
  background: #f1f5f9;
  color: #334155;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-back-shop:hover {
  background: #e2e8f0;
}
</style>