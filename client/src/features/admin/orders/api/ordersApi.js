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

export const listOrders = (params) => api.get("/orders", { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, payload) => api.patch(`/orders/${id}/status`, payload);

export default api;
