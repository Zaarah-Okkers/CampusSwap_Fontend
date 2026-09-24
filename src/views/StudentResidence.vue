<template>
  <main class="residence-page">
    <div class="residence-shell">
      <header class="page-heading">
        <div>
          <p class="eyebrow">Student residence</p>
          <h1>Your residence</h1>
          <p class="muted">
            Find a room or stay on top of your current residence payments.
          </p>
        </div>
        <router-link class="button button-secondary" to="/student-dashboard">
          Dashboard
        </router-link>
      </header>

      <nav class="residence-tabs" aria-label="Residence views">
        <button
          :class="{ active: view === 'current' }"
          @click="view = 'current'"
        >
          My residence
        </button>
        <button :class="{ active: view === 'find' }" @click="view = 'find'">
          Find a residence
        </button>
      </nav>

      <!-- ============ CURRENT ============ -->
      <template v-if="view === 'current'">
        <p v-if="loading" class="empty">Loading your residence…</p>

        <template v-else>
          <!-- Next payment banner -->
          <section
            v-if="nextPayment"
            class="payment-alert"
            :class="{ urgent: nextPayment.status === 'late' }"
          >
            <AppIcon
              :name="nextPayment.status === 'late' ? 'alert' : 'clock'"
            />
            <div>
              <strong>
                {{
                  nextPayment.status === "late"
                    ? "Payment overdue"
                    : "Next payment coming up"
                }}
              </strong>
              <p>
                {{
                  nextPayment.status === "late"
                    ? "Please contact your residence manager if you need more time."
                    : `Your next residence payment is due on ${formatDate(nextPayment.due_date)}.`
                }}
              </p>
            </div>
            <strong class="alert-amount">
              R{{ Number(nextPayment.amount).toFixed(2) }}
            </strong>
          </section>

          <!-- Current residence summary -->
          <section v-if="currentResidence" class="panel residence-summary">
            <div class="summary-head">
              <div class="residence-icon"><AppIcon name="building" /></div>
              <div>
                <p class="eyebrow">Current room</p>
                <h2>{{ currentResidence.name }}</h2>
                <p class="muted">{{ currentResidence.location }}</p>
              </div>
              <span class="status status-active">Active</span>
            </div>
            <div class="detail-grid">
              <div>
                <span>Monthly payment</span>
                <strong>
                  R{{ Number(currentResidence.monthly_price).toFixed(2) }}
                </strong>
              </div>
              <div>
                <span>Next due date</span>
                <strong>
                  {{ nextPayment ? formatDate(nextPayment.due_date) : "—" }}
                </strong>
              </div>
              <div>
                <span>Payment method</span>
                <strong>CampusSwap escrow</strong>
              </div>
            </div>
            <button
              v-if="nextPayment && nextPayment.status !== 'paid'"
              class="button button-primary"
              @click="payNow(nextPayment)"
            >
              Pay R{{ Number(nextPayment.amount).toFixed(2) }} now
            </button>
          </section>

          <p v-else class="empty">
            You don't have an active residence. Head to "Find a residence" to
            apply.
          </p>

          <!-- Payment history -->
          <section v-if="payments.length" class="panel">
            <div class="panel-heading">
              <div>
                <p class="eyebrow">Payment history</p>
                <h2>Recent payments</h2>
              </div>
            </div>
            <div class="payment-list">
              <div v-for="p in payments" :key="p.id" class="payment-row">
                <div>
                  <strong>{{ monthLabel(p.period_start) }}</strong>
                  <p>
                    {{
                      p.paid_at
                        ? `Paid ${formatDate(p.paid_at)}`
                        : `Due ${formatDate(p.due_date)}`
                    }}
                  </p>
                </div>
                <span :class="['status', `status-${p.status}`]">
                  {{ p.status }}
                </span>
                <strong>R{{ Number(p.amount).toFixed(2) }}</strong>
              </div>
            </div>
          </section>

          <!-- Requests -->
          <section v-if="requests.length" class="panel">
            <div class="panel-heading">
              <div>
                <p class="eyebrow">Residence requests</p>
                <h2>My requests</h2>
              </div>
              <span class="count">{{ requests.length }}</span>
            </div>
            <div class="request-list">
              <article v-for="r in requests" :key="r.id" class="request-row">
                <div>
                  <strong>{{ r.residence_name }}</strong>
                  <p>
                    {{ r.residence_location }} · Requested
                    {{ formatDate(r.requested_at) }}
                  </p>
                </div>
                <span :class="['status', `status-${r.status}`]">{{
                  r.status
                }}</span>
              </article>
            </div>
          </section>
        </template>
      </template>

      <!-- ============ FIND ============ -->
      <section v-else class="panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Available rooms</p>
            <h2>Find a residence</h2>
          </div>
          <span class="count">{{ residences.length }} options</span>
        </div>

        <p v-if="!residences.length" class="empty">
          No residences are available right now.
        </p>

        <div v-else class="residence-grid">
          <article v-for="r in residences" :key="r.id" class="residence-card">
            <div class="residence-icon"><AppIcon name="building" /></div>
            <div>
              <h3>{{ r.name }}</h3>
              <p>{{ r.location }}</p>
              <strong>{{ r.rooms_available }} rooms available</strong>
              <span class="price">
                From R{{ Number(r.monthly_price).toFixed(2) }} / month
              </span>
            </div>
            <button class="text-button" @click="requestRoom(r)">
              Request room
            </button>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import AppIcon from "../components/AppIcon.vue";
