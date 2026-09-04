import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // Current user - starting as student
  const currentUser = ref({
    id: 1,
    name: 'Zaarah K.',
    email: 'zaarah@campus.co.za',
    role: 'student',
    avatar: 'https://placehold.co/100x100/6C5CE7/FFFFFF?text=Z',
    university: 'University of Cape Town (UCT)',
    verified: true,
    online: true
  })

  // All users in the system
  const users = ref([
    {
      id: 1,
      name: 'Zaarah K.',
      email: 'zaarah@campus.co.za',
      role: 'student',
      avatar: 'https://placehold.co/100x100/6C5CE7/FFFFFF?text=Z',
      university: 'University of Cape Town (UCT)',
      verified: true,
      online: true,
      lastSeen: new Date()
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
      lastSeen: new Date(Date.now() - 3600000)
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
      lastSeen: new Date()
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
      lastSeen: new Date(Date.now() - 7200000)
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
      lastSeen: new Date()
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
      lastSeen: new Date(Date.now() - 86400000)
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
      lastSeen: new Date(Date.now() - 1800000)
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
      lastSeen: new Date()
    }
  ])

  const adminNotifications = ref([])

  function getUserById(id) {
    return users.value.find(u => u.id === id)
  }

  function getUserByName(name) {
    return users.value.find(u => u.name === name)
  }

  const admins = computed(() => {
    return users.value.filter(u => u.role === 'admin')
  })

  const students = computed(() => {
    return users.value.filter(u => u.role === 'student')
  })

  const serviceProviders = computed(() => {
    return users.value.filter(u => u.role === 'service_provider')
  })

  function sendReportToAdmin(report) {
    const notification = {
      id: Date.now(),
      type: 'report',
      timestamp: new Date(),
      read: false,
      report: report,
      message: `🚨 New report from ${report.reporterName} against ${report.reportedUserName}`
    }
    
    adminNotifications.value.unshift(notification)
    console.log('📨 Report sent to admin:', notification)
    
    setTimeout(() => {
      const notif = adminNotifications.value.find(n => n.id === notification.id)
      if (notif) {
        notif.read = true
      }
    }, 30000)
    
    return notification
  }

  const unreadAdminNotifications = computed(() => {
    return adminNotifications.value.filter(n => !n.read)
  })

  function markNotificationAsRead(id) {
    const notif = adminNotifications.value.find(n => n.id === id)
    if (notif) {
      notif.read = true
    }
  }

  function getRoleDisplay(role) {
    const roles = {
      'student': 'Student',
      'admin': 'Admin',
      'service_provider': 'Service Provider'
    }
    return roles[role] || role
  }

  function getRoleColor(role) {
    const colors = {
      'student': '#6C5CE7',
      'admin': '#FF6B6B',
      'service_provider': '#6FA8FF'
    }
    return colors[role] || '#6C5CE7'
  }

  // Simple user switching function
  function switchUser(userId) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      currentUser.value = user
      return true
    }
    return false
  }

  return {
    currentUser,
    users,
    adminNotifications,
    getUserById,
    getUserByName,
    admins,
    students,
    serviceProviders,
    sendReportToAdmin,
    unreadAdminNotifications,
    markNotificationAsRead,
    getRoleDisplay,
    getRoleColor,
    switchUser
  }
})