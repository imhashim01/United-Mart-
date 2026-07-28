const ORDER_STORAGE_KEY = "united-mart-placed-orders";
const ORDER_STORAGE_UPDATED_EVENT = "orderStorageUpdated";

export const getPersistedOrders = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) ?? "[]");
  } catch (error) {
    console.error("Failed to read persisted orders:", error);
    return [];
  }
};

const setPersistedOrders = (orders) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event(ORDER_STORAGE_UPDATED_EVENT));
  } catch (error) {
    console.error("Failed to write persisted orders:", error);
  }
};

export const persistOrder = (order) => {
  if (typeof window === "undefined") return;
  try {
    const orders = getPersistedOrders();
    const next = [order, ...orders];
    setPersistedOrders(next);
  } catch (error) {
    console.error("Failed to persist order:", error);
  }
};

export const updatePersistedOrder = (orderId, updates, fallbackOrder = null) => {
  if (typeof window === "undefined") return null;
  try {
    const orders = getPersistedOrders();
    let found = false;
    const next = orders.map((order) => {
      const matches = order.id === orderId || order.orderNumber === orderId;
      if (!matches) return order;
      found = true;
      return { ...order, ...updates };
    });

    if (!found && fallbackOrder) {
      next.unshift({ ...fallbackOrder, ...updates });
    }

    setPersistedOrders(next);
    return next;
  } catch (error) {
    console.error("Failed to update persisted order:", error);
    return null;
  }
};

export const getPersistedOrderById = (id) => {
  if (!id) return null;
  return getPersistedOrders().find((order) => order.id === id || order.orderNumber === id) ?? null;
};

export const mergeOrders = (seedOrders) => {
  const persisted = getPersistedOrders();
  const seen = new Set();
  const merged = [];

  persisted.forEach((order) => {
    const key = order.id || order.orderNumber;
    if (!key || seen.has(key)) return;
    seen.add(key);
    merged.push(order);
  });

  seedOrders.forEach((order) => {
    const key = order.id || order.orderNumber;
    if (!key || seen.has(key)) return;
    seen.add(key);
    merged.push(order);
  });

  return merged;
};

export const subscribeOrderStorageUpdates = (callback) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(ORDER_STORAGE_UPDATED_EVENT, callback);
  return () => window.removeEventListener(ORDER_STORAGE_UPDATED_EVENT, callback);
};
