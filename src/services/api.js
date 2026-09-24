// src/services/api.js
// Single source of truth for talking to the CampusSwap backend.
// Backend default: http://localhost:3000/api

export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Request failed (${response.status})`,
    )
  }
  return data
}

// ------------------------------------------------------------
// AUTH
// ------------------------------------------------------------
export const authAPI = {
  login: (email, password, role) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  changePassword: (userId, currentPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ userId, currentPassword, newPassword }),
    }),
}

// ------------------------------------------------------------
// HOME — featured products, categories, universities
// ------------------------------------------------------------
export const homeAPI = {
  getHomeData: () => request('/home'),
}

// ------------------------------------------------------------
// DASHBOARDS — one per role
// ------------------------------------------------------------
export const dashAPI = {
  getStudent: (userId) => request(`/dashboards/student/${userId}`),
  getAdmin: () => request('/dashboards/admin'),
  getResManager: () => request('/dashboards/res-manager'),
  getProvider: (providerId) => request(`/dashboards/provider/${providerId}`),
}

// ------------------------------------------------------------
// SHOP / CHECKOUT
// ------------------------------------------------------------
export const api = {
  getProducts: () => request('/products'),
  getUniversities: () => request('/universities'),
  getRepairs: () => request('/repairs'),

  createServiceRequest: (payload) =>
    request('/services', { method: 'POST', body: JSON.stringify(payload) }),

  getServiceTypes: () => request('/service-types'),

  getProviders: (serviceName = '') => {
    const q = serviceName ? `?service=${encodeURIComponent(serviceName)}` : ''
    return request(`/providers${q}`)
  },

  getMyServiceRequests: (userId) =>
    request(`/services?user_id=${encodeURIComponent(userId)}`),

  getRepairsFor: (userId) =>
    request(`/repairs?user_id=${encodeURIComponent(userId)}`),

  async createCheckout(orderData) {
    const response = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  },

  async getOrder(orderId) {
    const response = await fetch(`${API_BASE}/orders/${orderId}`)
    if (!response.ok) throw new Error('Failed to fetch order')
    return response.json()
  },

  // Simulate the Ozow webhook so the payment row flips to 'complete' and
  // the order becomes 'paid' in the demo.
  async simulatePayment(orderId) {
    const response = await fetch(`${API_BASE}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        m_payment_id: orderId,
        payment_status: 'COMPLETE',
      }),
    })
    if (!response.ok) throw new Error('Payment simulation failed')
    return response.text()
  },

  async releaseEscrow(orderId) {
    const response = await fetch(`${API_BASE}/orders/${orderId}/release`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  },
}

// ------------------------------------------------------------
// Role mapping — the backend ENUM uses underscores, the UI doesn't.
// Without this map, login returns 403 for provider / resmanager.
// ------------------------------------------------------------
export const roleMap = {
  student: 'student',
  provider: 'service_provider',
  admin: 'admin',
  resmanager: 'res_manager',
}

// Where to send a user after login, keyed by the backend role value.
export const dashboardRoutes = {
  student: '/student-dashboard',
  service_provider: '/provider-dashboard',
  admin: '/admin',
  res_manager: '/resmanager-dashboard',
}

// ------------------------------------------------------------
// session — persist the logged-in user in localStorage
// ------------------------------------------------------------
export const session = {
  save: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
  },
  get: () => {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      // A malformed or stale value must not stop the app from loading.
      localStorage.removeItem('user')
      return null
    }
  },
  clear: () => {
    localStorage.removeItem('user')
  },
}