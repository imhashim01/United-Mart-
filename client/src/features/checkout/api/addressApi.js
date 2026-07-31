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

export const addAddress = (payload) => api.post("/users/me/addresses", payload);
export const updateAddress = (addressId, payload) => api.patch(`/users/me/addresses/${addressId}`, payload);
export const deleteAddress = (addressId) => api.delete(`/users/me/addresses/${addressId}`);

export default api;