<template>
  <div class="checkout-wrapper">
    <div class="checkout-card">
      <!-- Functional Back Button -->
      <button type="button" class="btn-back" @click="$emit('go-home')">
        ← Back to Home
      </button>

      <!-- Navigation Tabs -->
      <div class="nav-tabs"></div>

      <!-- Main Title -->
      <h2 class="title">CampusSwap SA - Order Escrow</h2>

      <!-- State 1: Active Product / Cart from Backend -->
      <div v-if="!order" class="content-body">
        <div v-if="loading" class="state-message">
          <p>Loading items from server...</p>
        </div>

        <div v-else-if="cartItems.length === 0" class="state-message">
          <p>No products available to purchase.</p>
        </div>

        <div v-else class="items-container">
          <!-- Live Products fetched from backend -->
          <div v-for="item in cartItems" :key="item.id" class="item-card">
            <div class="item-details">
              <h4>{{ item.name || item.title }}</h4>
              <p class="price">R{{ Number(item.price).toFixed(2) }}</p>
            </div>
          </div>

          <!-- Secure Pickup Zone Selector -->
          <div class="pickup-box">
            <label>📍 Secure On-Campus Pickup Zone</label>
            <select v-model="selectedPickupZone" class="select-input">
              <option>UCT - Chancellor's Hall Safe Zone</option>
              <option>CPUT - District Six Campus Safe Zone</option>
              <option>UWC - Student Center Safe Zone</option>
            </select>
          </div>

          <!-- Escrow Protection Banner -->
          <div class="escrow-banner">
            🛡️ <strong>Escrow Protection Active:</strong> Funds are held safely by CampusSwap until you verify receipt.
          </div>

          <!-- Summary Breakdown -->
          <div class="summary-section">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>R{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Platform Escrow Fee (5%)</span>
              <span>R{{ escrowFee.toFixed(2) }}</span>
            </div>
            <hr class="divider" />
            <div class="summary-row total">
              <span>Total Payable</span>
              <span class="total-price">R{{ totalPayable.toFixed(2) }}</span>
            </div>

            <!-- Backend Payment Actions -->
            <button
              class="btn-pay ozow"
              :disabled="loadingProcessing"
              @click="handleCheckout('Ozow Instant EFT')"
            >
              {{ loadingProcessing ? 'Processing...' : 'Pay with Ozow Instant EFT' }}
            </button>

            <button
              class="btn-pay payfast"
              :disabled="loadingProcessing"
              @click="handleCheckout('PayFast')"
            >
              {{ loadingProcessing ? 'Processing...' : 'Pay with PayFast' }}
            </button>
          </div>
        </div>
      </div>

      <!-- State 2: Active Order Created in Database -->
      <div v-else class="order-status-card">
        <h3>Order #{{ order.id }} Details</h3>
        <p><strong>Item:</strong> {{ order.product_name || cartItems[0]?.name }}</p>
        <p><strong>Total:</strong> R{{ Number(order.total_amount).toFixed(2) }}</p>
        <p><strong>Escrow Fee:</strong> R{{ Number(order.escrow_fee).toFixed(2) }}</p>
        <p>
          <strong>Status:</strong>
          <span :class="['badge', order.status]">{{ order.status?.toUpperCase() }}</span>
        </p>

        <div class="actions">
          <button
            v-if="order.status === 'pending'"
            @click="handlePaymentSimulation"
            class="btn-pay ozow"
          >
            Simulate Payment Gateway
          </button>

          <button
            v-if="order.status === 'in escrow' || order.status === 'in_escrow'"
            @click="handleRelease"
            class="btn-release"
          >
            Confirm Delivery & Release Funds
          </button>
        </div>
      </div>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';

const router = useRouter();

const cartItems = ref([]);
const order = ref(null);
const loading = ref(true);
const loadingProcessing = ref(false);
const errorMessage = ref('');
const selectedPickupZone = ref("UCT - Chancellor's Hall Safe Zone");

// Navigation
const goHome = () => {
  router.push('/');
};

// Fetch products directly from backend DB on load
onMounted(async () => {
  try {
    const products = await api.getProducts();
    cartItems.value = Array.isArray(products) ? products : [products];
  } catch (err) {
    errorMessage.value = 'Failed to load products from server.';
  } finally {
    loading.value = false;
  }
});

// Financial Calculations
const subtotal = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + Number(item.price || 0), 0);
});

const escrowFee = computed(() => {
  return subtotal.value * 0.05;
});

const totalPayable = computed(() => {
  return subtotal.value + escrowFee.value;
});

// Step 1: Create Checkout in Database
const handleCheckout = async (paymentMethod) => {
  if (cartItems.value.length === 0) return;

  loadingProcessing.value = true;
  errorMessage.value = '';
  try {
    const primaryItem = cartItems.value[0];
    const data = await api.createCheckout({
      user_id: 21,
      product_id: primaryItem.id,
      total_amount: totalPayable.value,
      payment_method: paymentMethod
    });

    order.value = await api.getOrder(data.orderId);
  } catch (err) {
    errorMessage.value = err.message || 'Error processing checkout.';
  } finally {
    loadingProcessing.value = false;
  }
};

// Step 2: Simulate Payment Confirmation
const handlePaymentSimulation = async () => {
  try {
    await api.simulatePayment(order.value.id);
    order.value = await api.getOrder(order.value.id);
  } catch (err) {
    errorMessage.value = err.message;
  }
};

// Step 3: Release Escrow Funds
const handleRelease = async () => {
  try {
    await api.releaseEscrow(order.value.id);
    order.value = await api.getOrder(order.value.id);
  } catch (err) {
    errorMessage.value = err.message;
  }
};
</script>

<style scoped>
.checkout-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px 16px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.checkout-card {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.title {
  text-align: center;
  color: #1e293b;
  margin-bottom: 20px;
  font-size: 1.25rem;
}

.item-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.item-details h4 {
  margin: 0 0 4px 0;
  color: #334155;
}

.price {
  color: #166534;
  font-weight: 600;
  margin: 0;
}

.pickup-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
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

.summary-section {
  margin-top: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 8px;
}

.summary-row.total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.total-price {
  color: #15803d;
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
  background-color: #64748b;
}

.btn-pay.payfast {
  background-color: #a855f7;
}

.btn-release {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #16a34a;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 12px;
  text-align: center;
}

.badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: #e2e8f0;
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
  transition: color 0.2s ease;
}

.btn-back:hover {
  color: #0f172a;
  text-decoration: underline;
}
</style>