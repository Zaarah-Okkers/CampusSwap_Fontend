<template>
  <main class="residence-page">
    <div class="residence-shell">
      <header class="page-heading"><div><p class="eyebrow">Student residence</p><h1>Your residence</h1><p class="muted">Find a room or stay on top of your current residence payments.</p></div><router-link class="button button-secondary" to="/student-dashboard">Dashboard</router-link></header>

      <nav class="residence-tabs" aria-label="Residence views"><button :class="{ active: view === 'current' }" @click="view = 'current'">My residence</button><button :class="{ active: view === 'find' }" @click="view = 'find'">Find a residence</button></nav>

      <template v-if="view === 'current'">
        <section class="payment-alert" :class="{ urgent: payment.status === 'late' }"><AppIcon :name="payment.status === 'late' ? 'alert' : 'clock'" /><div><strong>{{ payment.status === 'late' ? 'Payment overdue' : 'Next payment coming up' }}</strong><p>{{ payment.status === 'late' ? 'Please contact your residence manager if you need more time.' : `Your next residence payment is due on ${payment.dueDate}.` }}</p></div><strong class="alert-amount">R{{ payment.amount.toLocaleString() }}</strong></section>
        <section class="panel notifications-panel"><div class="panel-heading"><div><p class="eyebrow">Notifications</p><h2>Residence updates</h2></div><span class="count">{{ notifications.length }}</span></div><div class="notification-list"><article v-for="notification in notifications" :key="notification.id" class="notification"><AppIcon :name="notification.icon" /><div><strong>{{ notification.title }}</strong><p>{{ notification.message }}</p><small>{{ notification.date }}</small></div></article></div></section>
        <section class="panel residence-summary"><div class="summary-head"><div class="residence-icon"><AppIcon name="building" /></div><div><p class="eyebrow">Current room</p><h2>{{ currentResidence.name }}</h2><p class="muted">{{ currentResidence.room }} · {{ currentResidence.location }}</p></div><span class="status status-active">Active</span></div><div class="detail-grid"><div><span>Monthly payment</span><strong>R{{ payment.amount.toLocaleString() }}</strong></div><div><span>Next due date</span><strong>{{ payment.dueDate }}</strong></div><div><span>Payment method</span><strong>CampusSwap escrow</strong></div></div><button class="button button-primary" @click="showPaymentHelp = !showPaymentHelp">{{ showPaymentHelp ? 'Hide payment help' : 'Need more time to pay?' }}</button><div v-if="showPaymentHelp" class="payment-help"><p class="help-copy">Your residence manager will be notified that you need an extension. They will review your request and contact you.</p><button class="text-button" @click="requestExtension">Request extension</button></div></section>
        <section class="panel"><div class="panel-heading"><div><p class="eyebrow">Payment history</p><h2>Recent payments</h2></div></div><div class="payment-list"><div v-for="item in history" :key="item.id" class="payment-row"><div><strong>{{ item.period }}</strong><p>{{ item.paidOn }}</p></div><span class="status status-paid">Paid</span><strong>R{{ item.amount.toLocaleString() }}</strong></div></div></section>
        <section class="panel"><div class="panel-heading"><div><p class="eyebrow">Residence requests</p><h2>My requests</h2></div><span class="count">{{ requests.length }}</span></div><div class="request-list"><article v-for="request in requests" :key="request.id" class="request-row"><div><strong>{{ request.residence }}</strong><p>{{ request.location }} · Requested {{ request.date }}</p></div><span class="status status-review">{{ request.status }}</span></article></div></section>
      </template>

      <section v-else class="panel"><div class="panel-heading"><div><p class="eyebrow">Available rooms</p><h2>Find a residence</h2></div><span class="count">{{ availableResidences.length }} options</span></div><div class="residence-grid"><article v-for="residence in availableResidences" :key="residence.name" class="residence-card"><div class="residence-icon"><AppIcon name="building" /></div><div><h3>{{ residence.name }}</h3><p>{{ residence.location }}</p><strong>{{ residence.rooms }} rooms available</strong><span class="price">From R{{ residence.price.toLocaleString() }} / month</span></div><button class="text-button" @click="requestRoom(residence)">Request room</button></article></div></section>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import AppIcon from '../components/AppIcon.vue'
import { confirmThenRun } from '../utils/swalTheme'
import { RESMANAGER_USER_ID } from '../utils/notifyUsers'

