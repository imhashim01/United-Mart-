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

export const listCoupons = (params) => api.get("/coupons", { params });
export const getCoupon = (id) => api.get(`/coupons/${id}`);
export const createCoupon = (payload) => api.post(`/coupons`, payload);
export const updateCoupon = (id, payload) => api.patch(`/coupons/${id}`, payload);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);

export default api;
