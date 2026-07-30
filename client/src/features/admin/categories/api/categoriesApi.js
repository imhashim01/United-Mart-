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

export const createCategory = (payload) => api.post("/categories", payload);
export const updateCategory = (id, payload) => api.patch(`/categories/${id}`, payload);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const getCategory = (id) => api.get(`/categories/${id}`);

export default api;