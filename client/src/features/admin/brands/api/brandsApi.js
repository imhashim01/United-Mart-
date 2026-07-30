import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

// The backend accepts either a cookie or an Authorization: Bearer header —
// this app only ever gets the token in the login response body and stores
// it in localStorage, so it must be attached explicitly on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createBrand = (payload) => api.post("/brands", payload);
export const updateBrand = (id, payload) => api.patch(`/brands/${id}`, payload);
export const deleteBrand = (id) => api.delete(`/brands/${id}`);
export const getBrand = (id) => api.get(`/brands/${id}`);

export default api;