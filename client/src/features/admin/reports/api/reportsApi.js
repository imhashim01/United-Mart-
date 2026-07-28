import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getSalesReport = (groupBy = 'day') => api.get(`/reports/sales?groupBy=${groupBy}`);
export const getPaymentMethodsReport = () => api.get('/reports/payment-methods');
export const getOrderStatusReport = () => api.get('/reports/order-status');
export const getInventoryReport = () => api.get('/reports/inventory');
export const getTopCustomers = (limit = 10) => api.get(`/reports/top-customers?limit=${limit}`);
export const generateReport = (data) => api.post('/reports', data);
export const listReports = () => api.get('/reports');
export const getReport = (id) => api.get(`/reports/${id}`);
export const deleteReport = (id) => api.delete(`/reports/${id}`);
