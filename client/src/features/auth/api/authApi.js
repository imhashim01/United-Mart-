import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (payload) => api.post('/auth/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const logoutUser = () => api.post('/auth/logout');
export const verifyEmail = (token) => api.post('/auth/verify-email', { token });
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = ({ token, password }) => api.post('/auth/reset-password', { token, password });
export const getMe = () => api.get('/auth/me');

export const addMyAddress = (payload) => api.post('/users/me/addresses', payload);
export const updateMyAddress = (addressId, payload) => api.patch(`/users/me/addresses/${addressId}`, payload);
export const deleteMyAddress = (addressId) => api.delete(`/users/me/addresses/${addressId}`);

export default api;