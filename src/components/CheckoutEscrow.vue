<template>
  <div class="checkout-wrapper">
    <div class="checkout-card">
      <!-- Back Button -->
      <button type="button" class="btn-back" @click="goHome">
        ← Back to Home
      </button>

      <!-- Demo Banner -->
      <div class="demo-banner">
        <span>⚡ <strong>DEMO PAYMENT SYSTEM</strong> — Safe Sandbox Mode (No Real Money Charged)</span>
      </div>

      <!-- Main Title -->
      <h2 class="title">CampusSwap SA - Order Escrow</h2>

      <!-- State 1: Active Product / Cart -->
      <div v-if="!order" class="content-body">
        <div v-if="loading" class="state-message">
          <p>Loading items...</p>
        </div>

        <div v-else-if="cartItems.length === 0" class="state-message">
          <p>No products available to purchase.</p>
        </div>

        <div v-else class="items-container">
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
              <option>Wits - Great Hall Safe Zone</option>
            </select>
          </div>

          <!-- Escrow Protection Banner -->
          <div class="escrow-banner">
            <AppIcon name="shield" /> <strong>Escrow Protection Active:</strong> Funds are held safely by CampusSwap until you verify receipt.
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
          </div>

          <!-- Payment Options -->
          <div class="payment-selection">
            <label class="section-label">Select Payment Method</label>
            <div class="method-options">
              <label :class="['method-card', { selected: paymentMethod === 'card' }]">
                <input type="radio" v-model="paymentMethod" value="card" />
                <span>Card</span>
              </label>
              <label :class="['method-card', { selected: paymentMethod === 'Ozow Instant EFT' }]">
                <input type="radio" v-model="paymentMethod" value="Ozow Instant EFT" />
                <span>Ozow EFT</span>
              </label>
              <label :class="['method-card', { selected: paymentMethod === 'PayFast' }]">
                <input type="radio" v-model="paymentMethod" value="PayFast" />
                <span>PayFast</span>
              </label>
            </div>
          </div>

          <!-- Card Input Form -->
          <div v-if="paymentMethod === 'card'" class="card-form-box">
            <div class="test-cards-hint">
              <small>💡 Standard card numbers succeed. Ending in <code>4000</code> declines.</small>
            </div>
            <div class="form-group">
              <label>Cardholder Name</label>
              <input type="text" v-model="cardHolder" placeholder="Zaarah Khan" class="form-input" />
            </div>
            <div class="form-group">
              <label>Card Number</label>
              <input type="text" v-model="cardNumber" placeholder="4532 1234 5678 9010" maxlength="19" class="form-input" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Expiry</label>
                <input type="text" v-model="cardExpiry" placeholder="12/26" maxlength="5" class="form-input" />
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input type="password" v-model="cardCvv" placeholder="123" maxlength="4" class="form-input" />
              </div>
            </div>
          </div>

          <button 
            class="btn-pay-main" 
            :disabled="loadingProcessing" 
            @click="handleCheckout"
          >
            {{ loadingProcessing ? 'Securing Funds in Escrow...' : 'Confirm & Pay R' + totalPayable.toFixed(2) }}
          </button>
        </div>
      </div>

      <!-- State 2: Active Order Created -->
      <div v-else class="order-status-card">
        <h3>Order #{{ order.id }} Details</h3>
        <p><strong>Item:</strong> {{ order.product_name || cartItems[0]?.name || 'Marketplace Item' }}</p>
        <p><strong>Total:</strong> R{{ Number(order.total_amount).toFixed(2) }}</p>
        <p><strong>Escrow Fee:</strong> R{{ Number(order.escrow_fee).toFixed(2) }}</p>
        <p><strong>Transaction Ref:</strong> <code>{{ order.ref || ('CS-' + order.id) }}</code></p>
        <p>
          <strong>Status:</strong> 
          <span :class="['badge', order.status]">{{ order.status?.toUpperCase() }}</span>
        </p>

        <div class="actions">
          <button 
            v-if="order.status === 'pending'" 
            @click="handlePaymentSimulation" 
            class="btn-pay-main"
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
import AppIcon from './AppIcon.vue'
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { api } from '../services/api';

