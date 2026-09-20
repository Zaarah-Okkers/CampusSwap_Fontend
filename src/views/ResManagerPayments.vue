<template>
  <main class="res-page">
    <div class="res-shell">
      <header class="page-heading">
        <div><p class="eyebrow">SafeHome management</p><h1>Provider payments</h1><p class="muted">Approve completed SafeHome work and pay verified service providers.</p></div>
        <router-link class="button button-primary" to="/">Home</router-link>
      </header>

      <section class="summary-grid" aria-label="Residence summary">
        <article v-for="stat in summary" :key="stat.label" class="summary-card"><AppIcon :name="stat.icon" /><div><strong>{{ stat.value }}</strong><span>{{ stat.label }}</span></div></article>
      </section>

      <section class="panel provider-payment-panel">
        <div class="panel-heading"><div><p class="eyebrow">SafeHome</p><h2>Provider invoices awaiting payment</h2></div></div>
        <div class="outstanding-list"><article v-for="invoice in providerInvoices" :key="invoice.id" class="outstanding-row"><div><strong>{{ invoice.provider }}</strong><p>{{ invoice.job }} · {{ invoice.completed }}</p></div><span class="status status-upcoming">Ready to pay</span><strong>R{{ invoice.amount.toLocaleString() }}</strong><button class="text-button" @click="payProvider(invoice)">Pay provider</button></article></div>
      </section>

      <section class="panel">
        <div class="panel-heading"><div><p class="eyebrow">Payment monitoring</p><h2>Resident payments</h2></div><select v-model="paymentFilter" aria-label="Filter payments"><option value="all">All payments</option><option value="late">Late</option><option value="upcoming">Coming up</option><option value="paid">Paid</option></select></div>
        <div class="table-wrap"><table><thead><tr><th>Resident</th><th>Residence</th><th>Due date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody><tr v-for="payment in filteredPayments" :key="payment.id"><td>{{ payment.resident }}</td><td>{{ payment.residence }}</td><td>{{ payment.dueDate }}</td><td>R{{ payment.amount.toLocaleString() }}</td><td><span :class="['status', `status-${payment.status}`]">{{ statusLabel(payment.status) }}</span></td><td><button class="text-button" @click="notify(payment)">{{ payment.status === 'late' ? 'Notify' : 'View' }}</button></td></tr></tbody></table></div>
      </section>

      <section class="panel outstanding-panel"><div class="panel-heading"><div><p class="eyebrow">Action needed</p><h2>Residents who still need to pay</h2></div><strong class="outstanding-total">R{{ outstandingTotal.toLocaleString() }}</strong></div><div class="outstanding-list"><article v-for="payment in outstandingPayments" :key="payment.id" class="outstanding-row"><div><strong>{{ payment.resident }}</strong><p>{{ payment.residence }} · Due {{ payment.dueDate }}</p></div><span :class="['status', `status-${payment.status}`]">{{ statusLabel(payment.status) }}</span><strong>R{{ payment.amount.toLocaleString() }}</strong><button class="text-button" @click="notify(payment)">Notify resident</button></article></div></section>

      <section class="two-column">
        <article class="panel"><div class="panel-heading"><div><p class="eyebrow">Requests</p><h2>More time to pay</h2></div><span class="count">{{ extensionRequests.length }}</span></div><div class="request-list"><div v-for="request in extensionRequests" :key="request.id" class="request"><div><strong>{{ request.resident }}</strong><p>{{ request.residence }} · {{ request.reason }}</p></div><div class="request-actions"><button class="text-button" @click="resolveRequest(request, 'approved')">Approve</button><button class="text-button danger" @click="resolveRequest(request, 'declined')">Decline</button></div></div></div></article>
        <article class="panel"><div class="panel-heading"><div><p class="eyebrow">Resident actions</p><h2>Move-out follow-up</h2></div><span class="count">{{ moveOuts.length }}</span></div><div class="request-list"><div v-for="moveOut in moveOuts" :key="moveOut.id" class="request"><div><strong>{{ moveOut.resident }}</strong><p>{{ moveOut.residence }} · {{ moveOut.reason }}</p></div><button class="text-button danger" @click="sendNotice(moveOut)">{{ moveOut.refuses ? 'Alert authorities' : 'Send notice' }}</button></div></div></article>
      </section>

      <section class="panel"><div class="panel-heading"><div><p class="eyebrow">Room availability</p><h2>Available residences</h2></div><span class="count">{{ availableResidences.length }}</span></div><div class="residence-grid"><article v-for="residence in availableResidences" :key="residence.name" class="residence-card"><div><h3>{{ residence.name }}</h3><p>{{ residence.location }}</p></div><strong>{{ residence.rooms }} rooms</strong></article></div></section>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import AppIcon from '../components/AppIcon.vue'
import { confirmThenRun, swalTheme } from '../utils/swalTheme'
import { resolveResidentId } from '../utils/notifyUsers'

const store = useStore()

