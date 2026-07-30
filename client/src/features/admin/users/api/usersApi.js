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

export const listUsers = (params) => api.get("/users", { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const setActiveStatus = (id, isActive) => api.patch(`/users/${id}/status`, { isActive });
export const setRole = (id, role) => api.patch(`/users/${id}/role`, { role });

export default api;
