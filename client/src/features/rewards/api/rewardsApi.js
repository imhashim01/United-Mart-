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

export const getUserRewards = () => api.get('/rewards/me');
export const getRewardHistory = () => api.get('/rewards/me/history');
export const getUserRedemptions = () => api.get('/rewards/me/redemptions');
export const getRewardDashboard = () => api.get('/rewards/me/dashboard');
export const earnPoints = (data) => api.post('/rewards/earn', data);
export const redeemGift = (data) => api.post('/rewards/redeem', data);
export const getRewardRules = () => api.get('/rewards/rules');
export const updateRewardRules = (data) => api.put('/rewards/rules', data);
export const getGiftLevels = () => api.get('/rewards/gifts');
export const updateGiftLevel = (id, data) => api.put(`/rewards/gifts/${id}`, data);
export const addGiftLevel = (data) => api.post('/rewards/gifts', data);
export const getAllRedemptions = () => api.get('/rewards/admin/redemptions');
