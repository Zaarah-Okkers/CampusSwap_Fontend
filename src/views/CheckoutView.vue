<template>
  <div class="checkout-wrapper">
    <div class="checkout-card">

      <!-- Back Button triggering custom emit -->
       <button type="button" class="btn-back" @click="goHome" aria-label="Back to home">
        ← Back to Home
      </button>

      <!-- Navigation Tabs -->
      <div class="nav-tabs">
        <button
          :class="['tab-btn', { active: activeTab === 'cart' }]"
          @click="activeTab = 'cart'"
        >
          🛒 Cart ({{ cartItems.length }})
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'repairs' }]"
          @click="activeTab = 'repairs'"
        >
          🛠️ SafeHome (Repairs)
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'orders' }]"
          @click="activeTab = 'orders'"
        >
          📦 My Orders ({{ orders.length }})
        </button>
      </div>

      <!-- TAB 1: MARKETPLACE CART -->
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
            <button class="btn-remove" @click="removeItem(item.id)">&times;</button>
          </div>

          <!-- Dynamic Pickup Zone fetched from Database -->
          <div class="pickup-box">
            <label>📍 Secure On-Campus Pickup Zone</label>
            <select v-model="selectedCampus" class="select-input">
              <option v-for="uni in universities" :key="uni.id" :value="uni.name">
                {{ uni.name }} ({{ uni.province }})
              </option>
            </select>
          </div>

          <!-- Escrow Protection Banner -->
          <div class="escrow-banner">
            🛡️ <strong>Escrow Protection Active:</strong> Funds are held safely by CampusSwap SA until you verify receipt.
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

            <button class="btn-pay ozow" @click="handlePayment('Ozow Instant EFT')">
              Pay with Ozow Instant EFT
            </button>
            <button class="btn-pay payfast" @click="handlePayment('PayFast')">
              Pay with PayFast
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 2: SAFEHOME REPAIRS (DB Integration) -->
      <div v-if="activeTab === 'repairs'" class="tab-body">
        <h2 class="title">SafeHome Repairs</h2>

        <div v-if="repairs.length === 0" class="empty-box">
          <p>No active repair requests found.</p>
        </div>

        <div v-else>
          <div v-for="repair in repairs" :key="repair.id" class="item-card repair-card">
            <div class="item-info">
              <h4>{{ repair.title }}</h4>
              <p class="repair-desc">{{ repair.description }}</p>
              <p class="location-tag">📍 {{ repair.residence_name }} - {{ repair.room_number }}</p>
              <p class="price">Estimated Cost: R{{ Number(repair.estimated_cost).toFixed(2) }}</p>
            </div>
            <button class="btn-pay ozow btn-sm" @click="handleRepairPayment(repair)">
              Book Repair (Escrow)
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
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';

const activeTab = ref('cart');
const cartItems = ref([]);
const universities = ref([]);
const repairs = ref([]);
const orders = ref([]);
const selectedCampus = ref('');
const emit = defineEmits(['go-home']);
const router = useRouter();

const handleBack = () => {
  emit('go-home');
};
const goHome = () => {
  router.push('/');
};

// Fetch database records from API service
const loadBackendData = async () => {
  try {
    // 1. Fetch Products
    try {
      cartItems.value = await api.getProducts();
    } catch (e) {
      console.warn('Products fetch fallback:', e.message);
    }

    // 2. Fetch Universities DB table
    try {
      const unis = await api.getUniversities();
      universities.value = unis || [];
      if (universities.value.length > 0) {
        selectedCampus.value = universities.value[0].name;
      }
    } catch (e) {
      console.warn('Universities fetch fallback:', e.message);
    }

    // 3. Fetch Repairs DB table
    try {
      const data = await api.getRepairs();
      repairs.value = Array.isArray(data) && data.length > 0 ? data : getFallbackRepairs();
    } catch (e) {
      repairs.value = getFallbackRepairs();
    }
  } catch (err) {
    console.error('API loading error:', err);
    repairs.value = getFallbackRepairs();
  }
};

// Fallback matching your MySQL workbench rows
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


onMounted(() => {
  loadBackendData();
});

// Financial Calculations
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

// Checkout SweetAlert
const handlePayment = (method) => {
  if (cartItems.value.length === 0) return;

  Swal.fire({
    title: 'Confirm Escrow Payment',
    text: `Pay R${totalPayable.value.toFixed(2)} via ${method} for campus pickup at ${selectedCampus.value}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Proceed to Pay'
  }).then((result) => {
    if (result.isConfirmed) {
      const orderId = Math.floor(100000 + Math.random() * 900000);
      orders.value.unshift({
        id: orderId,
        title: 'Marketplace Cart Order',
        total: totalPayable.value,
        status: 'In Escrow'
      });

      cartItems.value = [];
      activeTab.value = 'orders';

      Swal.fire(
        'Payment Secured!',
        `Your funds are safely held in escrow for ${selectedCampus.value}.`,
        'success'
      );
    }
  });
};

// SafeHome Repair Booking SweetAlert
const handleRepairPayment = (repair) => {
  Swal.fire({
    title: 'Book SafeHome Repair?',
    text: `Deposit R${Number(repair.estimated_cost).toFixed(2)} into Escrow for "${repair.title}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    confirmButtonText: 'Confirm Escrow Deposit'
  }).then((result) => {
    if (result.isConfirmed) {
      orders.value.unshift({
        id: Math.floor(100000 + Math.random() * 900000),
        title: `Repair: ${repair.title}`,
        total: Number(repair.estimated_cost),
        status: 'In Escrow'
      });

      activeTab.value = 'orders';

      Swal.fire(
        'Repair Booked!',
        'Funds held in escrow. Release them only when the job is completed.',
        'success'
      );
    }
  });
};

// Release Escrow SweetAlert
const releaseFunds = (orderId) => {
  Swal.fire({
    title: 'Release Funds to Seller/Provider?',
    text: 'Only confirm if you have received your item or inspected the repair work.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
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
  padding: 30px 15px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.checkout-card {
  width: 100%;
  max-width: 540px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 24px;
}

.nav-tabs {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 6px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.tab-btn.active {
  background: #1e293b;
  color: #ffffff;
}

.title {
  font-size: 1.25rem;
  color: #0f172a;
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
  color: #059669;
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
  color: #0f172a;
}

.total-price {
  color: #059669;
}

.divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 12px 0;
}

.btn-pay {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}

.btn-pay.ozow {
  background-color: #475569;
}

.btn-pay.payfast {
  background-color: #a855f7;
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
  background-color: #059669;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}

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
  color: #0f172a;
  text-decoration: underline;
}
</style>