<template>
  <div class="checkout-wrapper">
    <div class="checkout-card">
      <!-- Back Button -->
      <button type="button" class="btn-back" @click="goHome" aria-label="Back to home">
        ← Back to Home
      </button>

      <!-- Navigation Tabs -->
      <div class="nav-tabs">
        <button :class="['tab-btn', { active: activeTab === 'cart' }]" @click="activeTab = 'cart'">
          <AppIcon name="cart" /> Cart ({{ cartCount }})
        </button>
        <button :class="['tab-btn', { active: activeTab === 'repairs' }]" @click="activeTab = 'repairs'">
          <AppIcon name="tools" /> SafeHome ({{ repairs.length }})
        </button>
        <button :class="['tab-btn', { active: activeTab === 'orders' }]" @click="activeTab = 'orders'">
          <AppIcon name="package" /> My Orders ({{ orders.length }})
        </button>
      </div>

      <!-- ================= TAB 1: CART ================= -->
      <div v-if="activeTab === 'cart'" class="tab-body">
        <h2 class="title">Marketplace Cart</h2>

        <div v-if="cartItems.length === 0" class="empty-box">
          <p class="empty-title">Your shopping cart is empty.</p>
          <p class="empty-sub">
            Browse the marketplace to add textbooks, tech and dorm essentials.
          </p>
          <button class="btn-primary-sm" @click="$router.push('/marketplace')">
            Browse marketplace
          </button>
        </div>

        <div v-else class="cart-content">
          <div v-for="item in cartItems" :key="item.id" class="item-card">
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="price">
                R{{ Number(item.price).toFixed(2) }} × {{ item.quantity || 1 }}
              </p>
            </div>
            <button class="btn-remove" @click="removeItem(item.id)" title="Remove item">
              &times;
            </button>
          </div>

          <!-- Pickup Zone -->
          <div class="pickup-box">
            <label><AppIcon name="building" /> Secure On-Campus Pickup Zone</label>
            <select v-model="selectedCampus" class="select-input">
              <option v-for="uni in universities" :key="uni.id" :value="uni.name">
                {{ uni.name }} — {{ uni.province }}
              </option>
            </select>
            <p v-if="defaultCampusApplied" class="pickup-hint">
              Pre-selected to your institution. Change it if you'd like a different pickup point.
            </p>
          </div>

          <!-- Escrow banner -->
          <div class="escrow-banner">
            <AppIcon name="shield" />
            <strong>Escrow Protection Active:</strong> Funds are held safely by
            CampusSwap SA until you verify receipt.
          </div>

          <!-- Summary -->
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

          <!-- Payment method -->
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

          <div v-if="paymentMethod === 'card'" class="card-form-box">
            <div class="test-cards-hint">
              <small>
                <AppIcon name="info" />
                <strong>Test Cards:</strong> Use standard 16 digits for Success.
                End in <code>4000</code> or <code>0000</code> to test Declined.
              </small>
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
            <span v-if="isProcessing">Processing Payment…</span>
            <span v-else>Pay R{{ totalPayable.toFixed(2) }} Now</span>
          </button>
        </div>
      </div>

      <!-- ================= TAB 2: SAFEHOME ================= -->
      <div v-if="activeTab === 'repairs'" class="tab-body">
        <h2 class="title">SafeHome Requests</h2>
        <p class="payment-note">
          SafeHome repairs are paid by the Residence Manager. Students track
          requests here but are not charged.
        </p>

        <div v-if="loadingRepairs" class="empty-box">Loading your requests…</div>
        <div v-else-if="repairs.length === 0" class="empty-box">
          <p class="empty-title">No active repair requests.</p>
          <p class="empty-sub">
            Head to SafeHome to log a plumbing, electrical, or handyman request.
          </p>
          <button class="btn-primary-sm" @click="$router.push('/safehome')">
            Go to SafeHome
          </button>
        </div>

        <div v-else>
          <div v-for="repair in repairs" :key="repair.id" class="item-card repair-card">
            <div class="item-info">
              <h4>{{ repair.title }}</h4>
              <p class="repair-desc">{{ repair.description }}</p>
              <p class="location-tag">
                <AppIcon name="building" /> {{ repair.residence_name }}
                <span v-if="repair.room_number"> — {{ repair.room_number }}</span>
              </p>
              <p class="price">
                Estimated Cost:
                {{
                  repair.estimated_cost
                    ? `R${Number(repair.estimated_cost).toFixed(2)}`
                    : "Awaiting quote"
                }}
              </p>
              <span
                v-if="repair.status === 'completed'"
                class="status-completed-pill"
              >
                Completed
              </span>
            </div>

            <div class="repair-actions">
              <button class="btn-track" @click="openRepairTracker(repair)">
                Track request
              </button>

              <template v-if="repair.status === 'completed'">
                <span v-if="reviewedServices[repair.id]" class="reviewed-note">
                  ✓ Reviewed
                </span>
                <button v-else class="btn-review" @click="leaveReview(repair)">
                  Leave a review
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= TAB 3: ORDERS ================= -->
      <div v-if="activeTab === 'orders'" class="tab-body">
        <h2 class="title">My Orders &amp; Escrow Status</h2>

        <p v-if="loadingOrders" class="empty-box">Loading your orders…</p>
        <div v-else-if="orders.length === 0" class="empty-box">
          <p class="empty-title">No orders placed yet.</p>
          <p class="empty-sub">
            Your completed checkouts will appear here with an escrow tracker.
          </p>
          <button class="btn-primary-sm" @click="$router.push('/marketplace')">
            Browse marketplace
          </button>
        </div>

        <div v-else class="orders-list">
          <div v-for="ord in orders" :key="ord.id" class="order-card">
            <div class="order-header">
              <span><strong>Order #{{ ord.id }}</strong></span>
              <span :class="['badge', ord.badgeClass]">{{ ord.status }}</span>
            </div>
            <p v-if="ord.item_names" class="order-items">{{ ord.item_names }}</p>
            <p><strong>Total:</strong> R{{ Number(ord.total).toFixed(2) }}</p>
            <p v-if="ord.ref" class="ref-text">
              <strong>Ref:</strong> <code>{{ ord.ref }}</code>
            </p>

            <div class="order-actions">
              <button class="btn-track" @click="openOrderTracker(ord)">Track order</button>
              <button
                v-if="ord.rawStatus === 'paid'"
                class="btn-release"
                @click="releaseFunds(ord.id)"
              >
                Confirm delivery &amp; release funds
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step tracker -->
    <OrderTrackerModal
      v-if="trackerOpen"
      :kind="trackerKind"
      :reference="trackerRef"
      :status="trackerStatus"
      @close="trackerOpen = false"
    />
  </div>
