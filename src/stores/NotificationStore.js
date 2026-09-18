// User-scoped notification system. Persists to localStorage so
// notifications survive a page refresh, and every notification carries a
// userId so one resident never sees another resident's (or the manager's)
// notifications.
const STORAGE_KEY = 'cs-notifications'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persist(notifications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  } catch {
    // Storage can fail (private browsing, quota) — the in-memory list still
    // works for the rest of the session.
  }
}

export default {
  namespaced: true,
  state: {
    notifications: loadFromStorage()
  },
  getters: {
    forUser: state => userId => state.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    unreadCountForUser: (state, getters) => userId => getters.forUser(userId).filter(n => !n.read).length
  },
  mutations: {
    ADD(state, notification) {
      state.notifications.unshift(notification)
      persist(state.notifications)
    },
    MARK_READ(state, id) {
      const notif = state.notifications.find(n => n.id === id)
      if (notif) notif.read = true
      persist(state.notifications)
    },
    MARK_ALL_READ(state, userId) {
      state.notifications.forEach(n => {
        if (n.userId === userId) n.read = true
      })
      persist(state.notifications)
    }
  },
  actions: {
    /**
     * Create a notification for a given user. This is the single entry
     * point every action-flow (payment notice, move-out, residence
     * request, extension, safety report, ...) should call instead of
     * hand-rolling notification objects.
     */
    create({ commit }, { userId, type, title, message, actionUrl = null, metadata = {} }) {
      const notification = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId,
        type,
        title,
        message,
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl,
        metadata
      }
      commit('ADD', notification)
      return notification
    },
    markAsRead({ commit }, id) {
      commit('MARK_READ', id)
    },
    markAllAsRead({ commit }, userId) {
      commit('MARK_ALL_READ', userId)
    }
  }
}