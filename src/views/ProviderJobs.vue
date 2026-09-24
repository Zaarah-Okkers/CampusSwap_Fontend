<template>
  <main class="provider-page">
    <div class="provider-shell">
      <header class="page-heading">
        <div>
          <p class="eyebrow">Service provider workspace</p>
          <h1>My jobs</h1>
          <p class="muted">Jobs you have quoted on or completed.</p>
        </div>
        <router-link class="button button-primary" to="/provider-jobs/available">
          Find more work
        </router-link>
      </header>

      <ProviderNav />

      <p v-if="loading" class="empty-state">Loading…</p>
      <p v-else-if="!jobs.length" class="empty-state">
        You haven't been assigned any jobs yet. Head to Available Jobs to send quotes.
      </p>

      <div v-else class="job-list">
        <article v-for="job in jobs" :key="job.id" class="job-card">
          <div class="job-card-head">
            <div>
              <p class="eyebrow">{{ job.serviceType || 'SafeHome' }}</p>
              <h2>{{ job.title }}</h2>
            </div>
            <span :class="['status', `status-${job.status}`]">{{ statusLabel(job.status) }}</span>
          </div>
          <p class="job-description">{{ job.description }}</p>
          <dl class="job-details">
            <div><dt>Client</dt><dd>{{ job.client }}</dd></div>
            <div>
              <dt>Residence</dt>
              <dd>{{ job.location }}<span v-if="job.room"> · {{ job.room }}</span></dd>
            </div>
            <div><dt>Requested</dt><dd>{{ formatDate(job.date) }}</dd></div>
            <div><dt>Pay</dt><dd class="pay">{{ job.pay ? `R${job.pay.toFixed(2)}` : '—' }}</dd></div>
          </dl>

          <!-- Action buttons per status -->
          <div v-if="job.status === 'approved'" class="job-actions">
            <button class="btn-action btn-start" @click="updateStatus(job, 'in_progress')">
              Start work
            </button>
          </div>

          <div v-else-if="job.status === 'in_progress'" class="job-actions">
            <button class="btn-action btn-complete" @click="updateStatus(job, 'completed')">
              Mark as completed
            </button>
          </div>

          <div v-else-if="job.status === 'quoted'" class="job-actions">
            <p class="waiting-hint">
              Waiting for the residence manager to approve your quote.
            </p>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import Swal from "sweetalert2";
import ProviderNav from "../components/ProviderNav.vue";
import { API_BASE } from "../services/api";

export default {
  name: "ProviderJobs",
  components: { ProviderNav },
  setup() {
    const store = useStore();
    const busyId = ref(null);

    const loading = computed(() => store.getters["provider/loading"]);
    const jobs = computed(() => store.getters["provider/acceptedJobs"]);

    onMounted(() => {
      store.dispatch("provider/fetchMyJobs");
    });

    function formatDate(iso) {
      if (!iso) return "";
      return new Date(iso).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    function statusLabel(status) {
      const map = {
        assigned: "Assigned",
        quoted: "Quoted",
        approved: "Approved — start work",
        in_progress: "In progress",
        completed: "Completed",
        cancelled: "Cancelled",
        declined: "Declined",
      };
      return map[status] || status;
    }

    async function updateStatus(job, newStatus) {
      const confirmText =
        newStatus === "in_progress"
          ? `Start work on "${job.title}"?`
          : `Mark "${job.title}" as completed?`;

      const confirm = await Swal.fire({
        title: confirmText,
        text:
          newStatus === "completed"
            ? "The manager will be notified and can release payment."
            : null,
        icon: "question",
        showCancelButton: true,
        confirmButtonText:
          newStatus === "in_progress" ? "Start work" : "Mark completed",
        confirmButtonColor: "#2e7d5a",
      });
      if (!confirm.isConfirmed) return;

      busyId.value = job.id;
      try {
        const res = await fetch(`${API_BASE}/services/${job.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Failed (${res.status})`);
        }
        await store.dispatch("provider/fetchMyJobs");
        Swal.fire({
          icon: "success",
          title:
            newStatus === "in_progress" ? "Job started" : "Job completed",
          text:
            newStatus === "in_progress"
              ? "Good luck — the student can track progress."
              : "The manager can now release your payment.",
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({ icon: "error", title: "Could not update", text: err.message });
      } finally {
        busyId.value = null;
      }
    }

    return { loading, jobs, formatDate, statusLabel, updateStatus, busyId };
  },
};
</script>

<style scoped>
.provider-page { min-height: 100vh; padding: 42px 24px 120px; background: #0a0e27; color: #333; }
.provider-shell { width: min(1100px, 100%); margin: 0 auto; }
.page-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 30px; }
h1 { color: #fff; font-size: clamp(2rem, 4vw, 3.2rem); margin: 6px 0; }
.eyebrow { color: #f5b941; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 4px; }
.muted { color: #d1d5db; }
.button { background: #f5b941; border: 0; border-radius: 9px; color: #0d1b3d; cursor: pointer; font-weight: 700; padding: 12px 16px; text-decoration: none; white-space: nowrap; display: inline-block; }
.job-list { display: grid; gap: 16px; }
.job-card { background: #fff; border-radius: 16px; padding: 22px; }
.job-card-head { align-items: start; display: flex; justify-content: space-between; gap: 20px; }
.job-card h2 { color: #0d1b3d; font-size: 1.35rem; margin: 0; }
.job-description { color: #475569; margin: 14px 0 18px; }
.job-details { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 4px; }
.job-details dt { color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.job-details dd { color: #0d1b3d; font-size: 13px; margin-top: 3px; font-weight: 600; }
.pay { color: #047857 !important; font-weight: 800 !important; }

/* Action bar */
.job-actions {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px dashed #e2e8f0;
}
.btn-action {
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font-weight: 700;
  padding: 11px 22px;
  font-size: 14px;
  transition: filter 0.2s ease, transform 0.15s ease;
}
.btn-action:hover { filter: brightness(1.08); transform: translateY(-1px); }
.btn-start { background: #fef3c7; color: #92400e; }
.btn-complete { background: #047857; color: #ffffff; }
.waiting-hint {
  color: #6b7280;
  font-size: 13px;
  margin: 0;
  font-style: italic;
}

/* Status pills */
.status {
  border-radius: 999px;
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  white-space: nowrap;
  text-transform: capitalize;
}
.status-assigned    { background: #e0f2fe; color: #0369a1; }
.status-quoted      { background: #ede9fe; color: #5b21b6; }
.status-approved    { background: #f0fdf4; color: #166534; }
.status-in_progress { background: #fef3c7; color: #92400e; }
.status-completed   { background: #d1fae5; color: #065f46; }
.status-cancelled,
.status-declined    { background: #fee2e2; color: #991b1b; }

.empty-state { color: #fff; padding: 24px; text-align: center; }

@media (max-width: 700px) {
  .provider-page { padding: 24px 14px 110px; }
  .page-heading { flex-direction: column; align-items: stretch; }
  .job-card-head { flex-direction: column; }
  .job-details { grid-template-columns: repeat(2, 1fr); }
  .button { text-align: center; }
  .btn-action { width: 100%; }
}
</style>