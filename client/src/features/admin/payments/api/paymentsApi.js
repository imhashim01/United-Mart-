import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const listPayments = (params) => api.get("/payments", { params });
export const getPayment = (id) => api.get(`/payments/${id}`);
export const updatePaymentStatus = (id, payload) => api.patch(`/payments/${id}/status`, payload);
export const refundPayment = (id, payload) => api.post(`/payments/${id}/refund`, payload);

export default api;