import { API_BASE } from "../services/api";

const view = ref("current");
const loading = ref(true);

const residences = ref([]);
const requests = ref([]);
const payments = ref([]);

const me = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
});

// Derive the current residence from the most recent approved request.
const currentResidence = computed(() => {
  const approved = requests.value.find((r) => r.status === "approved");
  if (!approved) return null;
  return {
    id: approved.residence_id,
    name: approved.residence_name,
    location: approved.residence_location,
    monthly_price: approved.monthly_price || 0,
  };
});

// Earliest unpaid payment (upcoming, pending, or late).
const nextPayment = computed(() => {
  const pending = payments.value
    .filter((p) => p.status !== "paid")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  return pending[0] || null;
});

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function monthLabel(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
  });
}

async function loadAll() {
  loading.value = true;
  const uid = me.value.id;
  try {
    const [resRes, reqRes, payRes] = await Promise.all([
      fetch(`${API_BASE}/residences`).then((r) => r.json()),
      uid
        ? fetch(`${API_BASE}/residence-requests?student_id=${uid}`).then((r) =>
            r.json(),
          )
        : Promise.resolve({ data: [] }),
      uid
        ? fetch(`${API_BASE}/residence-payments?student_id=${uid}`).then((r) =>
            r.json(),
          )
        : Promise.resolve({ data: [] }),
    ]);
    residences.value = resRes.data || [];
    requests.value = reqRes.data || [];
    payments.value = payRes.data || [];
  } catch (err) {
    console.error("[student-residence] load failed:", err);
  } finally {
    loading.value = false;
  }
}

