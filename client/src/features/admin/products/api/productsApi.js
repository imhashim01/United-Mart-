import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

export const createProduct = (payload) => api.post('/products', payload);
export const updateProduct = (id, payload) => api.patch(`/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getProduct = (id) => api.get(`/products/${id}`);

export default api;
