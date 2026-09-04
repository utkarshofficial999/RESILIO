import axios from 'axios';

const BACKEND_HOST = import.meta.env?.VITE_BACKEND_HOST || 'localhost:8000';
export const API_BASE_URL = `http://${BACKEND_HOST}/api/v1`;
export const WS_LOGS_URL = `ws://${BACKEND_HOST}/ws/agent-logs`;

export const api = {
  getHealth: async () => {
    const res = await axios.get(`${API_BASE_URL}/health`);
    return res.data;
  },

  processFailure: async (payload) => {
    const res = await axios.post(`${API_BASE_URL}/recovery/process`, payload);
    return res.data;
  },

  getTelemetry: async () => {
    const res = await axios.get(`${API_BASE_URL}/telemetry`);
    return res.data;
  },

  injectOutage: async (bankName = 'HDFC', successRate = 0.42) => {
    const res = await axios.post(`${API_BASE_URL}/telemetry/inject-outage?bank_name=${bankName}&success_rate=${successRate}`);
    return res.data;
  },

  resetTelemetry: async () => {
    const res = await axios.post(`${API_BASE_URL}/telemetry/reset`);
    return res.data;
  },

  getAnalytics: async () => {
    const res = await axios.get(`${API_BASE_URL}/analytics`);
    return res.data;
  },

  runABSimulation: async (totalTransactions = 1000, outageBank = null) => {
    const res = await axios.post(`${API_BASE_URL}/demo/run`, {
      total_transactions: totalTransactions,
      outage_bank: outageBank
    });
    return res.data;
  },

  // Razorpay Real Checkout APIs
  getRazorpayKey: async () => {
    const res = await axios.get(`${API_BASE_URL}/razorpay/key`);
    return res.data;
  },

  createRazorpayOrder: async (amountInCents, currency = 'INR') => {
    const res = await axios.post(`${API_BASE_URL}/razorpay/create-order`, {
      amount_in_cents: amountInCents,
      currency: currency,
      customer_id: 'cust_live_demo',
      merchant_id: 'merch_hackathon_001'
    });
    return res.data;
  },

  verifyPayment: async (paymentId, orderId) => {
    const res = await axios.post(`${API_BASE_URL}/razorpay/verify-payment?payment_id=${paymentId}&order_id=${orderId}`);
    return res.data;
  }
};

