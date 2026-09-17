export default {
  namespaced: true,
  state: {
    isLoggedIn: false,
    currentUser: {
      id: 1,
      name: 'Zaarah K.',
      email: 'zaarah@campus.co.za',
      role: 'student',
      avatar: 'https://placehold.co/100x100/6C5CE7/FFFFFF?text=Z',
      university: 'University of Cape Town (UCT)',
      verified: true,
      online: true,
      isPremium: false
    },
    users: [
      {
        id: 1,
        name: 'Zaarah K.',
        email: 'zaarah@campus.co.za',
        role: 'student',
        avatar: 'https://placehold.co/100x100/6C5CE7/FFFFFF?text=Z',
        university: 'University of Cape Town (UCT)',
        verified: true,
        online: true,
        isPremium: false
      },
      {
        id: 2,
        name: 'Thabo M.',
        email: 'thabo@campus.co.za',
        role: 'student',
        avatar: 'https://placehold.co/100x100/E8B54D/FFFFFF?text=T',
        university: 'University of Cape Town (UCT)',
        verified: true,
        online: false,
        isPremium: true
      },
      {
        id: 3,
        name: 'Aisha K.',
        email: 'aisha@campus.co.za',
        role: 'student',
        avatar: 'https://placehold.co/100x100/4ADE80/FFFFFF?text=A',
        university: 'Wits',
        verified: true,
        online: true,
        isPremium: false
      },
      {
        id: 4,
        name: 'Liam P.',
        email: 'liam@campus.co.za',
        role: 'student',
        avatar: 'https://placehold.co/100x100/FF8577/FFFFFF?text=L',
        university: 'Stellenbosch',
        verified: true,
        online: false,
        isPremium: false
      },
      {
        id: 5,
        name: 'Admin User',
        email: 'admin@campus.co.za',
        role: 'admin',
        avatar: 'https://placehold.co/100x100/FF6B6B/FFFFFF?text=A',
        university: 'CampusSwap Admin',
        verified: true,
        online: true,
        isPremium: true
      },
      {
        id: 6,
        name: 'ServicePro SA',
        email: 'service@campus.co.za',
        role: 'service_provider',
        avatar: 'https://placehold.co/100x100/6FA8FF/FFFFFF?text=SP',
        university: 'Various Campuses',
        verified: true,
        online: false,
        isPremium: false
      },
      {
        id: 7,
        name: 'Naledi S.',
        email: 'naledi@campus.co.za',
        role: 'student',
        avatar: 'https://placehold.co/100x100/9B59B6/FFFFFF?text=N',
        university: 'University of Cape Town (UCT)',
        verified: true,
        online: false,
        isPremium: true
      },
      {
        id: 8,
        name: 'Sipho D.',
        email: 'sipho@campus.co.za',
        role: 'student',
        avatar: 'https://placehold.co/100x100/F39C12/FFFFFF?text=S',
        university: 'Wits',
        verified: true,
        online: true,
        isPremium: false
      },
      {
        id: 9,
        name: 'Residence Manager',
        email: 'resmanager@campus.co.za',
        role: 'resmanager',
        avatar: 'https://placehold.co/100x100/4ADE80/FFFFFF?text=RM',
        university: 'Smuts Hall Residence',
        verified: true,
        online: true,
        isPremium: false
      }
    ],
    adminNotifications: []
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    currentUser: state => state.currentUser,
    users: state => state.users,
    getRoleDisplay: () => (role) => {
      const roles = {
        student: 'Student',
        admin: 'Admin',
        service_provider: 'Service Provider',
        resmanager: 'Residence Manager'
      }
      return roles[role] || role
    },
    getRoleColor: () => (role) => {
      const colors = {
        student: '#6C5CE7',
        admin: '#FF6B6B',
        service_provider: '#6FA8FF',
        resmanager: '#4ADE80'
      }
      return colors[role] || '#6C5CE7'
    }
  },
  mutations: {
    setLoggedIn(state, value) {
      state.isLoggedIn = value
    },
    logout(state) {
      state.isLoggedIn = false
      state.currentUser = {
        id: 'logged-out',
        name: 'Logged out viewer',
        email: '',
        role: 'logged_out',
        avatar: 'https://placehold.co/100x100/64748B/FFFFFF?text=G',
        university: '',
        verified: false,
        online: false,
        isPremium: false
      }
    },
    loginAsRole(state, role) {
      const storeRole = role === 'provider' ? 'service_provider' : role
      const user = state.users.find(candidate => candidate.role === storeRole)
      if (user) state.currentUser = user
      state.isLoggedIn = true
    },
    switchUser(state, userId) {
      const user = state.users.find(u => u.id === userId)
      if (user) {
        state.currentUser = user
      }
    },
    verifyUser(state, userId) {
      const user = state.users.find(u => u.id === userId)
      if (user) {
        user.verified = true
      }
    },
    banUser(state, userId) {
      const user = state.users.find(u => u.id === userId)
      if (user) {
        user.banned = true
      }
    },
    markNotificationAsRead(state, id) {
      const notif = state.adminNotifications.find(n => n.id === id)
      if (notif) {
        notif.read = true
      }
    },
    addNotification(state, notification) {
      state.adminNotifications.unshift(notification)
    }
  },
  actions: {
    logout({ commit }) {
      commit('logout')
      localStorage.removeItem('isLoggedIn')
    },
    switchUser({ commit, state }, userId) {
      const userExists = state.users.some(user => user.id === userId)
      commit('switchUser', userId)
      if (userExists) {
        commit('setLoggedIn', true)
        localStorage.setItem('isLoggedIn', 'true')
      }
      return userExists
    },
    sendReportToAdmin({ commit, state }, report) {
      const notification = {
        id: Date.now(),
        type: 'report',
        timestamp: new Date(),
        read: false,
        report: report,
        message: `New report from ${report.reporterName} against ${report.reportedUserName}`
      }
      commit('addNotification', notification)
      return notification
    }
  }
}
