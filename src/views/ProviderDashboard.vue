<template>
  <main class="provider-page">
    <div class="provider-shell">
      <header class="provider-header">
        <div>
          <p class="eyebrow">Service provider workspace</p>
          <h1>Good morning, {{ currentUser.name.split(' ')[0] }}</h1>
          <p class="muted">Keep an eye on your work, earnings, and client feedback.</p>
        </div>
        <router-link class="button button-primary" to="/provider-jobs/available">Find available work</router-link>
      </header>

      <ProviderNav />

      <section class="stat-grid" aria-label="Provider activity summary">
        <article v-for="stat in stats" :key="stat.label" class="stat-card glass-panel">
          <span class="stat-label">{{ stat.label }}</span>
          <strong>{{ stat.value }}</strong>
          <span class="stat-note">{{ stat.note }}</span>
        </article>
      </section>

      <section class="content-grid">
        <article id="reviews" class="panel glass-panel table-panel">
          <div class="panel-heading">
            <div><p class="eyebrow">Client feedback</p><h2>Reviews received</h2></div>
            <span class="rating-pill">{{ averageRating }} / 5</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Client</th><th>Job / service</th><th>Rating</th><th>Review</th><th>Date</th></tr></thead>
              <tbody>
                <tr v-for="review in reviews" :key="review.id">
                  <td>{{ review.client }}</td><td>{{ review.job }}</td><td><span class="stars"><AppIcon v-for="star in review.rating" :key="star" name="star" /></span></td><td class="comment">{{ review.comment }}</td><td>{{ formatDate(review.date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="panel glass-panel table-panel">
          <div class="panel-heading">
            <div><p class="eyebrow">Recent work</p><h2>Jobs done</h2></div>
            <router-link class="text-link" to="/provider-jobs?tab=completed">View all</router-link>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Job / service</th><th>Client</th><th>Date completed</th><th>Location</th><th>Pay earned</th><th>Status</th></tr></thead>
              <tbody>
                <tr v-for="job in completedJobs" :key="job.id">
                  <td>{{ job.title }}</td><td>{{ job.client }}</td><td>{{ formatDate(job.date) }}</td><td>{{ job.location }}</td><td class="pay">R{{ job.pay.toLocaleString() }}</td><td><span class="status status-completed">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import ProviderNav from '../components/ProviderNav.vue'
import AppIcon from '../components/AppIcon.vue'

const store = useStore()
const currentUser = computed(() => store.getters['user/currentUser'])
const reviews = computed(() => store.getters['provider/reviews'])
const completedJobs = computed(() => store.getters['provider/completedJobs'])
const stats = computed(() => [
  { label: 'Jobs completed', value: completedJobs.value.length, note: 'Successfully finished' },
  { label: 'Jobs scheduled', value: store.getters['provider/scheduledJobs'].length, note: 'Confirmed bookings' },
  { label: 'Upcoming jobs', value: store.getters['provider/upcomingJobs'].length, note: 'Ready for delivery' },
  { label: 'Jobs accepted', value: store.getters['provider/acceptedJobs'].length, note: 'Active commitments' },
  { label: 'Total earnings', value: `R${store.getters['provider/totalEarnings'].toLocaleString()}`, note: 'Accepted and completed' }
])
const averageRating = computed(() => (reviews.value.reduce((sum, review) => sum + review.rating, 0) / reviews.value.length).toFixed(1))

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.provider-page { min-height: 100vh; padding: 42px 24px 120px; }
.provider-shell { width: min(1240px, 100%); margin: 0 auto; }
.provider-header { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 30px; }
.eyebrow { color: var(--gold); font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
h1 { font-size: clamp(2rem, 4vw, 3.4rem); margin: 6px 0; }
h2 { font-size: 1.35rem; margin-top: 4px; }
.muted, .stat-note { color: var(--text-muted); }
.button { border: 0; border-radius: 9px; cursor: pointer; display: inline-flex; font-weight: 700; padding: 12px 16px; white-space: nowrap; }
.button-primary { background: var(--gold); color: var(--ink); }
.stat-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 22px; }
.stat-card { padding: 18px; min-height: 130px; display: flex; flex-direction: column; justify-content: space-between; }
.stat-label { color: var(--text-muted); font-size: 12px; }
.stat-card strong { color: var(--text); font-family: 'Fraunces', Georgia, serif; font-size: 2rem; }
.stat-note { font-size: 11px; }
.content-grid { display: grid; gap: 22px; }
.panel { padding: 20px; min-width: 0; }
.panel-heading { display: flex; align-items: start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.rating-pill, .status { border-radius: 999px; font-size: 12px; font-weight: 700; padding: 5px 10px; }
.rating-pill { background: var(--gold-soft); color: var(--gold); }
.text-link { color: var(--gold); font-size: 13px; font-weight: 700; }
.table-wrap { overflow-x: auto; }
table { border-collapse: collapse; min-width: 760px; width: 100%; }
th, td { border-bottom: 1px solid var(--glass-border); padding: 12px 10px; text-align: left; vertical-align: top; }
th { color: var(--text-faint); font-size: 11px; font-weight: 700; text-transform: uppercase; }
td { color: var(--text-muted); font-size: 13px; }
td:first-child { color: var(--text); font-weight: 700; }
.comment { max-width: 280px; }
.stars { color: var(--gold); letter-spacing: 1px; white-space: nowrap; }
.pay { color: var(--mint); font-weight: 700; white-space: nowrap; }
.status-completed { background: var(--mint-soft); color: var(--mint); }
@media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px) { .provider-page { padding: 24px 14px 110px; } .provider-header { align-items: start; flex-direction: column; } .button { width: 100%; justify-content: center; } .stat-grid { grid-template-columns: repeat(2, 1fr); } .stat-card { min-height: 112px; padding: 14px; } }
.provider-page { background: #0a0e27; color: #333; }
.provider-header h1 { color: #fff; }
.panel, .stat-card { background: #fff; border: 0; border-radius: 16px; }
.panel h2 { color: #0d1b3d; }
.muted, .stat-note, td { color: #6b7280; }
.stat-label { color: #64748b; }
.stat-card strong { color: #0d1b3d; }
.panel-heading { border-bottom: 2px solid #6c4b6a; padding-bottom: 10px; }
th { color: #64748b; }
td { border-bottom-color: #eeeeee; }
td:first-child { color: #0d1b3d; }
.button-primary { background: #f5b941; color: #0d1b3d; }
.provider-header .muted { color: #d1d5db; }
</style>
