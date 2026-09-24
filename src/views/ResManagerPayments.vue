<template>
  <main class="res-page">
    <div class="res-shell">
      <header class="page-heading">
        <div>
          <p class="eyebrow">SafeHome management</p>
          <h1>Provider payments</h1>
          <p class="muted">
            Approve completed SafeHome work, monitor residence payments, and
            manage resident requests.
          </p>
        </div>
        <router-link class="button button-primary" to="/">Home</router-link>
      </header>

      <!-- Summary cards -->
      <section class="summary-grid">
        <article v-for="stat in summary" :key="stat.label" class="summary-card">
          <AppIcon :name="stat.icon" />
          <div>
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </article>
      </section>

      <!-- Provider invoices waiting for release -->
      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">SafeHome</p>
            <h2>Provider invoices awaiting payment</h2>
          </div>
          <span class="count">{{ providerInvoices.length }}</span>
        </div>
        <p v-if="!providerInvoices.length" class="empty">
          No completed jobs are waiting for release.
        </p>
        <div v-else class="outstanding-list">
          <article
            v-for="invoice in providerInvoices"
            :key="invoice.id"
            class="outstanding-row"
          >
            <div>
              <strong>{{ invoice.provider_name || "Provider" }}</strong>
              <p>{{ invoice.title }} · {{ invoice.residence_name }}</p>
            </div>
            <span class="status status-upcoming">Ready to pay</span>
            <strong>R{{ Number(invoice.estimated_cost).toFixed(2) }}</strong>
            <button class="text-button" @click="payProvider(invoice)">
              Pay provider
            </button>
          </article>
        </div>
      </section>

      <!-- Resident payments -->
      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Payment monitoring</p>
            <h2>Resident payments</h2>
          </div>
          <select v-model="paymentFilter" aria-label="Filter payments">
            <option value="all">All payments</option>
            <option value="late">Late</option>
            <option value="upcoming">Coming up</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <p v-if="!filteredPayments.length" class="empty">
          No resident payments match this filter.
        </p>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Resident</th>
                <th>Residence</th>
                <th>Due date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in filteredPayments" :key="p.id">
                <td>{{ p.student_name }}</td>
                <td>{{ p.residence_name }}</td>
                <td>{{ formatDate(p.due_date) }}</td>
                <td>R{{ Number(p.amount).toFixed(2) }}</td>
                <td>
                  <span :class="['status', `status-${p.status}`]">
                    {{ statusLabel(p.status) }}
                  </span>
                </td>
                <td>
                  <button class="text-button" @click="notifyResident(p)">
                    {{ p.status === "late" ? "Notify" : "View" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Outstanding total -->
      <section
        v-if="outstandingPayments.length"
        class="panel outstanding-panel"
      >
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Action needed</p>
            <h2>Residents who still need to pay</h2>
          </div>
          <strong class="outstanding-total">
            R{{ outstandingTotal.toFixed(2) }}
          </strong>
        </div>
        <div class="outstanding-list">
          <article
            v-for="p in outstandingPayments"
            :key="p.id"
            class="outstanding-row"
          >
            <div>
              <strong>{{ p.student_name }}</strong>
              <p>{{ p.residence_name }} · Due {{ formatDate(p.due_date) }}</p>
            </div>
            <span :class="['status', `status-${p.status}`]">
              {{ statusLabel(p.status) }}
            </span>
            <strong>R{{ Number(p.amount).toFixed(2) }}</strong>
            <button class="text-button" @click="notifyResident(p)">
              Notify resident
            </button>
          </article>
        </div>
      </section>

      <!-- Residence requests -->
      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Requests</p>
            <h2>Residence applications</h2>
          </div>
          <span class="count">{{ pendingRequests.length }}</span>
        </div>

        <p v-if="!pendingRequests.length" class="empty">
          No pending residence requests.
        </p>
        <div v-else class="request-list">
          <article
            v-for="request in pendingRequests"
            :key="request.id"
            class="request-row"
          >
            <div>
              <strong>{{ request.student_name }}</strong>
              <p>
                {{ request.residence_name }} · Requested
                {{ formatDate(request.requested_at) }}
              </p>
            </div>
            <div class="request-actions">
              <button
                class="text-button"
                @click="resolveRequest(request, 'approved')"
              >
                Approve
              </button>
              <button
                class="text-button danger"
                @click="resolveRequest(request, 'declined')"
              >
                Decline
              </button>
            </div>
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

const paymentFilter = ref("all");
const loading = ref(true);

const payments = ref([]);
const requests = ref([]);
const completedServices = ref([]);

const me = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
});

