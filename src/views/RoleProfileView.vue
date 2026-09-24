<template>
  <main class="profile-page">
    <section class="profile-container">
      <!-- Greeting -->
      <div class="greeting">
        <div>
          <h1>Hi, {{ displayName }}</h1>
          <p>{{ config.workspace }}</p>
        </div>
        <span>{{ today }}</span>
      </div>

      <!-- Profile overview -->
      <article class="card profile-overview">
        <div class="profile-head">
          <div class="avatar">{{ initials }}</div>
          <div>
            <h2>{{ displayName }}</h2>
            <p>{{ user.email || config.email }}</p>
            <div class="badges">
              <span :class="['verify-badge', user.verified ? 'verified' : 'pending']">
                {{ user.verified ? config.verified : 'Verification pending' }}
              </span>
              <span class="loc-badge">{{ config.locationLabel }}: {{ location }}</span>
            </div>
          </div>
        </div>

        <div class="details">
          <div>
            <span>{{ config.idLabel }}</span>
            <strong>{{ config.id }}</strong>
          </div>
          <div>
            <span>{{ config.locationLabel }}</span>
            <strong>{{ location }}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong class="active">● Active member</strong>
          </div>
          <div>
            <span>Member since</span>
            <strong>{{ memberSince }}</strong>
          </div>
        </div>
      </article>

      <!-- Activity overview -->
      <article class="card">
        <h2>Activity Overview</h2>
        <p v-if="loadingStats" class="stats-loading">Loading your activity…</p>
        <div v-else class="stats">
          <div v-for="stat in stats" :key="stat.label">
            <span>{{ stat.label }}</span>
            <strong>{{ stat.value }}</strong>
          </div>
        </div>
      </article>

      <!-- Role-specific tools -->
      <article class="card">
        <h2>{{ config.actionsTitle }}</h2>
        <div class="actions">
          <router-link
            v-for="action in config.actions"
            :key="action.label"
            :to="action.to"
          >
            <strong>{{ action.label }}</strong>
            <span>{{ action.description }} →</span>
          </router-link>
        </div>
      </article>
    </section>
  </main>
</template>

<script>
import { API_BASE } from '../services/api'

const PROFILES = {
  student: {
    title: 'Student Dashboard',
    workspace: 'Student workspace',
    email: 'student@campusswap.co.za',
    verified: 'Verified student',
    locationLabel: 'Institution',
    idLabel: 'Student ID',
    id: 'STU-2026-001',
    actionsTitle: 'Student tools',
    actions: [
      { label: 'Marketplace', description: 'Browse campus listings', to: '/marketplace' },
      { label: 'SafeHome', description: 'Request or track repairs', to: '/safehome' },
    ],
  },
  service_provider: {
    title: 'Service Provider',
    workspace: 'Service provider workspace',
    email: 'provider@work.co.za',
    verified: 'Verified provider',
    locationLabel: 'Service area',
    idLabel: 'Provider ID',
    id: 'PRO-2026-001',
    actionsTitle: 'Provider tools',
    actions: [
      { label: 'Available SafeHome jobs', description: 'Browse new SafeHome work', to: '/provider-jobs/available' },
      { label: 'My jobs', description: 'Track assigned work', to: '/provider-jobs' },
    ],
  },
  res_manager: {
    title: 'Residence Manager',
    workspace: 'Residence management workspace',
    email: 'resmanager@campusswap.co.za',
    verified: 'Verified manager',
    locationLabel: 'Residence',
    idLabel: 'Manager ID',
    id: 'RES-2026-001',
    actionsTitle: 'Management tools',
    actions: [
      { label: 'Provider payments', description: 'Approve and pay completed SafeHome work', to: '/resmanager-payments' },
      { label: 'SafeHome requests', description: 'Review current repair work', to: '/safehome' },
    ],
  },
  admin: {
    title: 'Administrator',
    workspace: 'CampusSwap administration workspace',
    email: 'admin@campusswap.co.za',
    verified: 'Verified administrator',
    locationLabel: 'Organisation',
    idLabel: 'Admin ID',
    id: 'ADM-2026-001',
    actionsTitle: 'Administration tools',
    actions: [
      { label: 'Manage users', description: 'Review platform accounts', to: '/admin/users' },
      { label: 'Premium accounts', description: 'Manage premium access', to: '/admin/premium' },
    ],
  },
}

