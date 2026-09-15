// src/services/api.js
const API_BASE = 'http://localhost:3000/api';

export const api = {
  // Initiate checkout
  async getProducts() {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
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

  // Fetch single order details
  async getOrder(orderId) {
    const response = await fetch(`${API_BASE}/orders/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  // Simulate payment webhook (For testing/demo in Vue)
  async simulatePayment(orderId) {
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
    const response = await fetch(`${API_BASE}/orders/${orderId}/release`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }
};