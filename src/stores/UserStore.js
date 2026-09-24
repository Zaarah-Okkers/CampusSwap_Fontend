// Auth state for the app. Everything the app needs lives on `currentUser` +
// `isLoggedIn`. There is no local roster of users — real user records come
// from the backend /api/admin/users and /api/dashboards/student/:id.

export default {
  namespaced: true,

  state: {
    isLoggedIn: false,
    currentUser: {
      id: "logged-out",
      name: "Logged out viewer",
      email: "",
      role: "logged_out",
      avatar: "https://placehold.co/100x100/64748B/FFFFFF?text=G",
      university: "",
      verified: false,
      online: false,
      isPremium: false,
    },
    adminNotifications: [],
  },

  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    currentUser: (state) => state.currentUser,
    authUser: (state) => (state.isLoggedIn ? state.currentUser : null),
    getRoleDisplay: () => (role) => {
      const roles = {
        student: "Student",
        admin: "Admin",
        service_provider: "Service Provider",
        res_manager: "Residence Manager",
        resmanager: "Residence Manager",
      };
      return roles[role] || role;
    },
    getRoleColor: () => (role) => {
      const colors = {
        student: "#6C5CE7",
        admin: "#FF6B6B",
        service_provider: "#6FA8FF",
        res_manager: "#4ADE80",
        resmanager: "#4ADE80",
      };
      return colors[role] || "#6C5CE7";
    },
  },

  mutations: {
    setLoggedIn(state, value) {
      state.isLoggedIn = value;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.currentUser = {
        id: "logged-out",
        name: "Logged out viewer",
        email: "",
        role: "logged_out",
        avatar: "https://placehold.co/100x100/64748B/FFFFFF?text=G",
        university: "",
        verified: false,
        online: false,
        isPremium: false,
      };
    },
    addAdminNotification(state, notification) {
      state.adminNotifications.unshift(notification);
    },
    markNotificationAsRead(state, id) {
      const notif = state.adminNotifications.find((n) => n.id === id);
      if (notif) notif.read = true;
    },
  },

  actions: {
    logout({ commit }) {
      commit("logout");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
    },

    /**
     * Reports used to be pushed into a local array; now they go to the DB
     * via the notifications endpoint. Kept here only as a placeholder so
     * callers that still call this action don't crash.
     */
    async sendReportToAdmin({ commit }, report) {
      console.warn(
        "[UserStore] sendReportToAdmin is deprecated — use POST /api/notifications instead.",
      );
      commit("addAdminNotification", {
        id: Date.now(),
        type: "report",
        timestamp: new Date(),
        read: false,
        report,
      });
    },
  },
};
