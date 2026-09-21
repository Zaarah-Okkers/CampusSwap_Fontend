// src/services/api.js
// shared file
// backend runs on :3000 for everyone now
import {
  featuredProducts,
  categories,
  universities,
  studentDashboard,
  adminDashboard,
  resManagerDashboard,
  providerDashboard,
  mockUser,
} from './mockData';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || data.error || `Request failed (${response.status})`)
  return data
}

// ------------------------------------------------------------------
// RUN WITHOUT THE BACKEND
// While USE_MOCK is true every call below resolves from local dummy
// data in ./mockData.js instead of hitting :3000, so the UI is fully
// usable with no server running. Flip it to false to talk to the real
// backend again — no other change is needed anywhere in the app.
// ------------------------------------------------------------------
export const USE_MOCK = false;

// Small helper so mocked calls still look asynchronous to callers.
const mock = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), 120));

// ------------------------------------------------------------
// AUTH — (login, register, change password)
// ------------------------------------------------------------
export const authAPI = {
  login: async (email, password, role) => {
    if (USE_MOCK) return mock(mockUser(email, roleMap[role] || role));
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });
  },

  register: async (userData) => {
    if (USE_MOCK) return mock(mockUser(userData && userData.email, userData && userData.role));
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // used by all 4 dashboards' "Update Password" button
  changePassword: async (userId, currentPassword, newPassword) => {
    if (USE_MOCK) return mock({ success: true });
    return request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ userId, currentPassword, newPassword })
    });
  }
};

// ------------------------------------------------------------
// HOME — mine (featured products, categories, universities)
// ------------------------------------------------------------
export const homeAPI = {
  getHomeData: async () => {
    if (USE_MOCK) {
      return mock({ featuredProducts, categories, universities });
    }
    return request('/home');
  }
};

// ------------------------------------------------------------
// DASHBOARDS — mine (one per role)
// ------------------------------------------------------------
export const dashAPI = {
  getStudent: async (userId) => {
    if (USE_MOCK) return mock(studentDashboard);
    return request(`/dashboards/student/${userId}`);
  },

  getAdmin: async () => {
    if (USE_MOCK) return mock(adminDashboard);
    return request('/dashboards/admin');
  },

  getResManager: async () => {
    if (USE_MOCK) return mock(resManagerDashboard);
    return request('/dashboards/res-manager');
  },

  getProvider: async (providerId) => {
    if (USE_MOCK) return mock(providerDashboard);
    return request(`/dashboards/provider/${providerId}`);
  }
};

// ------------------------------------------------------------
// SHOP / CHECKOUT — teammate's stuff (left exactly as it was)
// ------------------------------------------------------------
export const api = {
  // Initiate checkout
  async getProducts() {
    if (USE_MOCK) return mock(featuredProducts);
    return request('/products');
  },
  getUniversities() {
    if (USE_MOCK) return mock(universities);
    return request('/universities');
  },
  getRepairs() {
    if (USE_MOCK) return mock([]);
    return request('/repairs');
  },
  createServiceRequest(payload) {
    return request('/services', { method: 'POST', body: JSON.stringify(payload) });
  },
  getServiceTypes() {
    return request('/service-types');
  },
  getProviders(serviceName = '') {
    const q = serviceName ? `?service=${encodeURIComponent(serviceName)}` : '';
    return request(`/providers${q}`);
  },
  getMyServiceRequests(userId) {
    return request(`/services?user_id=${encodeURIComponent(userId)}`);
  },
  getRepairsFor(userId) {
    return request(`/repairs?user_id=${encodeURIComponent(userId)}`);
  },
  async createCheckout(orderData) {
    if (USE_MOCK) {
      return mock({
        id: `ORD-${Date.now()}`,
        ...orderData,
        status: 'pending_payment',
        message: 'Mock checkout created (no backend).',
      });
    }
    const response = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  // Fetch single order details
  async getOrder(orderId) {
    if (USE_MOCK) {
      return mock({
        id: orderId,
        status: 'pending_payment',
        items: [],
        total: 0,
        message: 'Mock order (no backend).',
      });
    }
    const response = await fetch(`${API_BASE}/orders/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  // Simulate payment webhook (For testing/demo in Vue)
  async simulatePayment(orderId) {
    if (USE_MOCK) return mock('OK');
    const response = await fetch(`${API_BASE}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ m_payment_id: orderId, payment_status: 'COMPLETE' }),
    });
    if (!response.ok) throw new Error('Payment simulation failed');
    return response.text();
  },

  // Release escrow funds
  async releaseEscrow(orderId) {
    if (USE_MOCK) return mock({ id: orderId, status: 'released' });
    const response = await fetch(`${API_BASE}/orders/${orderId}/release`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }
};

// ------------------------------------------------------------
// role stuff — backend ENUM is different from our UI labels
// student  → student
// provider → service_provider
// admin    → admin
// resmanager → res_manager
// without this map, login returns 403 for provider / resmanager
// ------------------------------------------------------------
export const roleMap = {
  student: 'student',
  provider: 'service_provider',
  admin: 'admin',
  resmanager: 'res_manager'
};

// where to send the user after login based on what backend returns
export const dashboardRoutes = {
  student: '/student-dashboard',
  service_provider: '/provider-dashboard',
  admin: '/admin-dashboard',
  res_manager: '/resmanager-dashboard'
};

// ------------------------------------------------------------
// session — keep the logged-in user in localStorage
// dashboards read from this to know who is logged in
// ------------------------------------------------------------
export const session = {
  save: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  get: () => {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      // A malformed or stale browser value must not prevent the app loading.
      localStorage.removeItem('user');
      return null;
    }
  },
  clear: () => {
    localStorage.removeItem('user');
  }
};
