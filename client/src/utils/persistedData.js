// Local-only UI preferences that have no backend module of their own
// (store contact info, demo coupons, demo admin users). Product, category,
// and brand data is NOT persisted here anymore — that all lives in
// MongoDB and is read through data/productsData.js's live cache instead,
// so every device sees the same data instead of each browser's own copy.
const STORAGE_KEYS = {
  coupons: "ums-coupons",
  adminUsers: "ums-admin-users",
  settings: "ums-settings",
};

const readPersistedData = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (error) {
    console.error(`Failed to parse persisted data for ${key}:`, error);
    return fallback;
  }
};

const writePersistedData = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to persist data for ${key}:`, error);
  }
};

export const getPersistedCoupons = (seedCoupons) => readPersistedData(STORAGE_KEYS.coupons, seedCoupons);
export const persistCoupons = (coupons) => writePersistedData(STORAGE_KEYS.coupons, coupons);

export const getPersistedAdminUsers = (seedUsers) => readPersistedData(STORAGE_KEYS.adminUsers, seedUsers);
export const persistAdminUsers = (users) => writePersistedData(STORAGE_KEYS.adminUsers, users);

export const getPersistedSettings = (seedSettings) => readPersistedData(STORAGE_KEYS.settings, seedSettings);
export const persistSettings = (settings) => writePersistedData(STORAGE_KEYS.settings, settings);