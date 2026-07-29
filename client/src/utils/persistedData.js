const STORAGE_KEYS = {
  products: "ums-products",
  brandNames: "ums-brand-names",
  brandObjects: "ums-brand-objects",
  categoryNames: "ums-category-names",
  categoryObjects: "ums-category-objects",
  coupons: "ums-coupons",
  adminUsers: "ums-admin-users",
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

export const getPersistedProducts = (seedProducts) => readPersistedData(STORAGE_KEYS.products, seedProducts);
export const persistProducts = (products) => writePersistedData(STORAGE_KEYS.products, products);

// Flat string list — used by productsData.js for the Shop filter sidebar
export const getPersistedBrandNames = (seedBrands) => readPersistedData(STORAGE_KEYS.brandNames, seedBrands);
export const persistBrandNames = (brands) => writePersistedData(STORAGE_KEYS.brandNames, brands);

// Full brand objects — used by the admin Brands page
export const getPersistedBrandObjects = (seedBrands) => readPersistedData(STORAGE_KEYS.brandObjects, seedBrands);
export const persistBrandObjects = (brands) => writePersistedData(STORAGE_KEYS.brandObjects, brands);

export const getPersistedCategoryNames = (seedCategories) => readPersistedData(STORAGE_KEYS.categoryNames, seedCategories);
export const persistCategoryNames = (categories) => writePersistedData(STORAGE_KEYS.categoryNames, categories);

export const getPersistedCategoryObjects = (seedCategories) => readPersistedData(STORAGE_KEYS.categoryObjects, seedCategories);
export const persistCategoryObjects = (categories) => writePersistedData(STORAGE_KEYS.categoryObjects, categories);

export const getPersistedCoupons = (seedCoupons) => readPersistedData(STORAGE_KEYS.coupons, seedCoupons);
export const persistCoupons = (coupons) => writePersistedData(STORAGE_KEYS.coupons, coupons);

export const getPersistedAdminUsers = (seedUsers) => readPersistedData(STORAGE_KEYS.adminUsers, seedUsers);
export const persistAdminUsers = (users) => writePersistedData(STORAGE_KEYS.adminUsers, users);