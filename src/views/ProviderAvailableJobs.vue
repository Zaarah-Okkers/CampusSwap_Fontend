<template>
  <main class="provider-page">
    <div class="provider-shell">
      <header class="page-heading">
        <div>
          <p class="eyebrow">Service provider workspace</p>
          <h1>Available jobs</h1>
          <p class="muted">Pending SafeHome requests you can quote on.</p>
        </div>
        <router-link class="text-link" to="/provider-jobs">View my jobs</router-link>
      </header>

      <ProviderNav />

      <p v-if="loading" class="empty-state glass-panel">Loading…</p>
      <p v-else-if="error" class="empty-state glass-panel error">{{ error }}</p>
      <p v-else-if="!filteredJobs.length" class="empty-state glass-panel">
        No pending requests match your search.
      </p>

      <section v-else class="job-list" aria-label="Available jobs">
        <article v-for="job in filteredJobs" :key="job.id" class="job-card glass-panel">
          <div class="job-card-head">
            <div>
              <p class="eyebrow">
                {{ job.serviceType || 'SafeHome request' }}
                <span v-if="job.priority === 'emergency'" class="urgent">· EMERGENCY</span>
              </p>
              <h2>{{ job.title }}</h2>
            </div>
          </div>
          <p class="job-description">{{ job.description }}</p>
          <dl class="job-details">
            <div><dt>Client</dt><dd>{{ job.client }}</dd></div>
            <div><dt>Residence</dt><dd>{{ job.location }}<span v-if="job.room"> · {{ job.room }}</span></dd></div>
            <div><dt>Requested</dt><dd>{{ formatDate(job.date) }}</dd></div>
            <div>
              <dt>Estimate</dt>
              <dd>{{ job.pay ? `R${job.pay.toFixed(2)}` : 'Your call' }}</dd>
            </div>
          </dl>
          <button class="button button-primary" @click="submitQuote(job)">Send quote</button>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import ProviderNav from '../components/ProviderNav.vue'
import { API_BASE } from '../services/api'

export default {
  name: 'ProviderAvailableJobs',
  components: { ProviderNav },
  setup() {
    const store = useStore()
    const search = ref('')

    const loading = computed(() => store.getters['provider/loading'])
    const error = computed(() => store.getters['provider/error'])
    const jobs = computed(() => store.getters['provider/availableJobs'])

    const filteredJobs = computed(() => {
      const q = search.value.toLowerCase().trim()
      if (!q) return jobs.value
      return jobs.value.filter((j) =>
        [j.title, j.client, j.location, j.description, j.serviceType]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q)),
      )
    })

    function formatDate(iso) {
      if (!iso) return ''
      return new Date(iso).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    }

    async function submitQuote(job) {
      const { value: amount } = await Swal.fire({
        title: 'Send a quote',
        html: `<p>Quote for <strong>${job.title}</strong></p>
               <p style="color:#64748b;font-size:13px">${job.location}${job.room ? ' · ' + job.room : ''}</p>`,
        input: 'number',
        inputLabel: 'Amount (R)',
        inputAttributes: { min: 1, step: 10 },
        inputPlaceholder: 'e.g. 250',
        showCancelButton: true,
        confirmButtonText: 'Submit quote',
        confirmButtonColor: '#2e7d5a',
        inputValidator: (v) => {
          const n = Number(v)
          if (!v || isNaN(n) || n <= 0) return 'Enter a positive amount.'
          return null
        },
      })

      if (!amount) return

      const me = JSON.parse(localStorage.getItem('user') || '{}')
      if (!me.id) {
        Swal.fire({ icon: 'error', title: 'Not logged in' })
        return
      }

      try {
        const res = await fetch(`${API_BASE}/services/${job.id}/quote`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider_id: me.id,
            estimated_cost: Number(amount),
          }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message || `Failed (${res.status})`)
        }
        await store.dispatch('provider/refresh')
        Swal.fire({
          icon: 'success',
          title: 'Quote submitted',
          text: `Your R${Number(amount).toFixed(2)} quote was sent to the residence manager.`,
          timer: 1800,
          showConfirmButton: false,
        })
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Could not submit', text: err.message })
      }
    }

    onMounted(() => {
      store.dispatch('provider/fetchAvailableJobs')
    })

    return { loading, error, jobs, search, filteredJobs, formatDate, submitQuote }
  },
}
</script>

<style scoped>
.provider-page { 
  background: #0a0e27;
   min-height: 100vh; 
   padding: 42px 24px 120px;
    color: #333; 
}
.provider-shell { width: min(1100px, 100%); margin: 0 auto; }
.page-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 30px; }
h1 { color: #fff; font-size: clamp(2rem, 4vw, 3.2rem); margin: 6px 0; }
.eyebrow { color: #f5b941; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
.urgent { color: #ff8577; }
.muted, dt { color: #6b7280; }
.text-link { color: #f5b941; font-weight: 700; white-space: nowrap; }
.job-list { display: grid; gap: 16px; }
.job-card { background: #fff; border: 0; border-radius: 16px; padding: 22px; }
.job-card-head { display: flex; justify-content: space-between; gap: 20px; }
.job-card h2 { color: #0d1b3d; font-size: 1.35rem; margin: 4px 0 0; }
.job-description { color: #6b7280; margin: 14px 0 18px; }
.job-details { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
.job-details dd { color: #0d1b3d; font-size: 13px; margin-top: 3px; }
.button { border: 0; border-radius: 9px; cursor: pointer; font-weight: 700; padding: 11px 18px; }
.button-primary { background: #f5b941; color: #0d1b3d; }
.button-primary:hover { background: #e0a330; }
.empty-state { color: #fff; padding: 24px; text-align: center; border-radius: 16px; }
.empty-state.error { color: #ff8577; }
@media (max-width: 700px) {
  .provider-page { padding: 24px 14px 110px; }
  .page-heading { flex-direction: column; align-items: stretch; }
  .job-details { grid-template-columns: repeat(2, 1fr); }
  .button { width: 100%; }
}
</style>