const paymentFilter = ref('all')
const payments = ref([
  { id: 1, resident: 'Lerato M.', residence: 'Room 204', dueDate: '18 Sep 2026', amount: 4200, status: 'late' },
  { id: 2, resident: 'Thabo N.', residence: 'Room 118', dueDate: '25 Sep 2026', amount: 4200, status: 'upcoming' },
  { id: 3, resident: 'Aisha K.', residence: 'Room 309', dueDate: '01 Sep 2026', amount: 4200, status: 'paid' },
  { id: 4, resident: 'Sipho D.', residence: 'Room 102', dueDate: '20 Sep 2026', amount: 3900, status: 'upcoming' }
])
const extensionRequests = ref([{ id: 1, resident: 'Mia D.', residence: 'Room 212', reason: 'Funding payment delayed' }, { id: 2, resident: 'Naledi S.', residence: 'Room 401', reason: 'Awaiting bursary confirmation' }])
const moveOuts = ref([{ id: 1, resident: 'Kabelo P.', residence: 'Room 106', reason: 'Notice issued', refuses: false }, { id: 2, resident: 'Jordan L.', residence: 'Room 220', reason: 'Refuses to leave after notice', refuses: true }])
const availableResidences = ref([{ name: 'Smuts Hall', location: 'Upper campus', rooms: 6 }, { name: 'Claremont House', location: 'Claremont', rooms: 3 }, { name: 'Mowbray Residence', location: 'Mowbray', rooms: 9 }])
const providerInvoices = ref([{ id: 1, provider: 'Cape Plumbing Co.', job: 'Leaking kitchen tap · Room 302', completed: 'Completed 18 Sep 2026', amount: 250 }, { id: 2, provider: 'Campus Electrical', job: 'Circuit-breaker repair · Room 114', completed: 'Completed 19 Sep 2026', amount: 180 }])
const filteredPayments = computed(() => paymentFilter.value === 'all' ? payments.value : payments.value.filter(payment => payment.status === paymentFilter.value))
const outstandingPayments = computed(() => payments.value.filter(payment => payment.status === 'late' || payment.status === 'upcoming'))
const outstandingTotal = computed(() => outstandingPayments.value.reduce((total, payment) => total + payment.amount, 0))
const summary = computed(() => [
  { label: 'Paid this month', value: payments.value.filter(payment => payment.status === 'paid').length, icon: 'check' },
  { label: 'Late payments', value: payments.value.filter(payment => payment.status === 'late').length, icon: 'alert' },
  { label: 'Payment requests', value: extensionRequests.value.length, icon: 'clock' },
  { label: 'Available rooms', value: availableResidences.value.reduce((total, residence) => total + residence.rooms, 0), icon: 'building' }
])
function statusLabel(status) { return status === 'upcoming' ? 'Coming up' : status.charAt(0).toUpperCase() + status.slice(1) }

async function payProvider(invoice) {
  const result = await swalTheme.fire({ title: 'Pay service provider?', text: `Pay ${invoice.provider} R${invoice.amount.toLocaleString()} for this completed job?`, icon: 'question', showCancelButton: true, confirmButtonText: 'Confirm payment' })
  if (!result.isConfirmed) return
  providerInvoices.value = providerInvoices.value.filter(item => item.id !== invoice.id)
  await swalTheme.fire({ title: 'Payment recorded', text: `${invoice.provider} will receive R${invoice.amount.toLocaleString()}.`, icon: 'success' })
}

async function notify(payment) {
  await confirmThenRun({
    confirmTitle: 'Send payment notice?',
    confirmText: `Send a payment reminder to ${payment.resident}?`,
    confirmButtonText: 'Send notice',
    successTitle: 'Payment notice sent',
    successText: `Payment notice prepared for ${payment.resident}.`,
    action: () => {
      store.dispatch('notifications/create', {
        userId: resolveResidentId(store, payment.resident),
        type: 'payment',
        title: 'Payment reminder',
        message: `Your residence payment of R${payment.amount.toLocaleString()} is due on ${payment.dueDate}.`,
        actionUrl: '/student-residence',
        metadata: { residence: payment.residence, amount: payment.amount, dueDate: payment.dueDate }
      })
    }
  })
}

function resolveRequest(request, decision) {
  extensionRequests.value = extensionRequests.value.filter(item => item.id !== request.id)
  swalTheme.fire({
    title: decision === 'approved' ? 'Extension approved' : 'Extension declined',
    text: `${decision === 'approved' ? 'Extension approved for' : 'Extension declined for'} ${request.resident}.`,
    icon: decision === 'approved' ? 'success' : 'info'
  })
}

