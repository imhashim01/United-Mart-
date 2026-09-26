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

// Both calls are meant to be fire-and-forget from the caller's side (Meta
// Conversions API tracking must never block or break cart/checkout) — the
// backend itself always responds 200 regardless of whether the event
// actually reached Meta.
export const trackAddToCart = (payload) => api.post("/tracking/add-to-cart", payload);
export const trackInitiateCheckout = (payload) => api.post("/tracking/initiate-checkout", payload);

export default api;
