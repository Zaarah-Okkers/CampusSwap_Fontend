<template>
  <main class="provider-page">
    <div class="provider-shell">
      <header class="provider-header">
        <div>
          <p class="eyebrow">Service provider workspace</p>
          <h1>Hi, {{ firstName }}</h1>
          <p class="muted">Your jobs, earnings and client feedback.</p>
        </div>
        <router-link class="button button-primary" to="/provider-jobs/available">
          Find available work
        </router-link>
      </header>

      <ProviderNav />

      <section class="stat-grid">
        <article v-for="stat in stats" :key="stat.label" class="stat-card">
          <span class="stat-label">{{ stat.label }}</span>
          <strong>{{ stat.value }}</strong>
          <span class="stat-note">{{ stat.note }}</span>
        </article>
      </section>

      <section class="content-grid">
        <article class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Recent work</p>
              <h2>Jobs done</h2>
            </div>
            <router-link class="text-link" to="/provider-jobs">View all</router-link>
          </div>

          <p v-if="!completedJobs.length" class="empty">
            No completed jobs yet.
          </p>
          <div v-else class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Client</th>
                  <th>Location</th>
                  <th>Pay earned</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in completedJobs" :key="job.id">
                  <td>{{ job.title }}</td>
                  <td>{{ job.client }}</td>
                  <td>
                    {{ job.location }}
                    <span v-if="job.room"> · {{ job.room }}</span>
                  </td>
                  <td class="pay">R{{ job.pay.toFixed(2) }}</td>
                  <td><span class="status status-completed">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article id="reviews" class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Reviews</p>
              <h2>Client feedback</h2>
            </div>
            <span v-if="reviews.length" class="rating-pill">
              ★ {{ averageRating }} / 5 · {{ reviews.length }}
            </span>
          </div>

          <p v-if="loadingReviews" class="empty">Loading reviews…</p>
          <p v-else-if="!reviews.length" class="empty">
            No reviews yet. Once students rate your completed jobs, their
            feedback will appear here.
          </p>

          <div v-else class="review-list">
            <article
              v-for="r in reviews"
              :key="r.id"
              class="review-item"
            >
              <div class="review-head">
                <strong>{{ r.student_name }}</strong>
                <span class="review-stars">
                  <span v-for="n in 5" :key="n" :class="{ filled: n <= r.rating }">★</span>
                </span>
              </div>
              <p class="review-meta">
                {{ r.service_title }} · {{ r.service_type }} ·
                {{ formatDate(r.created_at) }}
              </p>
              <p v-if="r.comment" class="review-comment">"{{ r.comment }}"</p>
            </article>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import ProviderNav from "../components/ProviderNav.vue";
import { API_BASE } from "../services/api";