</template>

<script>
import AppIcon from "./AppIcon.vue";
import OrderTrackerModal from "./OrderTrackerModal.vue";
import Swal from "sweetalert2";
import { api, API_BASE } from "../services/api";

export default {
  name: "CheckoutView",
  components: { AppIcon, OrderTrackerModal },

  data() {
    return {
      activeTab: "cart",
      universities: [],
      repairs: [],
      orders: [],
      selectedCampus: "",
      defaultCampusApplied: false,
      paymentMethod: "card",
      isProcessing: false,
      loadingOrders: false,
      loadingRepairs: false,

      cardForm: { holder: "", number: "", expiry: "", cvv: "" },

      trackerOpen: false,
      trackerKind: "order",
      trackerRef: "",
      trackerStatus: "",

      // Track which completed services the student has already reviewed.
      reviewedServices: {},
    };
  },

  computed: {
    currentUser() {
      try {
        return JSON.parse(localStorage.getItem("user") || "{}");
      } catch {
        return {};
      }
    },
    cartItems() {
      return this.$store.state.market?.cart || [];
    },
    cartCount() {
      return this.cartItems.reduce((s, i) => s + (i.quantity || 1), 0);
    },
    subtotal() {
      return this.cartItems.reduce(
        (acc, item) => acc + Number(item.price || 0) * (item.quantity || 1),
        0,
      );
    },
    escrowFee() {
      return this.cartItems.length > 0 ? 25.0 : 0.0;
    },
    totalPayable() {
      return this.subtotal + this.escrowFee;
    },
  },

  watch: {
    cartItems: {
      handler(newVal) {
        if (newVal.length === 0) this.defaultCampusApplied = false;
      },
    },
  },

  async mounted() {
    await Promise.all([
      this.loadUniversities(),
      this.loadRepairs(),
      this.loadOrders(),
    ]);
  },

  methods: {
    goHome() {
      this.$router.push("/");
    },

    // ------------------------------------------------------------------
    // Loaders
    // ------------------------------------------------------------------
    async loadUniversities() {
      try {
        this.universities = await api.getUniversities();
        const userUni =
          this.currentUser.university_name || this.currentUser.university || "";
        const match = this.universities.find((u) => u.name === userUni);
        if (match) {
          this.selectedCampus = match.name;
          this.defaultCampusApplied = true;
        } else {
          this.selectedCampus = this.universities[0]?.name || "";
        }
      } catch (err) {
        console.error("[checkout] universities load failed:", err);
        this.universities = [];
      }
    },

    async loadRepairs() {
      const uid = this.currentUser.id;
      if (!uid) return;
      this.loadingRepairs = true;
      try {
        const res = await fetch(`${API_BASE}/services?student_id=${uid}`);
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const body = await res.json();
        this.repairs = (body.data || []).filter(
          (r) => r.status !== "cancelled",
        );

        // For each finished job, check if a review already exists so the
        // button can show "✓ Reviewed" instead of "Leave a review".
        const completed = this.repairs.filter((r) => r.status === "completed");
        await Promise.all(
          completed.map(async (r) => {
            try {
              const rv = await fetch(`${API_BASE}/services/${r.id}/review`);
              const rb = await rv.json();
              if (rb.reviewed) {
                this.reviewedServices = {
                  ...this.reviewedServices,
                  [r.id]: true,
                };
              }
            } catch {
              // Silent fail — leave the button visible.
            }
          }),
        );
      } catch (err) {
        console.error("[checkout] repairs load failed:", err);
        this.repairs = [];
      } finally {
        this.loadingRepairs = false;
      }
    },

    async loadOrders() {
      const uid = this.currentUser.id;
      if (!uid) return;
      this.loadingOrders = true;
      try {
        const res = await fetch(`${API_BASE}/orders?buyer_id=${uid}`);
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const rows = await res.json();
        this.orders = rows.map((o) => this.normaliseOrder(o));
      } catch (err) {
        console.error("[checkout] orders load failed:", err);
        this.orders = [];
      } finally {
        this.loadingOrders = false;
      }
    },

    normaliseOrder(o) {
      const dbStatus = o.status || "pending";
      return {
        id: o.id,
        total: Number(o.total_amount),
        ref: o.order_reference,
        rawStatus: dbStatus,
        status: this.prettyOrderStatus(dbStatus),
        badgeClass: this.badgeClassFor(dbStatus),
        item_names: o.item_names || "",
      };
    },

    prettyOrderStatus(dbStatus) {
      return (
        {
          pending: "Pending",
          paid: "In Escrow",
          shipped: "Shipped",
          completed: "Completed",
          cancelled: "Cancelled",
          refunded: "Refunded",
        }[dbStatus] || dbStatus
      );
    },

    badgeClassFor(dbStatus) {
      if (dbStatus === "completed") return "success";
      if (dbStatus === "cancelled" || dbStatus === "refunded") return "danger";
      if (dbStatus === "shipped") return "info";
      return "escrow";
    },

    // ------------------------------------------------------------------
    // Cart
    // ------------------------------------------------------------------
    removeItem(id) {
      this.$store.dispatch("market/removeFromCart", id);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Item removed from cart",
        showConfirmButton: false,
        timer: 1800,
      });
    },

    // ------------------------------------------------------------------
    // Payment
    // ------------------------------------------------------------------
    async processPayment() {
      if (this.cartItems.length === 0) return;

      if (this.paymentMethod === "card") {
        if (
          !this.cardForm.holder ||
          !this.cardForm.number ||
          !this.cardForm.expiry ||
          !this.cardForm.cvv
        ) {
          return Swal.fire({
            icon: "error",
            title: "Missing Payment Details",
            text: "Please fill in all card details before proceeding.",
          });
        }
        const raw = this.cardForm.number.replace(/\s+/g, "");
        if (raw.length < 12) {
          return Swal.fire({
            icon: "error",
            title: "Invalid Card Number",
            text: "Please enter a valid card number.",
          });
        }
        if (raw.endsWith("4000") || raw.endsWith("0000")) {
          return Swal.fire({
            icon: "error",
            title: "Payment Declined",
            text: "Your card was declined by the simulated bank. Please try another card.",
          });
        }
      }

      this.isProcessing = true;
      await new Promise((r) => setTimeout(r, 900));

      try {
        const me = this.currentUser;
        if (!me.id) throw new Error("You must be logged in to pay.");

        const firstItem = this.cartItems[0];
        const sellerId =
          firstItem.sellerId ?? firstItem.seller_id ?? firstItem.seller?.id ?? null;

        const order = await api.createCheckout({
          buyerId: me.id,
          sellerId,
          items: this.cartItems.map((it) => ({
            productId: it.id,
            sellerId: it.sellerId ?? it.seller_id ?? sellerId,
            quantity: it.quantity ?? 1,
            unitPrice: Number(it.price) || 0,
          })),
        });

        await api.simulatePayment(order.id);

        await this.loadOrders();
        this.$store.dispatch("market/clearCart");
        this.activeTab = "orders";

        await Swal.fire({
          icon: "success",
          title: "Payment Secured in Escrow!",
          html: `
            <p>Transaction Ref: <strong>${order.order_reference}</strong></p>
            <p>Pickup Location: <strong>${this.selectedCampus}</strong></p>
          `,
          confirmButtonColor: "#2e7d5a",
        });
      } catch (err) {
        console.error("[checkout] order failed:", err);
        await Swal.fire({
          icon: "error",
          title: "Payment failed",
          text:
            err.message ||
            "Could not complete your order. Please try again.",
          confirmButtonColor: "#d33",
        });
      } finally {
        this.isProcessing = false;
      }
    },

    // ------------------------------------------------------------------
    // Tracker
    // ------------------------------------------------------------------
    openOrderTracker(order) {
      this.trackerKind = "order";
      this.trackerRef = order.ref || `Order #${order.id}`;
      this.trackerStatus = order.rawStatus || "pending";
      this.trackerOpen = true;
    },
    openRepairTracker(repair) {
      this.trackerKind = "repair";
      this.trackerRef = `${repair.title} · ${repair.residence_name}`;
      this.trackerStatus = (repair.status || "pending").toLowerCase();
      this.trackerOpen = true;
    },

    // ------------------------------------------------------------------
    // Escrow release
    // ------------------------------------------------------------------
    async releaseFunds(orderId) {
      const confirm = await Swal.fire({
        title: "Release funds to seller?",
        text: "Only confirm if you have received your item and are satisfied.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2e7d5a",
        confirmButtonText: "Yes, release funds",
      });
      if (!confirm.isConfirmed) return;

      try {
        await api.releaseEscrow(orderId);
        await this.loadOrders();
        await Swal.fire(
          "Funds Released!",
          "Transaction successfully completed.",
          "success",
        );
      } catch (err) {
        await Swal.fire({
          icon: "error",
          title: "Could not release",
          text: err.message || "Please try again.",
        });
      }
    },

    // ------------------------------------------------------------------
    // Reviews
    // ------------------------------------------------------------------
    async leaveReview(repair) {
      const me = this.currentUser;
      if (!me.id) {
        return Swal.fire({ icon: "error", title: "Please log in" });
      }

      const { value: formValues } = await Swal.fire({
        title: `Review "${repair.title}"`,
        html: `
          <p style="color:#475569;font-size:13px;margin:0 0 12px">
            Rate your experience with this SafeHome job.
          </p>
          <div id="star-row"
               style="display:flex;justify-content:center;gap:8px;font-size:34px;margin-bottom:14px">
            ${[1, 2, 3, 4, 5]
              .map(
                (n) => `
              <label style="cursor:pointer" data-val="${n}">
                <input type="radio" name="stars" value="${n}" style="display:none" />
                <span class="star" style="color:#cbd5e1">★</span>
              </label>`,
              )
              .join("")}
          </div>
          <textarea id="review-text" rows="3"
            style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;color:#1e293b"
            placeholder="Tell others how it went (optional)"></textarea>
        `,
        showCancelButton: true,
        confirmButtonText: "Submit review",
        confirmButtonColor: "#2e7d5a",
        didOpen: () => {
          const stars = document.querySelectorAll(".star");
          const paint = (upTo) => {
            stars.forEach((s, i) => {
              s.style.color = i < upTo ? "#f5b941" : "#cbd5e1";
            });
          };
          stars.forEach((star, i) => {
            star.addEventListener("mouseenter", () => paint(i + 1));
            star.addEventListener("click", () => {
              const radios = document.querySelectorAll('input[name="stars"]');
              if (radios[i]) radios[i].checked = true;
              paint(i + 1);
            });
          });
          document.getElementById("star-row")?.addEventListener("mouseleave", () => {
            const sel = document.querySelector('input[name="stars"]:checked');
            paint(sel ? Number(sel.value) : 0);
          });
        },
        preConfirm: () => {
          const sel = document.querySelector('input[name="stars"]:checked');
          const rating = sel ? Number(sel.value) : 0;
          if (!rating) {
            Swal.showValidationMessage("Please choose a star rating");
            return false;
          }
          return {
            rating,
            comment: (
              document.getElementById("review-text")?.value || ""
            ).trim(),
          };
        },
      });

      if (!formValues) return;

      try {
        const res = await fetch(`${API_BASE}/services/${repair.id}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: me.id,
            rating: formValues.rating,
            comment: formValues.comment,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed (${res.status})`);
        }
        this.reviewedServices = {
          ...this.reviewedServices,
          [repair.id]: true,
        };
        Swal.fire({
          icon: "success",
          title: "Thanks for the review!",
          text: "Your feedback helps other students pick a provider.",
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Could not submit",
          text: err.message,
        });
      }
    },
  },
};
</script>