async function sendNotice(moveOut) {
  if (moveOut.refuses) {
    await swalTheme.fire({
      title: 'Authorities alert prepared',
      text: `Authorities alert prepared for ${moveOut.resident}.`,
      icon: 'warning'
    })
    return
  }
  await confirmThenRun({
    confirmTitle: 'Send move-out notice?',
    confirmText: `Send a move-out notice to ${moveOut.resident}?`,
    confirmButtonText: 'Send notice',
    icon: 'warning',
    successTitle: 'Move-out notice sent',
    successText: `Move-out notice sent to ${moveOut.resident}.`,
    action: () => {
      store.dispatch('notifications/create', {
        userId: resolveResidentId(store, moveOut.resident),
        type: 'move_out',
        title: 'Move-out notice',
        message: 'You have received a move-out notice from your residence manager. Please review your move-out details and required next steps.',
        actionUrl: '/student-residence',
        metadata: { residence: moveOut.residence }
      })
    }
  })
}
</script>

<style scoped>
.res-page{background:#0a0e27;min-height:100vh;padding:42px 24px 120px}.res-shell{margin:0 auto;max-width:1180px}.page-heading{align-items:end;display:flex;justify-content:space-between;gap:20px;margin-bottom:28px}.eyebrow{color:var(--gold);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.page-heading h1{color:#fff;font-size:clamp(2rem,4vw,3.2rem);margin:6px 0}.muted{color:#6b7280}.button{border:0;border-radius:9px;cursor:pointer;font-weight:700;padding:12px 16px;white-space:nowrap}.button-primary{background:#f5b941;color:#0d1b3d}.summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}.summary-card{align-items:center;background:#fff;border-radius:16px;display:flex;gap:14px;padding:18px}.summary-card :deep(.app-icon){color:#2e7d5a;font-size:25px}.summary-card div{display:flex;flex-direction:column}.summary-card strong{color:#0d1b3d;font-family:'Fraunces',Georgia,serif;font-size:1.8rem}.summary-card span{color:#6b7280;font-size:12px}.panel{background:#fff;border-radius:16px;margin-bottom:20px;padding:20px}.panel-heading{align-items:start;border-bottom:2px solid #6c4b6a;display:flex;justify-content:space-between;gap:16px;margin-bottom:16px;padding-bottom:10px}.panel h2{color:#0d1b3d;font-size:1.3rem;margin-top:4px}.panel select{border:1px solid #e5e7eb;border-radius:7px;color:#0d1b3d;padding:8px}.table-wrap{overflow-x:auto}table{border-collapse:collapse;min-width:680px;width:100%}th,td{border-bottom:1px solid #eee;padding:12px 10px;text-align:left}th{color:#64748b;font-size:11px;text-transform:uppercase}td{color:#4b5563;font-size:13px}td:first-child{color:#0d1b3d;font-weight:700}.status{border-radius:999px;font-size:11px;font-weight:700;padding:5px 9px}.status-paid{background:#e9f8ef;color:#2e7d5a}.status-late{background:#ffe9e6;color:#d34c3d}.status-upcoming{background:#fff5d8;color:#a97700}.text-button{background:none;border:0;color:#2e7d5a;cursor:pointer;font-weight:700}.text-button.danger{color:#d34c3d}.two-column{display:grid;grid-template-columns:1fr 1fr;gap:20px}.count{background:#f0f2f5;border-radius:999px;color:#0d1b3d;font-size:12px;font-weight:700;padding:5px 9px}.request-list{display:grid;gap:12px}.request{align-items:center;border-bottom:1px solid #eee;display:flex;gap:12px;justify-content:space-between;padding:8px 0}.request:last-child{border-bottom:0}.request strong{color:#0d1b3d;font-size:13px}.request p,.residence-card p{color:#6b7280;font-size:12px;margin-top:3px}.request-actions{display:flex;gap:10px}.residence-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.residence-card{border:1px solid #e5e7eb;border-radius:10px;display:flex;justify-content:space-between;padding:14px}.residence-card h3{color:#0d1b3d;font-size:14px}.residence-card strong{color:#2e7d5a;font-size:13px;white-space:nowrap}@media(max-width:700px){.res-page{padding:24px 14px 110px}.page-heading{align-items:start;flex-direction:column}.button{width:100%;text-align:center}.summary-grid{grid-template-columns:repeat(2,1fr)}.two-column,.residence-grid{grid-template-columns:1fr}.panel{padding:16px}}
.page-heading .muted { color: #d1d5db; }
.outstanding-panel { border-top: 4px solid #d34c3d; }
.outstanding-total { color: #d34c3d; white-space: nowrap; }
.outstanding-list { display: grid; gap: 10px; }
.outstanding-row { align-items: center; border-bottom: 1px solid #eee; display: grid; gap: 14px; grid-template-columns: 1fr auto auto auto; padding: 12px 0; }
.outstanding-row:last-child { border-bottom: 0; }
.outstanding-row strong { color: #0d1b3d; font-size: 13px; }
.outstanding-row p { color: #6b7280; font-size: 12px; margin-top: 3px; }
@media (max-width: 700px) { .outstanding-row { align-items: start; grid-template-columns: 1fr auto; } .outstanding-row .text-button { grid-column: 1 / -1; text-align: left; } }
</style>
