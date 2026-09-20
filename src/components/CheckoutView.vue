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
              <option v-for="uni in universities" :key="uni.id" :value="uni.name">
                {{ uni.name }} ({{ uni.province }})
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
              <span><strong>Order #{{ ord.id }}</strong> ({{ ord.title }})</span>
              <span :class="['badge', ord.status === 'Completed' ? 'success' : 'escrow']">{{ ord.status }}</span>
            </div>
            <p><strong>Total:</strong> R{{ ord.total.toFixed(2) }}</p>
            <p v-if="ord.ref" class="ref-text"><strong>Ref:</strong> <code>{{ ord.ref }}</code></p>
            <button v-if="ord.status === 'In Escrow'" class="btn-release" @click="releaseFunds(ord.id)">
              Confirm Delivery & Release Funds
            </button>
          </div>
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

const activeTab = ref('cart');
const cartItems = ref([]);
const universities = ref([]);
const repairs = ref([]);
const orders = ref([]);
const selectedCampus = ref('');
const paymentMethod = ref('card');
const isProcessing = ref(false);

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

const getFallbackUniversities = () => [
  { id: 1, name: 'University of Cape Town (UCT)', province: 'Western Cape' },
  { id: 2, name: 'University of the Witwatersrand (Wits)', province: 'Gauteng' },
  { id: 3, name: 'Stellenbosch University (SU)', province: 'Western Cape' },
  { id: 4, name: 'Cape Peninsula University of Technology (CPUT)', province: 'Western Cape' }
];

const getFallbackCartItems = () => [
  { id: 101, title: 'Calculus: Early Transcendentals (9th Ed)', price: 450.00 },
  { id: 102, title: 'Unisex Campus Hoodie (Size L)', price: 320.00 }
];

const getFallbackRepairs = () => [
  {
    id: 1,
    title: 'Leaking Kitchen Tap',
    description: 'Hot water tap won\'t close fully.',
    residence_name: 'Smuts Hall',
    room_number: 'Room 302',
    estimated_cost: 250.00,
    status: 'assigned'
  },
  {
    id: 2,
    title: 'Tripped Circuit Breaker',
    description: 'Power lost after plugging in kettle.',
    residence_name: 'Fuller Hall',
    room_number: 'Room 114',
    estimated_cost: 180.00,
    status: 'pending'
  }
];

const loadBackendData = async () => {
  try {
    const prodRes = await fetch(`${import.meta.env.VITE_API_URL || 'https://campusswap-backend-kk9v.onrender.com/api'}/products`).catch(() => null);
    if (prodRes && prodRes.ok) {
      cartItems.value = await prodRes.json();
    } else {
      cartItems.value = getFallbackCartItems();
    }

    const uniRes = await fetch(`${import.meta.env.VITE_API_URL || 'https://campusswap-backend-kk9v.onrender.com/api'}/universities`).catch(() => null);
    if (uniRes && uniRes.ok) {
      universities.value = await uniRes.json();
    } else {
      universities.value = getFallbackUniversities();
    }
    if (universities.value.length > 0) {
      selectedCampus.value = universities.value[0].name;
    }

    const repairRes = await fetch(`${import.meta.env.VITE_API_URL || 'https://campusswap-backend-kk9v.onrender.com/api'}/repairs`).catch(() => null);
    if (repairRes && repairRes.ok) {
      const data = await repairRes.json();
      repairs.value = Array.isArray(data) && data.length > 0 ? data : getFallbackRepairs();
    } else {
      repairs.value = getFallbackRepairs();
    }
  } catch (err) {
    cartItems.value = getFallbackCartItems();
    universities.value = getFallbackUniversities();
    selectedCampus.value = universities.value[0].name;
    repairs.value = getFallbackRepairs();
  }
};

onMounted(() => {
  loadBackendData();
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

    const refNum = 'CS-' + Math.floor(10000000 + Math.random() * 90000000);
    const orderId = Math.floor(100000 + Math.random() * 900000);

    orders.value.unshift({
      id: orderId,
      title: 'Marketplace Cart Order',
      total: totalPayable.value,
      status: 'In Escrow',
      ref: refNum
    });

    cartItems.value = [];
    activeTab.value = 'orders';

    Swal.fire({
      icon: 'success',
      title: 'Payment Secured in Escrow!',
      html: `<p>Transaction Ref: <strong>${refNum}</strong></p><p>Pickup Location: <strong>${selectedCampus.value}</strong></p>`,
      confirmButtonColor: '#2e7d5a'
    });
  }, 1500);
};

const handleRepairPayment = (repair) => {
  isProcessing.value = true;
  setTimeout(() => {
    isProcessing.value = false;
    const refNum = 'CS-REP-' + Math.floor(100000 + Math.random() * 900000);
    orders.value.unshift({
      id: Math.floor(100000 + Math.random() * 900000),
      title: `Repair: ${repair.title}`,
      total: Number(repair.estimated_cost),
      status: 'In Escrow',
      ref: refNum
    });

    activeTab.value = 'orders';

    Swal.fire({
      icon: 'success',
      title: 'Repair Escrow Booked!',
      text: `Funds (R${Number(repair.estimated_cost).toFixed(2)}) safely deposited under Ref ${refNum}.`,
      confirmButtonColor: '#2e7d5a'
    });
  }, 1000);
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

.demo-banner {
  background: #fffbe3;
  border: 1px solid #f5b941;
  color: #8a6d3b;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  margin-bottom: 16px;
  text-align: center;
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

.repair-card {
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.repair-desc {
  font-size: 0.85rem;
  color: #64748b;
  margin: 4px 0;
}

.location-tag {
  font-size: 0.8rem;
  color: #0369a1;
  font-weight: 500;
  margin: 0;
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
}

.method-card.selected {
  border-color: #2e7d5a;
  background: #f0fdf4;
  color: #166534;
}

.method-card input[type='radio'] { appearance: auto; accent-color: #2e7d5a; display: block; height: 16px; margin: 0; min-width: 16px; opacity: 1; position: static; width: 16px; }

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

.btn-sm {
  padding: 8px 12px;
  font-size: 0.85rem;
}

.btn-release {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background-color: #2e7d5a;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}

.payment-note { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; color: #1e40af; font-size: 0.85rem; margin-bottom: 16px; padding: 12px; }

.empty-box {
  text-align: center;
  padding: 24px;
  color: #64748b;
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

.btn-back:hover {
  color: #0d1b3d;
  text-decoration: underline;
}
</style>