<style scoped>
/* ---------- Page shell ---------- */
.checkout-wrapper {
  display: flex;
  justify-content: center;
  padding: 30px 15px 120px;
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

/* ---------- Tabs ---------- */
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
  color: #334155;
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
  margin: 0 0 16px;
}

/* ---------- Item / repair / order cards ---------- */
.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  gap: 12px;
}
.repair-card {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.repair-desc {
  font-size: 0.85rem;
  color: #475569;
  margin: 4px 0;
}
.location-tag {
  font-size: 0.8rem;
  color: #0369a1;
  font-weight: 500;
  margin: 0;
}
.item-info h4 {
  margin: 0 0 4px;
  color: #1e293b;
  font-weight: 700;
}
.price {
  font-weight: 700;
  color: #047857;
  margin: 0;
}
.btn-remove {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #64748b;
  cursor: pointer;
  line-height: 1;
}

/* ---------- Pickup zone ---------- */
.pickup-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0 12px;
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
  color: #1e293b;
}
.pickup-hint {
  margin: 6px 0 0;
  font-size: 0.75rem;
  color: #166534;
  opacity: 0.9;
}

/* ---------- Escrow banner ---------- */
.escrow-banner {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

/* ---------- Summary ---------- */
.summary-box {
  margin-top: 16px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #334155;
  margin-bottom: 8px;
}
.summary-row.total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0d1b3d;
}
.total-price {
  color: #047857;
}
.divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 12px 0;
}