export default {
  name: 'RoleProfileView',
  data() {
    return {
      stats: [],
      loadingStats: true,
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/currentUser'] || {}
    },
    role() {
      return this.$route.meta.profileRole || this.user.role || 'student'
    },
    config() {
      return PROFILES[this.role] || PROFILES.student
    },
    displayName() {
      return this.user.full_name || this.user.name || this.config.title
    },
    initials() {
      return this.displayName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    },
    location() {
      if (this.user.university) return this.user.university
      if (this.role === 'res_manager') return 'Smuts Hall Residence'
      if (this.role === 'admin') return 'CampusSwap SA'
      return 'Not assigned yet'
    },
    memberSince() {
      // The store keeps `created_at` on some user objects; fall back to a friendly default.
      const raw = this.user.created_at || this.user.createdAt
      if (!raw) return 'September 2026'
      return new Date(raw).toLocaleDateString('en-ZA', {
        month: 'long',
        year: 'numeric',
      })
    },
    today() {
      return new Date().toLocaleDateString('en-ZA', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    },
  },
  async mounted() {
    await this.loadStats()
  },
  methods: {
    // Fetch real stats from whichever endpoint matches the user's role.
    // Each is a separate concern, so we guard each fetch and let the
    // component render even if one of them fails.
    async loadStats() {
      this.loadingStats = true
      try {
        if (this.role === 'admin') {
          await this.loadAdminStats()
        } else if (this.role === 'student') {
          await this.loadStudentStats()
        } else if (this.role === 'service_provider') {
          await this.loadProviderStats()
        } else if (this.role === 'res_manager') {
          await this.loadResManagerStats()
        } else {
          this.stats = []
        }
      } catch (err) {
        console.warn('[profile] stats load failed:', err.message)
        this.stats = []
      } finally {
        this.loadingStats = false
      }
    },

    async loadAdminStats() {
      const res = await fetch(`${API_BASE}/admin/stats`)
      if (!res.ok) throw new Error(`admin/stats ${res.status}`)
      const body = await res.json()
      const s = body.data || {}
      this.stats = [
        { label: 'Platform users', value: String(s.users ?? 0) },
        { label: 'Active listings', value: String(s.listings ?? 0) },
        { label: 'Pending reports', value: String(s.pendingReports ?? 0) },
      ]
    },

    async loadStudentStats() {
      if (!this.user.id) return
      // Listings + orders come from the student dashboard endpoint.
      const res = await fetch(`${API_BASE}/dashboards/student/${this.user.id}`)
      if (!res.ok) throw new Error(`student dashboard ${res.status}`)
      const body = await res.json()
      const listings = body.mylistings?.length ?? 0
      const orders = body.myOrders?.length ?? 0

      // SafeHome requests live in `services`. We query by student_id.
      let safehome = 0
      try {
        const sh = await fetch(`${API_BASE}/services?student_id=${this.user.id}`)
        if (sh.ok) {
          const shBody = await sh.json()
          safehome = shBody.data?.length ?? 0
        }
      } catch {
        // Non-fatal — leave it at 0.
      }

      this.stats = [
        { label: 'My listings', value: String(listings) },
        { label: 'My orders', value: String(orders) },
        { label: 'SafeHome requests', value: String(safehome) },
      ]
    },

    async loadProviderStats() {
      if (!this.user.id) return
      const res = await fetch(`${API_BASE}/dashboards/provider/${this.user.id}`)
      if (!res.ok) throw new Error(`provider dashboard ${res.status}`)
      const body = await res.json()
      const jobs = body.jobs || []
      const completed = jobs.filter((j) => j.status === 'completed').length
      const active = jobs.filter((j) =>
        ['assigned', 'in_progress'].includes(j.status),
      ).length

      this.stats = [
        { label: 'Jobs completed', value: String(completed) },
        { label: 'Active jobs', value: String(active) },
        { label: 'Total jobs', value: String(jobs.length) },
      ]
    },

    async loadResManagerStats() {
      const res = await fetch(`${API_BASE}/dashboards/res-manager`)
      if (!res.ok) throw new Error(`res manager dashboard ${res.status}`)
      const body = await res.json()
      const requests = body.maintenanceRequests || []
      const open = requests.filter((r) => r.status !== 'completed').length
      const completed = requests.filter((r) => r.status === 'completed').length

      this.stats = [
        { label: 'Open requests', value: String(open) },
        { label: 'Completed repairs', value: String(completed) },
        { label: 'Total requests', value: String(requests.length) },
      ]
    },
  },
}
</script>

<style scoped>
.profile-page {
  background: #0a0e27;
  min-height: 100vh;
  padding: 34px 20px 120px;
}
.profile-container {
  margin: auto;
  max-width: 900px;
}

/* Greeting */
.greeting {
  align-items: start;
  color: #fff;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.greeting h1 {
  font-size: 28px;
  margin: 0 0 6px;
}
.greeting p,
.greeting > span {
  color: #d1d5db;
  margin: 0;
}
.greeting > span {
  font-size: 13px;
}

/* Cards */
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 18px;
  padding: 22px;
}
.card h2 {
  color: #0d1b3d;
  font-size: 18px;
  margin: 0 0 18px;
  padding-bottom: 10px;
  border-bottom: 2px solid #6c4b6a;
}

