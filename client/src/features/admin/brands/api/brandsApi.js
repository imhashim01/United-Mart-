import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

export const createBrand = (payload) => api.post("/brands", payload);
export const updateBrand = (id, payload) => api.patch(`/brands/${id}`, payload);
export const deleteBrand = (id) => api.delete(`/brands/${id}`);
export const getBrand = (id) => api.get(`/brands/${id}`);

export default api;