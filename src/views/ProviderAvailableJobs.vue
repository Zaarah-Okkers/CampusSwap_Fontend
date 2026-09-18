<template>
  <main class="provider-page"><div class="provider-shell">
    <header class="page-heading"><div><p class="eyebrow">Service provider workspace</p><h1>Available jobs</h1><p class="muted">Browse work that matches your skills, schedule, and location.</p></div><router-link class="text-link" to="/provider-jobs">View my jobs</router-link></header>
    <ProviderNav />
    <div class="toolbar glass-panel"><label class="search-field"><span>Search jobs</span><input v-model="search" type="search" placeholder="Search by service, client, or location" /></label><label class="select-field"><span>Sort by</span><select v-model="sortBy"><option value="date">Soonest date</option><option value="pay">Highest pay</option></select></label></div>
    <section class="job-list" aria-label="Available jobs">
      <article v-for="job in filteredJobs" :key="job.id" class="job-card glass-panel">
        <div class="job-card-head"><div><p class="eyebrow">{{ job.title }}</p><h2>{{ job.client }}</h2></div><strong class="pay">R{{ job.pay.toLocaleString() }}</strong></div>
        <p class="job-description">{{ job.description }}</p>
        <dl class="job-details"><div><dt>Date</dt><dd>{{ formatDate(job.date) }}</dd></div><div><dt>Time</dt><dd>{{ job.time }}</dd></div><div><dt>Location</dt><dd>{{ job.location }}</dd></div><div><dt>Duration</dt><dd>{{ job.duration }}</dd></div><div><dt>Requirements</dt><dd>{{ job.requirements }}</dd></div></dl>
        <button class="button button-primary" @click="accept(job)">Accept job</button>
      </article>
      <p v-if="!filteredJobs.length" class="empty-state glass-panel">No available jobs match your search.</p>
    </section>
  </div></main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import ProviderNav from '../components/ProviderNav.vue'

const store = useStore()
const search = ref('')
const sortBy = ref('date')
const jobs = computed(() => store.getters['provider/availableJobs'])
const filteredJobs = computed(() => {
  const query = search.value.toLowerCase().trim()
  return [...jobs.value].filter(job => !query || [job.title, job.client, job.location, job.description].some(value => value.toLowerCase().includes(query))).sort((a, b) => sortBy.value === 'pay' ? b.pay - a.pay : a.date.localeCompare(b.date))
})

async function accept(job) {
  await store.dispatch('provider/acceptJob', job.id)
}
function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.provider-page { min-height: 100vh; padding: 42px 24px 120px; }.provider-shell { width: min(1100px, 100%); margin: 0 auto; }.page-heading { display:flex; align-items:end; justify-content:space-between; gap:20px; margin-bottom:30px; }h1 { font-size: clamp(2rem, 4vw, 3.2rem); margin:6px 0; }.eyebrow { color:var(--gold); font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; }.muted, dt { color:var(--text-muted); }.text-link { color:var(--gold); font-weight:700; white-space:nowrap; }.toolbar { display:flex; gap:16px; padding:16px; margin-bottom:20px; }.search-field { flex:1; }.search-field span, .select-field span { display:block; color:var(--text-faint); font-size:11px; margin-bottom:5px; text-transform:uppercase; }.search-field input, .select-field select { background:var(--glass-strong); border:1px solid var(--glass-border); border-radius:8px; color:var(--text); padding:10px 12px; width:100%; }.select-field { width:190px; }.job-list { display:grid; gap:16px; }.job-card { padding:22px; }.job-card-head { display:flex; justify-content:space-between; gap:20px; }.job-card h2 { font-size:1.35rem; margin-top:4px; }.pay { color:var(--mint); white-space:nowrap; }.job-description { color:var(--text-muted); margin:14px 0 18px; }.job-details { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; margin-bottom:20px; }.job-details div { min-width:0; }.job-details dd { color:var(--text); font-size:13px; margin-top:3px; }.button { border:0; border-radius:9px; cursor:pointer; font-weight:700; padding:11px 16px; }.button-primary { background:var(--gold); color:var(--ink); }.empty-state { color:var(--text-muted); padding:24px; text-align:center; }@media (max-width:700px) { .provider-page{padding:24px 14px 110px}.page-heading,.toolbar{align-items:stretch; flex-direction:column}.select-field{width:100%}.job-details{grid-template-columns:repeat(2,1fr)}.job-card-head{align-items:start; flex-direction:column}.job-card .button{width:100%} }
.provider-page { background: #0a0e27; color: #333; }
.page-heading h1 { color: #fff; }
.toolbar, .job-card, .empty-state { background: #fff; border: 0; border-radius: 16px; }
.job-card h2 { color: #0d1b3d; }
.job-description, .muted { color: #6b7280; }
.search-field input, .select-field select { background: #fff; border-color: #e5e7eb; color: #0d1b3d; }
.job-details dd { color: #0d1b3d; }
.button-primary { background: #f5b941; color: #0d1b3d; }
.page-heading .muted { color: #d1d5db; }
</style>