/* ---------- Payment ---------- */
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
  color: #334155;
}
.method-card.selected {
  border-color: #2e7d5a;
  background: #f0fdf4;
  color: #166534;
}
.method-card input[type="radio"] {
  appearance: auto;
  accent-color: #2e7d5a;
  display: block;
  height: 16px;
  min-width: 16px;
  margin: 0;
}

/* ---------- Card form ---------- */
.card-form-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;
}
.test-cards-hint {
  margin-bottom: 12px;
  color: #334155;
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
  color: #1e293b;
}
.form-row {
  display: flex;
  gap: 12px;
}

/* ---------- Action buttons ---------- */
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
}
.btn-pay-main:hover {
  background-color: #235f45;
}
.btn-pay-main:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.btn-track {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #2e7d5a;
  background: #f0fdf4;
  color: #166534;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-track:hover {
  background: #dcfce7;
}

.btn-release {
  padding: 10px 14px;
  border-radius: 8px;
  background-color: #2e7d5a;
  color: white;
  border: none;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-release:hover {
  background-color: #235f45;
}

.btn-review {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #f5b941;
  background: #fff8e7;
  color: #92400e;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn-review:hover {
  background: #fef3c7;
}

.btn-primary-sm {
  background: #0d1b3d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-primary-sm:hover {
  background: #2e7d5a;
}

/* ---------- Repair action group ---------- */
.repair-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.reviewed-note {
  font-size: 0.8rem;
  font-weight: 700;
  color: #047857;
}
.status-completed-pill {
  display: inline-block;
  margin-top: 6px;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 999px;
  background: #d1fae5;
  color: #065f46;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ---------- Payment note ---------- */
.payment-note {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1e40af;
  font-size: 0.85rem;
  margin-bottom: 16px;
  padding: 12px;
}

/* ---------- Empty states ---------- */
.empty-box {
  text-align: center;
  padding: 32px 20px;
  color: #475569;
}
.empty-title {
  font-weight: 700;
  color: #0d1b3d;
  margin: 0 0 6px;
  font-size: 1rem;
}
.empty-sub {
  font-size: 0.85rem;
  margin: 0 0 16px;
}

/* ---------- Orders ---------- */
.order-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 12px;
  color: #1e293b;
}
.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.order-items {
  font-size: 0.82rem;
  color: #475569;
  margin: 0 0 6px;
  font-style: italic;
}
.ref-text {
  font-size: 0.85rem;
  color: #475569;
  margin: 4px 0 8px;
}
.badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}
.badge.escrow {
  background: #dbeafe;
  color: #1e40af;
}
.badge.success {
  background: #d1fae5;
  color: #065f46;
}
.badge.info {
  background: #e0f2fe;
  color: #0369a1;
}
.badge.danger {
  background: #fee2e2;
  color: #991b1b;
}
.order-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

/* ---------- Back button ---------- */
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #334155;
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