export default {
  name: "ProviderDashboard",
  components: { ProviderNav },
  setup() {
    const store = useStore();

    const reviews = ref([]);
    const loadingReviews = ref(true);
    const averageRating = ref(0);

    const firstName = computed(() => {
      const name = store.getters["user/currentUser"]?.name || "Provider";
      return name.split(" ")[0];
    });

    const completedJobs = computed(() => store.getters["provider/completedJobs"]);
    const scheduled = computed(() => store.getters["provider/scheduledJobs"]);
    const upcoming = computed(() => store.getters["provider/upcomingJobs"]);
    const accepted = computed(() => store.getters["provider/acceptedJobs"]);
    const earnings = computed(() => store.getters["provider/totalEarnings"]);

    const stats = computed(() => [
      { label: "Jobs completed", value: completedJobs.value.length, note: "Successfully finished" },
      { label: "Jobs scheduled", value: scheduled.value.length, note: "Assigned or approved" },
      { label: "Upcoming jobs", value: upcoming.value.length, note: "In progress" },
      { label: "Jobs accepted", value: accepted.value.length, note: "Total active" },
      { label: "Total earnings", value: `R${earnings.value.toFixed(2)}`, note: "From completed jobs" },
    ]);

    function formatDate(iso) {
      if (!iso) return "";
      return new Date(iso).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    async function loadReviews() {
      const uid = store.getters["user/currentUser"]?.id;
      if (!uid) return;
      loadingReviews.value = true;
      try {
        const res = await fetch(`${API_BASE}/services/reviews?provider_id=${uid}`);
        const body = await res.json();
        reviews.value = body.data || [];
        averageRating.value = body.average || 0;
      } catch (err) {
        console.error("[provider-dashboard] reviews load failed:", err);
        reviews.value = [];
      } finally {
        loadingReviews.value = false;
      }
    }

    onMounted(() => {
      store.dispatch("provider/fetchMyJobs");
      store.dispatch("provider/fetchAvailableJobs");
      loadReviews();
    });

    return {
      firstName,
      completedJobs,
      stats,
      reviews,
      loadingReviews,
      averageRating,
      formatDate,
    };
  },
};
</script>

<style scoped>
.provider-page { min-height: 100vh; padding: 42px 24px 120px; background: #0a0e27; color: #1e293b; }
.provider-shell { width: min(1240px, 100%); margin: 0 auto; }
.provider-header { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 30px; }
.provider-header h1 { color: #fff; font-size: clamp(2rem, 4vw, 3.4rem); margin: 6px 0; }
.eyebrow { color: #f5b941; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 4px; }
.muted { color: #e2e8f0; }
.button { border: 0; border-radius: 9px; cursor: pointer; display: inline-flex; font-weight: 700; padding: 12px 16px; text-decoration: none; white-space: nowrap; }
.button-primary { background: #f5b941; color: #0d1b3d; }
.stat-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 22px; }
.stat-card { background: #fff; border-radius: 16px; padding: 18px; min-height: 130px; display: flex; flex-direction: column; justify-content: space-between; }
.stat-label { color: #475569; font-size: 12px; font-weight: 600; }
.stat-card strong { color: #0d1b3d; font-family: "Fraunces", Georgia, serif; font-size: 2rem; }
.stat-note { font-size: 11px; color: #64748b; }
.content-grid { display: grid; gap: 22px; grid-template-columns: 1fr; }
.panel { background: #fff; border-radius: 16px; padding: 20px; min-width: 0; }
.panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; border-bottom: 2px solid #6c4b6a; padding-bottom: 12px; flex-wrap: wrap; }
.panel h2 { color: #0d1b3d; font-size: 1.35rem; margin: 0; }
.text-link { color: #047857; font-size: 13px; font-weight: 700; text-decoration: none; }
.rating-pill { background: #fef3c7; color: #92400e; border-radius: 999px; font-size: 12px; font-weight: 700; padding: 6px 12px; }
.table-wrap { overflow-x: auto; }
table { border-collapse: collapse; min-width: 620px; width: 100%; }
th, td { border-bottom: 1px solid #e2e8f0; padding: 12px 10px; text-align: left; vertical-align: top; }
th { color: #475569; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
td { color: #1e293b; font-size: 13px; }
td:first-child { color: #0d1b3d; font-weight: 700; }
.pay { color: #047857; font-weight: 700; white-space: nowrap; }
.status-completed { background: #d1fae5; color: #065f46; border-radius: 999px; font-size: 11px; font-weight: 800; padding: 4px 11px; }
.empty { color: #475569; font-size: 14px; padding: 20px 0; margin: 0; }

/* Reviews */
.review-list { display: grid; gap: 14px; }
.review-item { border-bottom: 1px solid #e2e8f0; padding: 12px 0; }
.review-item:last-child { border-bottom: 0; }
.review-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
.review-head strong { color: #0d1b3d; font-size: 14px; font-weight: 700; }
.review-stars { color: #cbd5e1; letter-spacing: 1px; font-size: 15px; }
.review-stars .filled { color: #f5b941; }
.review-meta { color: #475569; font-size: 12px; margin: 4px 0 6px; }
.review-comment { color: #1e293b; font-size: 13.5px; line-height: 1.55; margin: 0; font-style: italic; }

@media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px) {
  .provider-page { padding: 24px 14px 110px; }
  .provider-header { align-items: start; flex-direction: column; }
  .button { width: 100%; justify-content: center; }
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .stat-card { min-height: 112px; padding: 14px; }
}
</style>