const router = useRouter();

const cartItems = ref([]);
const order = ref(null);
const loading = ref(true);
const loadingProcessing = ref(false);
const errorMessage = ref('');
const selectedPickupZone = ref("UCT - Chancellor's Hall Safe Zone");
const paymentMethod = ref('card');

const cardHolder = ref('');
const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvv = ref('');

const goHome = () => {
  router.push('/');
};

const getFallbackProducts = () => [
  { id: 1, name: 'Calculus: Early Transcendentals (9th Ed)', price: 450.00 }
];

onMounted(async () => {
  try {
    const products = await api.getProducts();
    cartItems.value = Array.isArray(products) && products.length > 0 ? products : getFallbackProducts();
  } catch (err) {
    cartItems.value = getFallbackProducts();
  } finally {
    loading.value = false;
  }
});

const subtotal = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + Number(item.price || 0), 0);
});

const escrowFee = computed(() => {
  return subtotal.value * 0.05;
});

const totalPayable = computed(() => {
  return subtotal.value + escrowFee.value;
});

const handleCheckout = async () => {
  if (cartItems.value.length === 0) return;

  if (paymentMethod.value === 'card') {
    if (!cardHolder.value || !cardNumber.value || !cardExpiry.value || !cardCvv.value) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Payment Details',
        text: 'Please enter cardholder name, card number, expiry date, and CVV.'
      });
      return;
    }

    const rawNum = cardNumber.value.replace(/\s+/g, '');
    if (rawNum.endsWith('4000') || rawNum.endsWith('0000')) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Declined',
        text: 'The card was declined by the bank system.'
      });
      return;
    }
  }

  loadingProcessing.value = true;
  errorMessage.value = '';

  setTimeout(async () => {
    try {
      const primaryItem = cartItems.value[0];
      const data = await api.createCheckout({
        user_id: 21,
        product_id: primaryItem.id,
        total_amount: totalPayable.value,
        payment_method: paymentMethod.value
      }).catch(() => null);

      const refNum = 'CS-' + Math.floor(10000000 + Math.random() * 90000000);

      if (data && data.orderId) {
        order.value = await api.getOrder(data.orderId).catch(() => null);
      }

      if (!order.value) {
        order.value = {
          id: Math.floor(100000 + Math.random() * 900000),
          product_name: primaryItem.name || primaryItem.title,
          total_amount: totalPayable.value,
          escrow_fee: escrowFee.value,
          status: 'in escrow',
          ref: refNum
        };
      } else {
        order.value.ref = refNum;
      }

      Swal.fire({
        icon: 'success',
        title: 'Payment Secured!',
        html: `<p>Funds held safely in escrow.</p><p>Ref: <strong>${refNum}</strong></p>`
      });
    } catch (err) {
      errorMessage.value = err.message || 'Error processing checkout.';
    } finally {
      loadingProcessing.value = false;
    }
  }, 1200);
};

const handlePaymentSimulation = async () => {
  try {
    await api.simulatePayment(order.value.id).catch(() => null);
    if (order.value) {
      order.value.status = 'in escrow';
    }
    Swal.fire('Payment Simulated!', 'Order status updated to In Escrow.', 'success');
  } catch (err) {
    errorMessage.value = err.message;
  }
};

const handleRelease = async () => {
  try {
    await api.releaseEscrow(order.value.id).catch(() => null);
    if (order.value) {
      order.value.status = 'completed';
    }
    Swal.fire('Funds Released!', 'The transaction is completed.', 'success');
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
  max-width: 540px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
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

.title {
  text-align: center;
  color: #0d1b3d;
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
  color: #2e7d5a;
  font-weight: 700;
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
  padding: 8px;
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

.card-form-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.test-cards-hint {
  margin-bottom: 10px;
  color: #64748b;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.85rem;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  gap: 10px;
}

.btn-pay-main {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #2e7d5a;
  color: white;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
}

.btn-pay-main:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.btn-release {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #2e7d5a;
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
}

.btn-back:hover {
  color: #0d1b3d;
  text-decoration: underline;
}
</style>