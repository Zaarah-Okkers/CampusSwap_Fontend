// src/services/api.js

const API_BASE = 'http://localhost:3000/api';

export const authAPI = {
  login: async (email, password, role) => {
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
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  changePassword: async (userId, currentPassword, newPassword) => {
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

export const homeAPI = {
  getHomeData: async () => {
    const res = await fetch(`${API_BASE}/home`);
    if (!res.ok) throw new Error('Failed to load home data');
    return res.json();
  }
};

export const dashAPI = {
  getStudent: async (userId) => {
    const res = await fetch(`${API_BASE}/dashboards/student/${userId}`);
    if (!res.ok) throw new Error('Failed to load student dashboard');
    return res.json();
  },

  getAdmin: async () => {
    const res = await fetch(`${API_BASE}/dashboards/admin`);
    if (!res.ok) throw new Error('Failed to load admin dashboard');
    return res.json();
  },

  getResManager: async () => {
    const res = await fetch(`${API_BASE}/dashboards/res-manager`);
    if (!res.ok) throw new Error('Failed to load res manager dashboard');
    return res.json();
  },

  getProvider: async (providerId) => {
    const res = await fetch(`${API_BASE}/dashboards/provider/${providerId}`);
    if (!res.ok) throw new Error('Failed to load provider dashboard');
    return res.json();
  }
};

export const api = {
  async getProducts() {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },
  async getUniversities() {
    const res = await fetch(`${API_BASE}/universities`);
    if (!res.ok) throw new Error('Failed to fetch universities');
    return res.json();
  },
  async getRepairs() {
    const res = await fetch(`${API_BASE}/repairs`);
    if (!res.ok) throw new Error('Failed to fetch repairs');
    return res.json();
  },
  async createCheckout(orderData) {
    const response = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async getOrder(orderId) {
    const response = await fetch(`${API_BASE}/orders/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  async simulatePayment(orderId) {
    const response = await fetch(`${API_BASE}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ m_payment_id: orderId, payment_status: 'COMPLETE' }),
    });
    if (!response.ok) throw new Error('Payment simulation failed');
    return response.text();
  },

  async releaseEscrow(orderId) {
    const response = await fetch(`${API_BASE}/orders/${orderId}/release`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }
};

export const roleMap = {
  student: 'student',
  provider: 'service_provider',
  admin: 'admin',
  resmanager: 'res_manager'
};

export const dashboardRoutes = {
  student: '/student-dashboard',
  service_provider: '/provider-dashboard',
  admin: '/admin-dashboard',
  res_manager: '/resmanager-dashboard'
};

export const LOGOUT_MESSAGES = {
  student:          'Session terminated. Go touch grass.',
  service_provider: 'Mission accomplished. Over and Out chief.',
  admin:            'God mode disabled.',
  res_manager:      'Game saved. Player 1 has left the lobby.'
};

export const session = {
  save: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    if (user?.role) localStorage.setItem('userRole', user.role);
    localStorage.setItem('isLoggedIn', 'true');
    window.dispatchEvent(new CustomEvent('campus-swap-auth-change'));
  },
  get: () => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },
  clear: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    window.dispatchEvent(new CustomEvent('campus-swap-auth-change'));
  }
};
