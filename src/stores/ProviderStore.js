// Provider-side state. Backed by two endpoints:
//   GET /api/dashboards/provider/:id  → the provider's accepted/completed jobs
//   GET /api/services/open            → pending unassigned SafeHome requests
//
// Everything the three provider views + ProviderNav read from this store is
// derived from those two responses.

import { API_BASE } from "../services/api";

function currentUserId() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw).id : null;
  } catch {
    return null;
  }
}

// The services table has different columns than the old mock job objects.
// Map once so every view can keep reading `job.client`, `job.pay`, etc.
function mapService(s) {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    client: s.student_name || "A student",
    location: s.residence_name || "",
    room: s.room_number || "",
    date: s.created_at, // ISO timestamp; views format it
    pay: Number(s.estimated_cost || 0),
    status: s.status,
    priority: s.priority || "normal",
    serviceType: s.service_type || "",
  };
}

export default {
  namespaced: true,

  state: {
    availableJobs: [],
    myJobs: [],
    loading: false,
    error: "",
  },

  getters: {
    availableJobs: (s) => s.availableJobs,
    loading: (s) => s.loading,
    error: (s) => s.error,

    // Provider's accepted jobs (any status past 'pending')
    acceptedJobs: (s) => s.myJobs,
    scheduledJobs: (s) =>
      s.myJobs.filter(
        (j) => j.status === "assigned" || j.status === "approved",
      ),
    upcomingJobs: (s) => s.myJobs.filter((j) => j.status === "in_progress"),
    completedJobs: (s) => s.myJobs.filter((j) => j.status === "completed"),


    totalEarnings: (s) =>
      s.myJobs
        .filter((j) => j.status === "completed")
        .reduce((sum, j) => sum + j.pay, 0),
  },

  mutations: {
    SET_AVAILABLE(state, jobs) {
      state.availableJobs = jobs;
    },
    SET_MY(state, jobs) {
      state.myJobs = jobs;
    },
    SET_LOADING(state, v) {
      state.loading = v;
    },
    SET_ERROR(state, msg) {
      state.error = msg;
    },
  },

  actions: {
    async fetchAvailableJobs({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", "");
      try {
        const res = await fetch(`${API_BASE}/services/open`);
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const body = await res.json();
        commit("SET_AVAILABLE", (body.data || []).map(mapService));
      } catch (err) {
        commit("SET_ERROR", err.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchMyJobs({ commit }) {
      const uid = currentUserId();
      if (!uid) return;
      commit("SET_LOADING", true);
      commit("SET_ERROR", "");
      try {
        const res = await fetch(`${API_BASE}/dashboards/provider/${uid}`);
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const body = await res.json();
        commit("SET_MY", (body.jobs || []).map(mapService));
      } catch (err) {
        commit("SET_ERROR", err.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Called after a successful quote submission.
    async refresh({ dispatch }) {
      await Promise.all([
        dispatch("fetchAvailableJobs"),
        dispatch("fetchMyJobs"),
      ]);
    },
  },
};
