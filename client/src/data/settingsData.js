import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
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