async function requestRoom(residence) {
  const confirm = await Swal.fire({
    title: "Request this room?",
    text: `Send a residence request to ${residence.name}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Send request",
    confirmButtonColor: "#2e7d5a",
  });
  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${API_BASE}/residence-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        residence_id: residence.id,
        student_id: me.value.id,
      }),
    });
    if (!res.ok) throw new Error(`Failed (${res.status})`);
    await loadAll();
    view.value = "current";
    Swal.fire({
      icon: "success",
      title: "Request submitted",
      text: `Your request for ${residence.name} has been sent to the manager.`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({ icon: "error", title: "Could not submit", text: err.message });
  }
}

async function payNow(payment) {
  const confirm = await Swal.fire({
    title: "Pay this invoice?",
    text: `Pay R${Number(payment.amount).toFixed(2)} for ${monthLabel(payment.period_start)}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Pay now",
    confirmButtonColor: "#2e7d5a",
  });
  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(
      `${API_BASE}/residence-payments/${payment.id}/pay`,
      { method: "PATCH" },
    );
    if (!res.ok) throw new Error(`Failed (${res.status})`);
    await loadAll();
    Swal.fire({
      icon: "success",
      title: "Payment recorded",
      text: "Your residence payment is marked as paid.",
      timer: 1800,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({ icon: "error", title: "Payment failed", text: err.message });
  }
}

onMounted(loadAll);
</script>

<style scoped>
.residence-page {
  background: #0a0e27;
  min-height: 100vh;
  padding: 42px 24px 120px;
}
.residence-shell {
  margin: 0 auto;
  max-width: 1000px;
}
.page-heading {
  align-items: end;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}
.eyebrow {
  color: var(--gold, #e8b54d);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.page-heading h1 {
  color: #fff;
  font-size: clamp(2rem, 4vw, 3.2rem);
  margin: 6px 0;
}
.muted {
  color: #6b7280;
}
.button {
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font-weight: 700;
  padding: 12px 16px;
  white-space: nowrap;
  text-decoration: none;
  display: inline-block;
}
.button-primary {
  background: #f5b941;
  color: #0d1b3d;
}
.button-secondary {
  background: #fff;
  color: #0d1b3d;
}
.residence-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}
.residence-tabs button {
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #d1d5db;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 11px 14px;
}
.residence-tabs button.active {
  border-bottom-color: #f5b941;
  color: #f5b941;
}
.panel {
  background: #fff;
  border-radius: 16px;
  margin-bottom: 20px;
  padding: 22px;
}
.empty {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  color: #64748b;
  text-align: center;
}
.payment-alert {
  align-items: center;
  background: #fff5d8;
  border-radius: 16px;
  color: #7b5b00;
  display: flex;
  gap: 14px;
  margin-bottom: 20px;
  padding: 17px;
}
.payment-alert.urgent {
  background: #ffe9e6;
  color: #b33c31;
}
.payment-alert :deep(.app-icon) {
  font-size: 24px;
}
.payment-alert p {
  font-size: 13px;
  margin-top: 3px;
}
.alert-amount {
  margin-left: auto;
  white-space: nowrap;
}
.residence-summary {
  border-top: 4px solid #2e7d5a;
}
.summary-head {
  align-items: center;
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
}
.residence-icon {
  align-items: center;
  background: #e9f8ef;
  border-radius: 12px;
  color: #2e7d5a;
  display: flex;
  font-size: 28px;
  height: 54px;
  justify-content: center;
  width: 54px;
}
.summary-head h2 {
  color: #0d1b3d;
  margin: 2px 0;
}
.status {
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 9px;
  text-transform: capitalize;
}
.status-active,
.status-paid,
.status-approved {
  background: #e9f8ef;
  color: #2e7d5a;
}
.status-late,
.status-declined {
  background: #ffe9e6;
  color: #b33c31;
}
.status-upcoming,
.status-pending {
  background: #fff5d8;
  color: #a97700;
}
.status-cancelled {
  background: #f1f5f9;
  color: #64748b;
}
.summary-head .status {
  margin-left: auto;
}
.detail-grid {
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 18px;
  padding: 18px 0;
}
.detail-grid span {
  color: #6b7280;
  display: block;
  font-size: 11px;
  text-transform: uppercase;
}
.detail-grid strong {
  color: #0d1b3d;
  display: block;
  font-size: 14px;
  margin-top: 4px;
}
.panel-heading {
  align-items: start;
  border-bottom: 2px solid #6c4b6a;
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 10px;
}
.panel-heading h2 {
  color: #0d1b3d;
  font-size: 1.3rem;
  margin-top: 4px;
}
.count {
  background: #f1f5f9;
  border-radius: 999px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
}
.payment-list {
  display: grid;
}
.payment-row {
  align-items: center;
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 18px;
  padding: 13px 0;
}
.payment-row:last-child {
  border-bottom: 0;
}
.payment-row strong {
  color: #0d1b3d;
  font-size: 13px;
}
.payment-row p {
  color: #6b7280;
  font-size: 12px;
  margin-top: 3px;
}
.request-list {
  display: grid;
  gap: 10px;
}
.request-row {
  align-items: center;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 10px 0;
}
.request-row:last-child {
  border-bottom: 0;
}
.request-row strong {
  color: #0d1b3d;
  font-size: 13px;
}
.request-row p {
  color: #6b7280;
  font-size: 12px;
  margin-top: 3px;
}
.residence-grid {
  display: grid;
  gap: 12px;
}
.residence-card {
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  display: flex;
  gap: 14px;
  padding: 15px;
}
.residence-card h3 {
  color: #0d1b3d;
  font-size: 15px;
}
.residence-card strong,
.price {
  color: #2e7d5a;
  display: block;
  font-size: 12px;
  margin-top: 5px;
}
.price {
  color: #6b7280;
}
.residence-card .text-button {
  margin-left: auto;
}
.text-button {
  background: none;
  border: 0;
  color: #2e7d5a;
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
}
@media (max-width: 650px) {
  .residence-page {
    padding: 24px 14px 110px;
  }
  .page-heading {
    align-items: start;
    flex-direction: column;
  }
  .button {
    width: 100%;
    text-align: center;
  }
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .residence-card {
    flex-wrap: wrap;
  }
  .residence-card .text-button {
    margin-left: 68px;
  }
}
</style>