const store = useStore()
const currentUser = computed(() => store.getters['user/currentUser'])

const view = ref('current')
const showPaymentHelp = ref(false)
const payment = { amount: 4200, dueDate: '25 September 2026', status: 'upcoming' }
const currentResidence = { name: 'Smuts Hall', room: 'Room 204', location: 'Upper campus' }
const history = [{ id: 1, period: 'August 2026', paidOn: 'Paid 01 Aug 2026', amount: 4200 }, { id: 2, period: 'July 2026', paidOn: 'Paid 01 Jul 2026', amount: 4200 }, { id: 3, period: 'June 2026', paidOn: 'Paid 02 Jun 2026', amount: 4200 }]
const notifications = [{ id: 1, icon: 'clock', title: 'Payment reminder', message: 'Your September residence payment is due on 25 September 2026.', date: 'Today' }, { id: 2, icon: 'building', title: 'Residence inspection', message: 'Smuts Hall inspections are scheduled for 28 September 2026.', date: 'Yesterday' }]
const requests = [{ id: 1, residence: 'Claremont House', location: 'Claremont', date: '12 Sep 2026', status: 'Under review' }]
const availableResidences = [{ name: 'Claremont House', location: 'Claremont', rooms: 3, price: 3900 }, { name: 'Mowbray Residence', location: 'Mowbray', rooms: 9, price: 3600 }, { name: 'Observatory Lodge', location: 'Observatory', rooms: 2, price: 4500 }]

async function requestRoom(residence) {
  await confirmThenRun({
    confirmTitle: 'Request this room?',
    confirmText: `Send a residence request to ${residence.name}?`,
    confirmButtonText: 'Send request',
    successTitle: 'Residence request started',
    successText: `Residence request started for ${residence.name}.`,
    action: () => {
      store.dispatch('notifications/create', {
        userId: currentUser.value?.id,
        type: 'residence_request',
        title: 'Residence request submitted',
        message: `Your request for ${residence.name} has been submitted and is awaiting review.`,
        actionUrl: '/student-residence',
        metadata: { residence: residence.name }
      })
      store.dispatch('notifications/create', {
        userId: RESMANAGER_USER_ID,
        type: 'residence_request',
        title: 'New residence request',
        message: `${currentUser.value?.name || 'A resident'} has submitted a new residence request for ${residence.name}.`,
        actionUrl: '/resmanager-payments',
        metadata: { residence: residence.name, resident: currentUser.value?.name }
      })
    }
  })
}

async function requestExtension() {
  await confirmThenRun({
    confirmTitle: 'Request more time to pay?',
    confirmText: 'Send a payment extension request to your residence manager?',
    confirmButtonText: 'Send request',
    successTitle: 'Extension request submitted',
    successText: 'Your residence manager has been notified.',
    action: () => {
      store.dispatch('notifications/create', {
        userId: currentUser.value?.id,
        type: 'extension',
        title: 'Extension request submitted',
        message: 'Your residence manager has been notified that you need an extension. They will review your request and contact you.',
        actionUrl: '/student-residence',
        metadata: { amount: payment.amount, dueDate: payment.dueDate }
      })
      store.dispatch('notifications/create', {
        userId: RESMANAGER_USER_ID,
        type: 'extension',
        title: 'Payment extension requested',
        message: `${currentUser.value?.name || 'A resident'} has requested an extension for their payment of R${payment.amount.toLocaleString()}.`,
        actionUrl: '/resmanager-payments',
        metadata: { amount: payment.amount, resident: currentUser.value?.name }
      })
    }
  })
  showPaymentHelp.value = false
}
</script>

