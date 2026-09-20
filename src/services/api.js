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

const API_BASE = import.meta.env.VITE_API_URL || 'https://campusswap-backend-kk9v.onrender.com/api';

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
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (userData) => {
    if (USE_MOCK) return mock(mockUser(userData && userData.email, userData && userData.role));
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  // used by all 4 dashboards' "Update Password" button
  changePassword: async (userId, currentPassword, newPassword) => {
    if (USE_MOCK) return mock({ success: true });
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Password change failed');
    return data;
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
    const res = await fetch(`${API_BASE}/home`);
    if (!res.ok) throw new Error('Failed to load home data');
    return res.json();
  }
};

// ------------------------------------------------------------
// DASHBOARDS — mine (one per role)
// ------------------------------------------------------------
export const dashAPI = {
  getStudent: async (userId) => {
    if (USE_MOCK) return mock(studentDashboard);
    const res = await fetch(`${API_BASE}/dashboards/student/${userId}`);
    if (!res.ok) throw new Error('Failed to load student dashboard');
    return res.json();
  },

  getAdmin: async () => {
    if (USE_MOCK) return mock(adminDashboard);
    const res = await fetch(`${API_BASE}/dashboards/admin`);
    if (!res.ok) throw new Error('Failed to load admin dashboard');
    return res.json();
  },

  getResManager: async () => {
    if (USE_MOCK) return mock(resManagerDashboard);
    const res = await fetch(`${API_BASE}/dashboards/res-manager`);
    if (!res.ok) throw new Error('Failed to load res manager dashboard');
    return res.json();
  },

  getProvider: async (providerId) => {
    if (USE_MOCK) return mock(providerDashboard);
    const res = await fetch(`${API_BASE}/dashboards/provider/${providerId}`);
    if (!res.ok) throw new Error('Failed to load provider dashboard');
    return res.json();
  }
};

// ------------------------------------------------------------
// SHOP / CHECKOUT — teammate's stuff (left exactly as it was)
// ------------------------------------------------------------
export const api = {
  // Initiate checkout
  async getProducts() {
    if (USE_MOCK) return mock(featuredProducts);
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
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
