import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

// The admin Settings page re-syncs through this same loader after a save;
// without the token attached, that request carries no Authorization header
// and the backend's cachePublic middleware can serve it a stale, pre-edit
// response from Vercel's edge cache instead of the value just saved.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const DEFAULTS = {
  storeName: "United Mart Sukkur",
  supportEmail: "support@unitedmartsukkur.pk",
  supportPhone: "+92 300 1234567",
  address: "Station Road, Sukkur, Sindh, Pakistan",
  deliveryFlatRate: 200,
  freeDeliveryThreshold: 5000,
  minimumOrderAmount: 1000,
  orderCutoffTime: "16:00",
};

let cachedSettings = { ...DEFAULTS };

export const loadSettings = async () => {
  try {
    const { data } = await api.get("/settings");
    cachedSettings = { ...DEFAULTS, ...data.data };
  } catch (error) {
    console.error("Failed to load settings, using defaults:", error?.response?.data || error.message);
  }
  return cachedSettings;
};

export const refreshSettings = loadSettings;
export const getSettings = () => cachedSettings;