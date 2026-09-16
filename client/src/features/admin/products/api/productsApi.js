import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// The backend accepts either a cookie or an Authorization: Bearer header —
// this app only ever gets the token in the login response body and stores
// it in localStorage, so it must be attached explicitly on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const listProducts = (params) => api.get('/products', { params });
export const createProduct = (payload) => api.post('/products', payload);
export const updateProduct = (id, payload) => api.patch(`/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getProduct = (id) => api.get(`/products/${id}`);
export const uploadProductImages = (id, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  return api.post(`/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const removeProductImage = (id, publicId) =>
  api.delete(`/products/${id}/images/${encodeURIComponent(publicId)}`);
export const uploadVariantImages = (id, variantId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  return api.post(`/products/${id}/variants/${variantId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const removeVariantImage = (id, variantId, publicId) =>
  api.delete(`/products/${id}/variants/${variantId}/images/${encodeURIComponent(publicId)}`);

export default api;