/* Profile head */
.profile-head {
  align-items: center;
  display: flex;
  gap: 16px;
  margin-bottom: 22px;
}
.avatar {
  align-items: center;
  background: #f5b941;
  border-radius: 50%;
  color: #0d1b3d;
  display: flex;
  font-size: 24px;
  font-weight: 800;
  height: 72px;
  justify-content: center;
  width: 72px;
  flex-shrink: 0;
}
.profile-head h2 {
  border: 0;
  margin: 0;
  padding: 0;
}
.profile-head p {
  color: #64748b;
  margin: 5px 0 9px;
}

/* Badges */
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.badges span {
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 9px;
}
.verify-badge.verified {
  background: #ecfdf5;
  color: #166534;
}
.verify-badge.pending {
  background: #fef2f2;
  color: #b91c1c;
}
.loc-badge {
  background: #ecfdf5;
  color: #166534;
}

/* Detail + stat grids */
.details,
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.details > div,
.stats > div {
  background: #f8fafc;
  border-radius: 10px;
  padding: 13px;
}
.details span,
.stats span {
  color: #64748b;
  display: block;
  font-size: 11px;
  text-transform: uppercase;
}
.details strong,
.stats strong {
  color: #0d1b3d;
  display: block;
  font-size: 14px;
  margin-top: 6px;
}
.details .active {
  color: #2e7d5a;
}
.stats strong {
  color: #2e7d5a;
  font-size: 24px;
}
.stats-loading {
  color: #64748b;
  font-size: 13px;
  padding: 8px 0;
}

/* Actions */
.actions {
  display: grid;
  gap: 10px;
}
.actions a {
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #0d1b3d;
  display: flex;
  justify-content: space-between;
  padding: 14px;
  text-decoration: none;
}
.actions a:hover {
  border-color: #f5b941;
}
.actions span {
  color: #64748b;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 650px) {
  .profile-page {
    padding: 24px 14px 110px;
  }
  .greeting {
    gap: 12px;
    flex-direction: column;
  }
  .details,
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .profile-head {
    align-items: flex-start;
  }
  .actions a {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}
</style>