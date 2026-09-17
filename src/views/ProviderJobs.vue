<template>
  <main class="provider-page"><div class="provider-shell">
    <header class="page-heading"><div><p class="eyebrow">Service provider workspace</p><h1>My jobs</h1><p class="muted">Track accepted work from the next booking through completion.</p></div><router-link class="button button-primary" to="/provider-jobs/available">Find more work</router-link></header>
    <ProviderNav />
    <div class="tabs" role="tablist"><button v-for="tab in tabs" :key="tab.key" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">{{ tab.label }} <span>{{ groupedJobs[tab.key].length }}</span></button></div>
    <section class="job-list"><article v-for="job in groupedJobs[activeTab]" :key="job.id" class="job-card glass-panel"><div class="job-card-head"><div><p class="eyebrow">{{ job.title }}</p><h2>{{ job.client }}</h2></div><span :class="['status', `status-${job.status}`]">{{ statusLabel(job.status) }}</span></div><p class="job-description">{{ job.description }}</p><dl class="job-details"><div><dt>Date</dt><dd>{{ formatDate(job.date) }}</dd></div><div><dt>Time</dt><dd>{{ job.time }}</dd></div><div><dt>Location</dt><dd>{{ job.location }}</dd></div><div><dt>Duration</dt><dd>{{ job.duration }}</dd></div><div><dt>Pay</dt><dd class="pay">R{{ job.pay.toLocaleString() }}</dd></div></dl></article><p v-if="!groupedJobs[activeTab].length" class="empty-state glass-panel">There are no {{ activeTab }} jobs yet.</p></section>
  </div></main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ProviderNav from '../components/ProviderNav.vue'

const store = useStore()
const route = useRoute()
const activeTab = ref(route.query.tab === 'completed' ? 'completed' : 'scheduled')
const tabs = [{ key: 'completed', label: 'Completed' }, { key: 'scheduled', label: 'Scheduled' }, { key: 'upcoming', label: 'Upcoming' }]
const groupedJobs = computed(() => ({ completed: store.getters['provider/completedJobs'], scheduled: store.getters['provider/scheduledJobs'], upcoming: store.getters['provider/upcomingJobs'] }))
function formatDate(date) { return new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) }
function statusLabel(status) { return status.charAt(0).toUpperCase() + status.slice(1) }
</script>

<style scoped>
.provider-page{min-height:100vh;padding:42px 24px 120px}.provider-shell{width:min(1100px,100%);margin:0 auto}.page-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:30px}h1{font-size:clamp(2rem,4vw,3.2rem);margin:6px 0}.eyebrow{color:var(--gold);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.muted,dt{color:var(--text-muted)}.button{background:var(--gold);border:0;border-radius:9px;color:var(--ink);cursor:pointer;font-weight:700;padding:12px 16px;white-space:nowrap}.tabs{display:flex;gap:8px;border-bottom:1px solid var(--glass-border);margin-bottom:20px;overflow-x:auto}.tabs button{background:transparent;border:0;border-bottom:2px solid transparent;color:var(--text-muted);cursor:pointer;font:inherit;font-weight:700;padding:12px 14px;white-space:nowrap}.tabs button.active{border-bottom-color:var(--gold);color:var(--gold)}.tabs span{background:var(--glass-strong);border-radius:10px;font-size:11px;margin-left:5px;padding:2px 6px}.job-list{display:grid;gap:16px}.job-card{padding:22px}.job-card-head{align-items:start;display:flex;justify-content:space-between;gap:20px}.job-card h2{font-size:1.35rem;margin-top:4px}.job-description{color:var(--text-muted);margin:14px 0 18px}.job-details{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.job-details dd{color:var(--text);font-size:13px;margin-top:3px}.pay{color:var(--mint);font-weight:700}.status{border-radius:999px;font-size:12px;font-weight:700;padding:5px 10px}.status-completed{background:var(--mint-soft);color:var(--mint)}.status-scheduled{background:var(--gold-soft);color:var(--gold)}.status-upcoming{background:rgba(111,168,255,.16);color:var(--sky)}.empty-state{color:var(--text-muted);padding:24px;text-align:center}@media(max-width:700px){.provider-page{padding:24px 14px 110px}.page-heading{align-items:start;flex-direction:column}.job-card-head{flex-direction:column}.job-details{grid-template-columns:repeat(2,1fr)}.button{width:100%;text-align:center}}
.provider-page { background: #0a0e27; color: #333; }
.page-heading h1 { color: #fff; }
.job-card, .empty-state { background: #fff; border: 0; border-radius: 16px; }
.job-card h2 { color: #0d1b3d; }
.job-description, .muted { color: #6b7280; }
.job-details dd { color: #0d1b3d; }
.tabs { border-bottom-color: rgba(255, 255, 255, .2); }
.tabs button { color: #d1d5db; }
.button { background: #f5b941; color: #0d1b3d; }
.page-heading .muted { color: #d1d5db; }
</style>
