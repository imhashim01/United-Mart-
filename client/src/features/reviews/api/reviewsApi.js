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

export const getProductReviews = (productId, params) => api.get(`/reviews/product/${productId}`, { params });
export const createReview = (payload) => api.post("/reviews", payload);
export const updateReview = (id, payload) => api.patch(`/reviews/${id}`, payload);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

export default api;