<template>
  <div class="checkout-wrapper">
    <div class="checkout-container">
      
      <!-- Back to Home Button -->
      <button @click="goToHome" class="back-home-btn">
        ← Back to CampusSwap Home
      </button>

      <!-- Navigation Tabs -->
      <div class="tab-navigation">
        <button 
          :class="['tab-btn', activeTab === 'cart' ? 'active' : '']" 
          @click="activeTab = 'cart'"
        >
          🛒 Cart ({{ cartItems.length }})
        </button>
        <button 
          :class="['tab-btn', activeTab === 'safehome' ? 'active' : '']" 
          @click="activeTab = 'safehome'"
        >
          🛠️ SafeHome (Repairs)
        </button>
        <button 
          :class="['tab-btn', activeTab === 'orders' ? 'active' : '']" 
          @click="activeTab = 'orders'"
        >
          📦 My Orders ({{ orders.length }})
        </button>
      </div>

      <!-- TAB 1: MARKETPLACE CART -->
      <div v-if="activeTab === 'cart'">
        <h2 class="title">Marketplace Cart</h2>

        <div v-if="cartItems.length > 0" class="cart-items-list">
          <div v-for="item in cartItems" :key="item.id" class="cart-card">
            <img :src="item.image" :alt="item.title" class="product-img" />
            <div class="product-info">
              <h3>{{ item.title }}</h3>
              <p class="seller">Seller: {{ item.seller }} • {{ item.condition }}</p>
              <span class="price">R{{ item.price.toFixed(2) }}</span>
            </div>
            <button @click="removeItem(item.id)" class="delete-btn" title="Remove item">🗑️</button>
          </div>
        </div>

        <div v-else class="empty-cart">
          <p>Your shopping cart is empty.</p>
          <button @click="resetCart" class="reset-btn">Reload Sample Items</button>
        </div>

        <!-- Campus Pickup Selector -->
        <div class="info-card pickup-card">
          <span class="icon">📍</span>
          <div class="pickup-select-group">
            <label for="pickup-zone"><strong>Secure On-Campus Pickup Zone</strong></label>
            <select id="pickup-zone" v-model="selectedPickupZone" class="pickup-dropdown">
              <optgroup label="Western Cape">
                <option value="UCT - Chancellor's Hall Safe Zone">UCT - Chancellor's Hall Safe Zone</option>
                <option value="CPUT - Bellville Library Safe Spot">CPUT - Bellville Library Safe Spot</option>
                <option value="UWC - Student Centre Exchange Area">UWC - Student Centre Exchange Area</option>
                <option value="SU - Neelsie Student Centre Safe Zone">SU - Neelsie Student Centre Safe Zone</option>
              </optgroup>
              <optgroup label="Gauteng">
                <option value="Wits - Great Hall Entrance">Wits - Great Hall Entrance</option>
                <option value="UJ - APK Student Centre">UJ - APK Student Centre</option>
                <option value="UP - Hatfield Campus Centre">UP - Hatfield Campus Centre</option>
                <option value="TUT - Pretoria Campus Main Gate">TUT - Pretoria Campus Main Gate</option>
              </optgroup>
              <optgroup label="KwaZulu-Natal">
                <option value="UKZN - Howard College Student Union">UKZN - Howard College Student Union</option>
                <option value="DUT - Steve Biko Campus Library">DUT - Steve Biko Campus Library</option>
              </optgroup>
              <optgroup label="Eastern Cape">
                <option value="Rhodes - Kaaba Dining Hall Safe Spot">Rhodes - Kaaba Dining Hall Safe Spot</option>
                <option value="NMU - Ocean Sciences Campus">NMU - Ocean Sciences Campus</option>
              </optgroup>
              <optgroup label="Free State">
                <option value="UFS - Bloemfontein Student Centre">UFS - Bloemfontein Student Centre</option>
                <option value="CUT - Main Campus Gate">CUT - Main Campus Gate</option>
              </optgroup>
            </select>
          </div>
        </div>

        <!-- Escrow Banner -->
        <div class="info-card escrow-card">
          <span class="icon">🛡️</span>
          <p><strong>Escrow Protection Active:</strong> Funds are held safely by CampusSwap until you verify you received the items.</p>
        </div>

        <!-- Order Totals -->
        <div class="summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>R{{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Platform Escrow Fee</span>
            <span>R{{ activeEscrowFee.toFixed(2) }}</span>
          </div>
          <div class="summary-row total-row">
            <span>Total Payable</span>
            <span class="total-price">R{{ totalPayable.toFixed(2) }}</span>
          </div>
        </div>

        <button @click="simulatePayment('Ozow Instant EFT', 'Marketplace Item')" class="pay-btn primary-btn" :disabled="cartItems.length === 0 || isProcessing">
          {{ isProcessing ? 'Processing...' : 'Pay with Ozow Instant EFT' }}
        </button>

        <button @click="simulatePayment('PayFast', 'Marketplace Item')" class="pay-btn secondary-btn" :disabled="cartItems.length === 0 || isProcessing">
          {{ isProcessing ? 'Processing...' : 'Pay with PayFast' }}
        </button>
      </div>

      <!-- TAB 2: SAFEHOME REPAIR REQUEST & HANDYMAN ESCROW -->
      <div v-else-if="activeTab === 'safehome'">
        <h2 class="title">SafeHome Repairs</h2>
        
        <!-- Updated Banner Color from Orange to Tech Teal -->
        <div class="info-card safehome-banner">
          <span class="icon">🔧</span>
          <p><strong>Student Residence Repairs:</strong> Book verified handymen for plumbing or electrical issues. Funds are held in Escrow until the repair is completed.</p>
        </div>

        <!-- Pending Handyman Repair Card -->
        <div class="safehome-card">
          <div class="safehome-header">
            <div>
              <h3>{{ handymanBooking.handymanName }}</h3>
              <p class="seller">Specialty: {{ handymanBooking.specialty }}</p>
            </div>
            <!-- Updated Badge Color from Orange to Blue/Teal -->
            <span class="badge-blue">Repair Pending</span>
          </div>

          <div class="repair-form-preview">
            <div class="detail-row">
              <span>Room / Res Number:</span>
              <strong>{{ handymanBooking.roomNumber }}</strong>
            </div>
            <div class="detail-row">
              <span>Reported Issue:</span>
              <strong>{{ handymanBooking.issueType }} - {{ handymanBooking.description }}</strong>
            </div>
            <!-- Rating moved to the bottom details section -->
            <div class="detail-row">
              <span>Handyman Rating:</span>
              <strong>★ {{ handymanBooking.rating }}</strong>
            </div>
            <div class="detail-row">
              <span>Handyman Callout Fee:</span>
              <strong class="price">R{{ handymanBooking.fee.toFixed(2) }}</strong>
            </div>
          </div>

          <button @click="simulatePayment('Ozow Instant EFT', 'SafeHome Repair')" class="pay-btn primary-btn" :disabled="isProcessing">
            Pay Callout Fee into Escrow (R{{ handymanBooking.fee.toFixed(2) }})
          </button>
        </div>
      </div>

      <!-- TAB 3: ORDER & REPAIR HISTORY -->
      <div v-else>
        <h2 class="title">My Orders & Service Requests</h2>

        <div v-if="orders.length > 0" class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-header">
              <div>
                <strong>{{ order.type }} #{{ order.id }}</strong>
                <p class="order-date">{{ order.date }}</p>
              </div>
              <span :class="['status-badge', order.status.toLowerCase().replace(' ', '-')]">
                {{ order.status }}
              </span>
            </div>

            <div class="order-pickup" v-if="order.pickupZone">
              <span>📍 <strong>Pickup Spot:</strong> {{ order.pickupZone }}</span>
            </div>

            <div class="order-items">
              <div v-for="item in order.items" :key="item.id" class="order-item-row">
                <span>{{ item.title }}</span>
                <span>R{{ item.price.toFixed(2) }}</span>
              </div>
            </div>

            <div class="order-footer">
              <span>Total Paid (Escrow): <strong>R{{ order.total.toFixed(2) }}</strong></span>
              <button @click="confirmReceipt(order.id)" class="received-btn" v-if="order.status === 'In Escrow'">
                Confirm Job Done / Item Received
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-cart">
          <p>No past orders or repair requests yet.</p>
        </div>
      </div>

      <!-- Mock Payment Modal -->
      <div v-if="showMockModal" class="modal-overlay">
        <div class="modal-box">
          <h3>Mock Payment Gateway</h3>
          <p>Processing <strong>R{{ modalAmount.toFixed(2) }}</strong> for {{ modalType }} via {{ selectedMethod }}</p>
          <button @click="completePayment" class="confirm-btn">Confirm & Pay</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutView',
  data() {
    return {
      activeTab: 'cart',
      selectedPickupZone: "UCT - Chancellor's Hall Safe Zone",
      escrowFee: 15.00,
      isProcessing: false,
      showMockModal: false,
      selectedMethod: '',
      modalType: '',
      modalAmount: 0,
      cartItems: [
        { id: 1, title: 'Calculus MAM1000W Textbook', seller: 'Thabo M.', condition: 'Good Condition', price: 350.00, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150' },
        { id: 2, title: 'Casio FX-991ZA Plus II Calculator', seller: 'Sipho N.', condition: 'Like New', price: 280.00, image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e498?w=150' },
        { id: 3, title: 'Lab Coat & Safety Goggles (Size M)', seller: 'Kecia K.', condition: 'Used - Fair', price: 150.00, image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=150' }
      ],
      handymanBooking: {
        handymanName: 'Sipho’s Plumbing & Electrical',
        specialty: 'Plumbing / Electrical Specialist',
        rating: '4.9 (28 jobs)',
        roomNumber: 'Res Block B, Room 304',
        issueType: 'Plumbing',
        description: 'Leaking basin tap',
        fee: 250.00
      },
      orders: []
    };
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((acc, item) => acc + item.price, 0);
    },
    activeEscrowFee() {
      return this.cartItems.length > 0 ? this.escrowFee : 0.00;
    },
    totalPayable() {
      return this.subtotal + this.activeEscrowFee;
    }
  },
  methods: {
    goToHome() {
      alert("Navigating back to CampusSwap Home!");
    },
    removeItem(id) {
      this.cartItems = this.cartItems.filter(item => item.id !== id);
    },
    resetCart() {
      this.cartItems = [
        { id: 1, title: 'Calculus MAM1000W Textbook', seller: 'Thabo M.', condition: 'Good Condition', price: 350.00, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150' },
        { id: 2, title: 'Casio FX-991ZA Plus II Calculator', seller: 'Sipho N.', condition: 'Like New', price: 280.00, image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e498?w=150' },
        { id: 3, title: 'Lab Coat & Safety Goggles (Size M)', seller: 'Kecia K.', condition: 'Used - Fair', price: 150.00, image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=150' }
      ];
    },
    simulatePayment(method, type) {
      this.selectedMethod = method;
      this.modalType = type;
      this.modalAmount = type === 'SafeHome Repair' ? this.handymanBooking.fee : this.totalPayable;
      this.showMockModal = true;
    },
    completePayment() {
      this.showMockModal = false;
      this.isProcessing = true;

      setTimeout(() => {
        let newOrder;
        if (this.modalType === 'SafeHome Repair') {
          newOrder = {
            id: Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString('en-ZA'),
            type: 'SafeHome Handyman Booking',
            items: [{ id: 88, title: `Repair: ${this.handymanBooking.issueType} (${this.handymanBooking.roomNumber})`, price: this.handymanBooking.fee }],
            total: this.handymanBooking.fee,
            pickupZone: null,
            status: 'In Escrow'
          };
        } else {
          newOrder = {
            id: Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString('en-ZA'),
            type: 'Marketplace Order',
            items: [...this.cartItems],
            total: this.totalPayable,
            pickupZone: this.selectedPickupZone,
            status: 'In Escrow'
          };
          this.cartItems = [];
        }

        this.orders.unshift(newOrder);
        this.isProcessing = false;
        this.activeTab = 'orders';
      }, 800);
    },
    confirmReceipt(orderId) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'Completed';
      }
    }
  }
};
</script>

<style scoped>
.checkout-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 30px 16px;
  background-color: #F4F6F8;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.checkout-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 540px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(13, 27, 61, 0.08);
  box-sizing: border-box;
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #64748B;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  align-self: flex-start;
}
.back-home-btn:hover { color: #0D1B3D; }

.tab-navigation { display: flex; gap: 6px; background: #E2E8F0; padding: 4px; border-radius: 10px; margin-bottom: 20px; }
.tab-btn { flex: 1; padding: 10px 4px; border: none; border-radius: 8px; background: transparent; font-weight: bold; cursor: pointer; color: #64748B; font-size: 0.8rem; }
.tab-btn.active { background: #0D1B3D; color: #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }

.title { font-size: 1.5rem; font-weight: bold; margin-top: 0; margin-bottom: 16px; color: #0D1B3D; }

/* Cart Items */
.cart-items-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.cart-card { display: flex; align-items: center; gap: 12px; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; }
.product-img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; }
.product-info { flex: 1; }
.product-info h3 { font-size: 0.95rem; margin: 0; color: #0D1B3D; }
.seller { font-size: 0.8rem; color: #64748B; margin: 4px 0; }
.price { color: #2E7D5A; font-weight: bold; font-size: 1rem; }
.delete-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #EF4444; }

/* SafeHome Handyman Card (Replaced Orange with Tech Teal/Blue Accent) */
.safehome-banner { background: #E6F6F6; color: #007A7A; border-left: 4px solid #00A6A6; }
.safehome-card { border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; background: #FAFAFA; }
.safehome-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.safehome-header h3 { margin: 0; font-size: 1.05rem; color: #0D1B3D; }
.badge-blue { background: #E6F6F6; color: #007A7A; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
.repair-form-preview { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; padding: 12px 0; margin-bottom: 16px; }
.detail-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: #64748B; }

/* Info Banners */
.info-card { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: 10px; margin-bottom: 12px; font-size: 0.85rem; }
.pickup-card { background: #E6F6F6; color: #00A6A6; border-left: 4px solid #00A6A6; }
.pickup-select-group { display: flex; flex-direction: column; gap: 6px; width: 100%; color: #0D1B3D; }
.pickup-dropdown { padding: 8px; border-radius: 6px; border: 1px solid #CBD5E1; font-size: 0.85rem; background: white; color: #0D1B3D; }
.pickup-dropdown optgroup { font-weight: bold; color: #0D1B3D; background-color: #F4F6F8; }
.escrow-card { background: #EAF5F0; color: #2E7D5A; border: 1px solid #2E7D5A; }
.escrow-card p { margin: 0; }

/* Summary */
.summary { margin: 16px 0; border-top: 1px solid #E2E8F0; padding-top: 12px; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: #64748B; font-size: 0.95rem; }
.total-row { font-weight: bold; color: #0D1B3D; font-size: 1.15rem; border-top: 1px solid #E2E8F0; padding-top: 10px; }
.total-price { color: #2E7D5A; }

/* Buttons */
.empty-cart { text-align: center; padding: 24px 0; color: #64748B; }
.reset-btn { background: #0D1B3D; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.pay-btn { width: 100%; padding: 14px; border-radius: 10px; border: none; font-weight: bold; cursor: pointer; margin-bottom: 10px; font-size: 0.95rem; }
.pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.primary-btn { background: #0D1B3D; color: white; }
.secondary-btn { background: #6C44B6; color: white; }

/* Order History */
.orders-list { display: flex; flex-direction: column; gap: 16px; }
.order-card { border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; background: #FAFAFA; }
.order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.order-date { font-size: 0.8rem; color: #64748B; margin: 2px 0 0 0; }
.status-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; }
.status-badge.in-escrow { background: #E6F6F6; color: #007A7A; }
.status-badge.completed { background: #EAF5F0; color: #2E7D5A; }
.order-pickup { font-size: 0.85rem; color: #0D1B3D; margin-bottom: 12px; background: #F4F6F8; padding: 8px 10px; border-radius: 6px; }
.order-items { border-top: 1px dashed #CBD5E1; border-bottom: 1px dashed #CBD5E1; padding: 8px 0; margin-bottom: 12px; }
.order-item-row { display: flex; justify-content: space-between; font-size: 0.85rem; color: #64748B; margin-bottom: 4px; }
.order-footer { display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; color: #0D1B3D; }
.received-btn { background: #2E7D5A; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(13, 27, 61, 0.5); display: flex; justify-content: center; align-items: center; z-index: 100; }
.modal-box { background: white; padding: 24px; border-radius: 12px; text-align: center; width: 85%; max-width: 320px; color: #0D1B3D; }
.confirm-btn { background: #2E7D5A; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 12px; }
</style>