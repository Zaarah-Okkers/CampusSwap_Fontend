<template>
  <div class="admin-users">
    <div class="page-header">
      <h2><AppIcon name="users" /> User Management</h2>
      <div class="header-actions">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search users..."
          class="search-input"
        />
      </div>
    </div>

    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>University</th>
            <th>Status</th>
            <th>Premium</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-cell">
                <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                <div>
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="role-badge" :class="user.role">{{
                getRoleDisplay(user.role)
              }}</span>
            </td>
            <td>{{ user.university || "N/A" }}</td>
            <td>
              <span class="status-dot" :class="{ online: user.online }"></span>
              {{ user.online ? "Online" : "Offline" }}
            </td>
            <td>
              <span v-if="user.isPremium" class="premium-badge"
                ><AppIcon name="star" /> Premium</span
              >
              <span v-else class="free-badge">Free</span>
            </td>
            <td>
              <div class="action-buttons">
                <button
                  class="action-btn"
                  @click="togglePremium(user.id)"
                  :title="user.isPremium ? 'Remove Premium' : 'Make Premium'"
                >
                  <AppIcon :name="user.isPremium ? 'star' : 'user'" />
                </button>

                <button
                  class="action-btn"
                  @click="verifyUser(user.id)"
                  v-if="!user.verified"
                  title="Verify user"
                >
                  <AppIcon name="check" />
                </button>

                <button
                  class="action-btn danger"
                  @click="banUser(user.id)"
                  v-if="!user.banned"
                  title="Ban user"
                >
                  <AppIcon name="alert" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { API_BASE } from "../../services/api";
import AppIcon from "../../components/AppIcon.vue";

export default {
  name: "AdminUsers",
  components: { AppIcon },
  data() {
    return {
      users: [],
      loading: true,
      error: "",
      search: "",
    };
  },
  computed: {
    filteredUsers() {
      const q = this.search.trim().toLowerCase();
      if (!q) return this.users;
      return this.users.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.university || "").toLowerCase().includes(q),
      );
    },
  },
  async mounted() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      this.error = "";
      try {
        const res = await fetch(`${API_BASE}/admin/users`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const body = await res.json();
        this.users = body.data || [];
      } catch (err) {
        this.error = "Could not load users. " + err.message;
      } finally {
        this.loading = false;
      }
    },
    initials(name) {
      if (!name) return "?";
      return name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    },
    prettyRole(role) {
      return (
        {
          student: "Student",
          service_provider: "Service Provider",
          res_manager: "Residence Manager",
          admin: "Admin",
        }[role] || role
      );
    },
  },
};
</script>

<style scoped>
.admin-users {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  color: var(--text);
  margin: 0;
}

.search-input {
  padding: 8px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  font-size: 14px;
  min-width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: var(--gold);
}

.table-container {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  overflow: hidden;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  text-align: left;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-faint);
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
}

.users-table td {
  padding: 12px 16px;
  border-top: 1px solid var(--glass-border);
  color: var(--text);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 600;
}

.user-email {
  font-size: 12px;
  color: var(--text-muted);
}

.role-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.role-badge.student {
  background: rgba(108, 92, 231, 0.2);
  color: #6c5ce7;
}
.role-badge.admin {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}
.role-badge.service_provider {
  background: rgba(111, 168, 255, 0.2);
  color: #6fa8ff;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b7280;
  margin-right: 6px;
}

.status-dot.online {
  background: #4ade80;
}

.premium-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(232, 181, 77, 0.2);
  color: var(--gold);
}

.free-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-btn.danger:hover {
  background: rgba(255, 107, 107, 0.2);
}
</style>
