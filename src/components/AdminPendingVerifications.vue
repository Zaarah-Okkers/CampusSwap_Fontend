<template>
  <section class="pending-panel">
    <header class="panel-head">
      <div>
        <p class="eyebrow">Admin review</p>
        <h2>Pending verifications</h2>
      </div>
      <span v-if="!loading" class="count-pill">{{ pending.length }}</span>
    </header>

    <p v-if="loading" class="state-msg">Loading pending users…</p>
    <p v-else-if="error" class="state-msg error">{{ error }}</p>
    <p v-else-if="pending.length === 0" class="state-msg">
      All clear — no accounts are waiting for review.
    </p>

    <ul v-else class="pending-list">
      <li v-for="user in pending" :key="user.id" class="pending-row">
        <div class="user-info">
          <strong>{{ user.full_name }}</strong>
          <span class="user-email">{{ user.email }}</span>
          <span class="user-meta">
            <span class="role-tag">{{ prettyRole(user.role) }}</span>
            <span v-if="user.university_name">
              · {{ user.university_name }}</span
            >
            <span v-if="user.student_number"> · {{ user.student_number }}</span>
          </span>
        </div>
        <button
          class="btn-approve"
          :disabled="busyId === user.id"
          @click="approve(user)"
        >
          {{ busyId === user.id ? "…" : "Approve" }}
        </button>
      </li>
    </ul>
  </section>
</template>

<script>
import Swal from "sweetalert2";
import { API_BASE } from "../services/api";

export default {
  name: "AdminPendingVerifications",
  data() {
    return {
      pending: [],
      loading: true,
      error: "",
      busyId: null,
    };
  },
  async mounted() {
    await this.loadPending();
  },
  methods: {
    prettyRole(role) {
      return (
        {
          student: "Student",
          service_provider: "Service Provider",
          res_manager: "Residence Manager",
          admin: "Administrator",
        }[role] || role
      );
    },
    async loadPending() {
      this.loading = true;
      this.error = "";
      try {
        const res = await fetch(`${API_BASE}/admin/pending-users`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const body = await res.json();
        this.pending = body.data || [];
      } catch (err) {
        this.error = "Could not load pending users. " + err.message;
      } finally {
        this.loading = false;
      }
    },
    async approve(user) {
      const confirm = await Swal.fire({
        title: "Approve this account?",
        html: `<p>Approve <strong>${user.full_name}</strong> (${user.email})?</p>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Approve",
        confirmButtonColor: "#2e7d5a",
      });
      if (!confirm.isConfirmed) return;

      this.busyId = user.id;
      try {
        const res = await fetch(`${API_BASE}/admin/users/${user.id}/verify`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        this.pending = this.pending.filter((u) => u.id !== user.id);
        Swal.fire({
          icon: "success",
          title: "Approved",
          text: `${user.full_name} is now verified.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Could not approve",
          text: err.message,
        });
      } finally {
        this.busyId = null;
      }
    },
  },
};
</script>

<style scoped>
.pending-panel {
  background: #fff;
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #6c4b6a;
  padding-bottom: 12px;
  margin-bottom: 16px;
}
.eyebrow {
  color: #6c4b6a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 4px;
}
h2 {
  color: #0d1b3d;
  font-size: 1.2rem;
  margin: 0;
}
.count-pill {
  background: #f5b941;
  color: #0d1b3d;
  font-weight: 800;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 999px;
}
.state-msg {
  color: #64748b;
  padding: 20px 0;
  text-align: center;
}
.state-msg.error {
  color: #d33;
}
.pending-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.pending-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #eef1f5;
}
.pending-row:last-child {
  border-bottom: none;
}
.user-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.user-info strong {
  color: #0d1b3d;
  font-size: 14px;
}
.user-email {
  color: #64748b;
  font-size: 13px;
  word-break: break-all;
}
.user-meta {
  color: #94a3b8;
  font-size: 12px;
}
.role-tag {
  background: #ede9fe;
  color: #6c5ce7;
  padding: 1px 8px;
  border-radius: 999px;
  font-weight: 700;
}
.btn-approve {
  background: #2e7d5a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
.btn-approve:hover {
  background: #235f45;
}
.btn-approve:disabled {
  opacity: 0.5;
  cursor: wait;
}
@media (max-width: 640px) {
  .pending-row {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-approve {
    width: 100%;
  }
}
</style>
