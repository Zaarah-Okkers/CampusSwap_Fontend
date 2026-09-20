<template>
  <main class="profile-page">
    <section class="profile-container">
      <div class="greeting"><div><h1>Hi, {{ user.full_name || user.name || config.title }}</h1><p>{{ config.workspace }}</p></div><span>{{ today }}</span></div>

      <article class="card profile-overview">
        <div class="profile-head"><div class="avatar">{{ initials }}</div><div><h2>{{ user.full_name || user.name || config.title }}</h2><p>{{ user.email || config.email }}</p><div class="badges"><span>{{ config.verified }}</span><span>{{ config.locationLabel }}: {{ location }}</span></div></div></div>
        <div class="details"><div><span>{{ config.idLabel }}</span><strong>{{ config.id }}</strong></div><div><span>{{ config.locationLabel }}</span><strong>{{ location }}</strong></div><div><span>Status</span><strong class="active">● Active member</strong></div><div><span>Member since</span><strong>September 2026</strong></div></div>
      </article>

      <article class="card"><h2>Activity Overview</h2><div class="stats"><div v-for="stat in config.stats" :key="stat.label"><span>{{ stat.label }}</span><strong>{{ stat.value }}</strong></div></div></article>

      <article class="card"><h2>{{ config.actionsTitle }}</h2><div class="actions"><router-link v-for="action in config.actions" :key="action.label" :to="action.to"><strong>{{ action.label }}</strong><span>{{ action.description }} →</span></router-link></div></article>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const user = computed(() => store.getters['user/currentUser'] || {})
const role = computed(() => route.meta.profileRole || user.value.role)
const profiles = {
  student: { title: 'Student Dashboard', workspace: 'Student workspace', email: 'student@campusswap.co.za', verified: 'Verified student', locationLabel: 'Institution', idLabel: 'Student ID', id: 'STU-2026-001', stats: [{ label: 'My listings', value: '0' }, { label: 'My orders', value: '0' }, { label: 'SafeHome requests', value: '0' }], actionsTitle: 'Student tools', actions: [{ label: 'Marketplace', description: 'Browse campus listings', to: '/marketplace' }, { label: 'SafeHome', description: 'Request or track repairs', to: '/safehome' }] },
  service_provider: { title: 'Service Provider', workspace: 'Service provider workspace', email: 'provider@work.co.za', verified: 'Verified provider', locationLabel: 'Service area', idLabel: 'Provider ID', id: 'PRO-2026-001', stats: [{ label: 'Jobs completed', value: '12' }, { label: 'Active jobs', value: '3' }, { label: 'Average rating', value: '4.8' }], actionsTitle: 'Provider tools', actions: [{ label: 'Available SafeHome jobs', description: 'Browse new SafeHome work', to: '/provider-jobs/available' }, { label: 'My jobs', description: 'Track assigned work', to: '/provider-jobs' }] },
  res_manager: { title: 'Residence Manager', workspace: 'Residence management workspace', email: 'resmanager@campusswap.co.za', verified: 'Verified manager', locationLabel: 'Residence', idLabel: 'Manager ID', id: 'RES-2026-001', stats: [{ label: 'Open requests', value: '4' }, { label: 'Completed repairs', value: '18' }, { label: 'Provider invoices', value: '2' }], actionsTitle: 'Management tools', actions: [{ label: 'Provider payments', description: 'Approve and pay completed SafeHome work', to: '/resmanager-payments' }, { label: 'SafeHome requests', description: 'Review current repair work', to: '/safehome' }] },
  admin: { title: 'Administrator', workspace: 'CampusSwap administration workspace', email: 'admin@campusswap.co.za', verified: 'Verified administrator', locationLabel: 'Organisation', idLabel: 'Admin ID', id: 'ADM-2026-001', stats: [{ label: 'Platform users', value: '9' }, { label: 'Active listings', value: '12' }, { label: 'Open reports', value: '0' }], actionsTitle: 'Administration tools', actions: [{ label: 'Manage users', description: 'Review platform accounts', to: '/admin/users' }, { label: 'Premium accounts', description: 'Manage premium access', to: '/admin/premium' }] }
}
const config = computed(() => profiles[role.value] || profiles.student)
const initials = computed(() => (user.value.full_name || user.value.name || config.value.title).split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase())
const location = computed(() => user.value.university || (role.value === 'res_manager' ? 'Smuts Hall Residence' : role.value === 'admin' ? 'CampusSwap SA' : 'Cape Town'))
const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long', month: 'long', day: 'numeric' })
</script>

<style scoped>
.profile-page{background:#0a0e27;min-height:100vh;padding:34px 20px 120px}.profile-container{margin:auto;max-width:900px}.greeting{align-items:start;color:#fff;display:flex;justify-content:space-between;margin-bottom:24px}.greeting h1{font-size:28px;margin:0 0 6px}.greeting p,.greeting>span{color:#d1d5db;margin:0}.greeting>span{font-size:13px}.card{background:#fff;border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,.08);margin-bottom:18px;padding:22px}.card h2{color:#0d1b3d;font-size:18px;margin:0 0 18px;padding-bottom:10px;border-bottom:2px solid #6c4b6a}.profile-head{align-items:center;display:flex;gap:16px;margin-bottom:22px}.avatar{align-items:center;background:#f5b941;border-radius:50%;color:#0d1b3d;display:flex;font-size:24px;font-weight:800;height:72px;justify-content:center;width:72px}.profile-head h2{border:0;margin:0;padding:0}.profile-head p{color:#64748b;margin:5px 0 9px}.badges{display:flex;flex-wrap:wrap;gap:8px}.badges span{background:#ecfdf5;border-radius:999px;color:#166534;font-size:12px;font-weight:700;padding:5px 9px}.details,.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.details>div,.stats>div{background:#f8fafc;border-radius:10px;padding:13px}.details span,.stats span{color:#64748b;display:block;font-size:11px;text-transform:uppercase}.details strong,.stats strong{color:#0d1b3d;display:block;font-size:14px;margin-top:6px}.details .active{color:#2e7d5a}.stats strong{color:#2e7d5a;font-size:24px}.actions{display:grid;gap:10px}.actions a{align-items:center;border:1px solid #e5e7eb;border-radius:10px;color:#0d1b3d;display:flex;justify-content:space-between;padding:14px;text-decoration:none}.actions a:hover{border-color:#f5b941}.actions span{color:#64748b;font-size:13px}@media(max-width:650px){.profile-page{padding:24px 14px 110px}.greeting{gap:12px;flex-direction:column}.details,.stats{grid-template-columns:repeat(2,1fr)}.profile-head{align-items:flex-start}.actions a{align-items:flex-start;flex-direction:column;gap:6px}}
</style>
