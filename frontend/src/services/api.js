import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

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
  }
};