const providerInvoices = computed(() =>
  completedServices.value.filter(
    (s) => s.estimated_cost && Number(s.estimated_cost) > 0,
  ),
);

const filteredPayments = computed(() => {
  if (paymentFilter.value === "all") return payments.value;
  return payments.value.filter((p) => p.status === paymentFilter.value);
});

const outstandingPayments = computed(() =>
  payments.value.filter((p) => p.status === "late" || p.status === "upcoming"),
);

const outstandingTotal = computed(() =>
  outstandingPayments.value.reduce((sum, p) => sum + Number(p.amount), 0),
);

const pendingRequests = computed(() =>
  requests.value.filter((r) => r.status === "pending"),
);

const summary = computed(() => [
  {
    label: "Paid this month",
    value: payments.value.filter((p) => p.status === "paid").length,
    icon: "check",
  },
  {
    label: "Late payments",
    value: payments.value.filter((p) => p.status === "late").length,
    icon: "alert",
  },
  {
    label: "Pending requests",
    value: pendingRequests.value.length,
    icon: "clock",
  },
  {
    label: "Awaiting invoices",
    value: providerInvoices.value.length,
    icon: "tools",
  },
]);

function statusLabel(status) {
  return status === "upcoming"
    ? "Coming up"
    : status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function loadAll() {
  loading.value = true;
  const managerId = me.value.id;
  try {
    const [paymentsRes, requestsRes, servicesRes] = await Promise.all([
      fetch(`${API_BASE}/residence-payments?manager_id=${managerId}`).then(
        (r) => r.json(),
      ),
      fetch(`${API_BASE}/residence-requests?manager_id=${managerId}`).then(
        (r) => r.json(),
      ),
      // Completed services with a real cost are the invoices awaiting payout.
      fetch(`${API_BASE}/services?status=completed`).then((r) => r.json()),
    ]);
    payments.value = paymentsRes.data || [];
    requests.value = requestsRes.data || [];
    completedServices.value = (servicesRes.data || []).filter(
      (s) => s.estimated_cost && Number(s.estimated_cost) > 0,
    );
  } catch (err) {
    console.error("[resmanager-payments] load failed:", err);
  } finally {
    loading.value = false;
  }
}

async function payProvider(invoice) {
  const confirm = await Swal.fire({
    title: "Pay service provider?",
    html: `<p>Pay <strong>${invoice.provider_name || "the provider"}</strong> R${Number(invoice.estimated_cost).toFixed(2)} for "${invoice.title}"?</p>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Confirm payment",
    confirmButtonColor: "#2e7d5a",
  });
  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${API_BASE}/services/${invoice.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (!res.ok) throw new Error(`Failed (${res.status})`);
    await loadAll();
    Swal.fire({
      icon: "success",
      title: "Payment recorded",
      text: `${invoice.provider_name || "The provider"} will receive R${Number(invoice.estimated_cost).toFixed(2)}.`,
    });
  } catch (err) {
    Swal.fire({ icon: "error", title: "Payment failed", text: err.message });
  }
}

async function resolveRequest(request, decision) {
  const confirm = await Swal.fire({
    title: decision === "approved" ? "Approve request?" : "Decline request?",
    text: `${decision === "approved" ? "Approve" : "Decline"} ${request.student_name}'s request for ${request.residence_name}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: decision === "approved" ? "Approve" : "Decline",
    confirmButtonColor: decision === "approved" ? "#2e7d5a" : "#d33",
  });
  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${API_BASE}/residence-requests/${request.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: decision }),
    });
    if (!res.ok) throw new Error(`Failed (${res.status})`);
    await loadAll();
    Swal.fire({
      icon: "success",
      title: decision === "approved" ? "Approved" : "Declined",
      text: `${request.student_name}'s request has been ${decision}.`,
      timer: 1800,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({ icon: "error", title: "Could not save", text: err.message });
  }
}