<style scoped>
.residence-page{background:#0a0e27;min-height:100vh;padding:42px 24px 120px}.residence-shell{margin:0 auto;max-width:1000px}.page-heading{align-items:end;display:flex;justify-content:space-between;gap:20px;margin-bottom:28px}.eyebrow{color:var(--gold);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.page-heading h1{color:#fff;font-size:clamp(2rem,4vw,3.2rem);margin:6px 0}.muted{color:#6b7280}.button{border:0;border-radius:9px;cursor:pointer;font-weight:700;padding:12px 16px;white-space:nowrap}.button-primary{background:#f5b941;color:#0d1b3d}.button-secondary{background:#fff;color:#0d1b3d}.residence-tabs{display:flex;gap:8px;margin-bottom:18px}.residence-tabs button{background:transparent;border:0;border-bottom:2px solid transparent;color:#d1d5db;cursor:pointer;font:inherit;font-weight:700;padding:11px 14px}.residence-tabs button.active{border-bottom-color:#f5b941;color:#f5b941}.panel{background:#fff;border-radius:16px;margin-bottom:20px;padding:22px}.payment-alert{align-items:center;background:#fff5d8;border-radius:16px;color:#7b5b00;display:flex;gap:14px;margin-bottom:20px;padding:17px}.payment-alert.urgent{background:#ffe9e6;color:#b33c31}.payment-alert :deep(.app-icon){font-size:24px}.payment-alert p{font-size:13px;margin-top:3px}.alert-amount{margin-left:auto;white-space:nowrap}.residence-summary{border-top:4px solid #2e7d5a}.summary-head{align-items:center;display:flex;gap:14px;margin-bottom:24px}.residence-icon{align-items:center;background:#e9f8ef;border-radius:12px;color:#2e7d5a;display:flex;font-size:28px;height:54px;justify-content:center;width:54px}.summary-head h2{color:#0d1b3d;margin:2px 0}.status{border-radius:999px;font-size:11px;font-weight:700;margin-left:auto;padding:5px 9px}.status-active,.status-paid{background:#e9f8ef;color:#2e7d5a}.detail-grid{border-bottom:1px solid #eee;border-top:1px solid #eee;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px;padding:18px 0}.detail-grid span{color:#6b7280;display:block;font-size:11px;text-transform:uppercase}.detail-grid strong{color:#0d1b3d;display:block;font-size:14px;margin-top:4px}.help-copy{background:#f0f2f5;border-radius:8px;color:#4b5563;font-size:13px;margin-top:12px;padding:12px}.payment-help .text-button{margin-top:10px}.panel-heading{align-items:start;border-bottom:2px solid #6c4b6a;display:flex;justify-content:space-between;margin-bottom:14px;padding-bottom:10px}.panel-heading h2{color:#0d1b3d;font-size:1.3rem;margin-top:4px}.count{color:#6b7280;font-size:12px}.payment-list{display:grid}.payment-row{align-items:center;border-bottom:1px solid #eee;display:grid;grid-template-columns:1fr auto auto;gap:18px;padding:13px 0}.payment-row:last-child{border-bottom:0}.payment-row strong{color:#0d1b3d;font-size:13px}.payment-row p,.residence-card p{color:#6b7280;font-size:12px;margin-top:3px}.residence-grid{display:grid;gap:12px}.residence-card{align-items:center;border:1px solid #e5e7eb;border-radius:10px;display:flex;gap:14px;padding:15px}.residence-card h3{color:#0d1b3d;font-size:15px}.residence-card strong,.price{color:#2e7d5a;display:block;font-size:12px;margin-top:5px}.price{color:#6b7280}.residence-card .text-button{margin-left:auto}.text-button{background:none;border:0;color:#2e7d5a;cursor:pointer;font-weight:700;white-space:nowrap}@media(max-width:650px){.residence-page{padding:24px 14px 110px}.page-heading{align-items:start;flex-direction:column}.button{width:100%;text-align:center}.payment-alert{align-items:start;flex-wrap:wrap}.alert-amount{margin-left:38px}.detail-grid{grid-template-columns:1fr}.payment-row{gap:8px;grid-template-columns:1fr auto}.payment-row>strong:last-child{grid-column:2;grid-row:1}.residence-card{align-items:start;flex-wrap:wrap}.residence-card .text-button{margin-left:68px}}
.notifications-panel :deep(.app-icon) { color: #2e7d5a; font-size: 20px; }
.notification-list, .request-list { display: grid; gap: 10px; }
.notification, .request-row { align-items: center; border-bottom: 1px solid #eee; display: flex; gap: 12px; padding: 10px 0; }
.notification:last-child, .request-row:last-child { border-bottom: 0; }
.notification strong, .request-row strong { color: #0d1b3d; font-size: 13px; }
.notification p, .notification small, .request-row p { color: #6b7280; display: block; font-size: 12px; margin-top: 3px; }
.request-row .status { margin-left: auto; }
.status-review { background: #fff5d8; color: #a97700; }
.page-heading .muted { color: #d1d5db; }
</style>