async function notifyResident(payment) {
  try {
    await fetch(`${API_BASE}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: payment.student_id,
        type: "payment",
        title:
          payment.status === "late" ? "Payment overdue" : "Payment reminder",
        message: `Your residence payment of R${Number(payment.amount).toFixed(2)} for ${payment.residence_name} is due ${formatDate(payment.due_date)}.`,
        action_url: "/student-residence",
      }),
    });
    Swal.fire({
      icon: "success",
      title: "Notification sent",
      text: `${payment.student_name} has been notified.`,
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({ icon: "error", title: "Could not send", text: err.message });
  }
}

onMounted(loadAll);
</script>

<style scoped>
/* ---------- Page shell ---------- */
.res-page {
  background: #0a0e27;
  min-height: 100vh;
  padding: 42px 24px 120px;
}
.res-shell {
  margin: 0 auto;
  max-width: 1180px;
}

.page-heading {
  align-items: end;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.eyebrow {
  color: #f5b941;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 6px;
}
.page-heading h1 {
  color: #ffffff;
  font-size: clamp(2rem, 4vw, 3.2rem);
  margin: 6px 0;
}
.page-heading .muted {
  color: #e2e8f0;
  font-size: 14px;
  margin: 0;
}

.button {
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font-weight: 700;
  padding: 12px 20px;
  text-decoration: none;
  display: inline-block;
  white-space: nowrap;
}
.button-primary {
  background: #f5b941;
  color: #0d1b3d;
}

/* ---------- Summary cards ---------- */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
.summary-card {
  align-items: center;
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  gap: 14px;
  padding: 18px;
}
.summary-card :deep(.app-icon) {
  color: #2e7d5a;
  font-size: 26px;
  flex: 0 0 auto;
}
.summary-card div {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.summary-card strong {
  color: #0d1b3d;
  font-family: "Fraunces", Georgia, serif;
  font-size: 1.9rem;
  line-height: 1.1;
}
.summary-card span {
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  margin-top: 2px;
}

/* ---------- Panels ---------- */
.panel {
  background: #ffffff;
  border-radius: 16px;
  margin-bottom: 20px;
  padding: 22px;
}
.panel-heading {
  align-items: flex-start;
  border-bottom: 2px solid #6c4b6a;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  flex-wrap: wrap;
}
.panel h2 {
  color: #0d1b3d;
  font-size: 1.3rem;
  margin: 0;
}
.panel select {
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  color: #0d1b3d;
  padding: 8px 12px;
  font-weight: 600;
  background: #ffffff;
  cursor: pointer;
}
.count {
  background: #f1f5f9;
  border-radius: 999px;
  color: #0d1b3d;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
}

/* ---------- Tables ---------- */
.table-wrap {
  overflow-x: auto;
}
table {
  border-collapse: collapse;
  min-width: 680px;
  width: 100%;
}
th,
td {
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 10px;
  text-align: left;
}
th {
  color: #475569;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
td {
  color: #1e293b;
  font-size: 13px;
}
td:first-child {
  color: #0d1b3d;
  font-weight: 700;
}

/* ---------- Status pills ---------- */
.status {
  border-radius: 999px;
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 11px;
  text-transform: capitalize;
}
.status-paid,
.status-approved {
  background: #d1fae5;
  color: #065f46;
}
.status-late,
.status-declined {
  background: #fee2e2;
  color: #991b1b;
}
.status-upcoming,
.status-pending {
  background: #fef3c7;
  color: #92400e;
}
.status-cancelled {
  background: #e2e8f0;
  color: #334155;
}

/* ---------- Text buttons ---------- */
.text-button {
  background: none;
  border: 0;
  color: #047857;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  padding: 0;
}
.text-button:hover {
  text-decoration: underline;
}
.text-button.danger {
  color: #b91c1c;
}

/* ---------- Outstanding block ---------- */
.outstanding-panel {
  border-top: 4px solid #d34c3d;
}
.outstanding-total {
  color: #b91c1c;
  font-size: 1.15rem;
  white-space: nowrap;
}
.outstanding-list {
  display: grid;
  gap: 10px;
}
.outstanding-row {
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr auto auto auto;
  padding: 12px 0;
}
.outstanding-row:last-child {
  border-bottom: 0;
}
.outstanding-row strong {
  color: #0d1b3d;
  font-size: 13px;
  font-weight: 700;
}
.outstanding-row p {
  color: #475569;
  font-size: 12px;
  margin: 3px 0 0;
}

/* ---------- Residence requests list ---------- */
.request-list {
  display: grid;
  gap: 10px;
}
.request-row {
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 12px 0;
  flex-wrap: wrap;
}
.request-row:last-child {
  border-bottom: 0;
}
.request-row strong {
  color: #0d1b3d;
  font-size: 14px;
  font-weight: 700;
}
.request-row p {
  color: #475569;
  font-size: 12.5px;
  margin: 3px 0 0;
}
.request-actions {
  display: flex;
  gap: 14px;
}

/* ---------- Empty states ---------- */
.empty {
  color: #475569;
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
  margin: 0;
}

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 700px) {
  .res-page {
    padding: 24px 14px 110px;
  }
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .button {
    width: 100%;
    text-align: center;
  }
  .outstanding-row {
    align-items: start;
    grid-template-columns: 1fr auto;
  }
  .outstanding-row .text-button {
    grid-column: 1 / -1;
    text-align: left;
  }
  .panel {
    padding: 16px;
  }
}
</style>
