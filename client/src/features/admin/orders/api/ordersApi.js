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

// Backend enum (orderModel.js orderStatus) <-> admin UI display labels
// (adminData.js ORDER_STATUSES/STATUS_BADGE_VARIANT/ORDER_STATUS_FLOW).
// These MUST stay in sync or badges, the status dropdown, and status
// updates all silently break.
const STATUS_TO_DISPLAY = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Packing",
  shipped: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const DISPLAY_TO_STATUS = Object.fromEntries(
  Object.entries(STATUS_TO_DISPLAY).map(([backend, display]) => [display, backend])
);

const normalizeOrder = (order) => {
  if (!order) return null;

  const normalizedStatus = STATUS_TO_DISPLAY[order.orderStatus] || order.status || "Pending";
  const normalizedItems = (order.items || []).map((item, index) => ({
    ...item,
    id: item.id ?? item._id ?? `${order.id ?? order._id ?? "order"}-${index}`,
    qty: item.quantity ?? item.qty ?? 0,
    price: item.price ?? 0,
    unit: item.variantUnit || item.unit || "",
    subtotal: item.subtotal ?? (item.price ?? 0) * (item.quantity ?? item.qty ?? 0),
  }));

  const shippingPhone = order.shippingAddress?.phone;
  const customer = order.customer || (order.user
    ? {
        name: order.user.name || "Customer",
        email: order.user.email || "",
        phone: shippingPhone || order.user.phone || "N/A",
        avatar: order.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user.name || order.user.email || "Customer")}&background=F7F0EB&color=23442C`,
      }
    : {
        name: "Customer",
        email: "",
        phone: shippingPhone || "N/A",
        avatar: "https://ui-avatars.com/api/?name=Customer&background=F7F0EB&color=23442C",
      });

  const address = order.address || {
    line1: order.shippingAddress?.line1 || "",
    area: order.shippingAddress?.state || order.shippingAddress?.city || "",
    city: order.shippingAddress?.city || "",
  };

  return {
    ...order,
    id: order.id ?? order._id,
    status: normalizedStatus,
    total: order.totalAmount ?? order.total ?? 0,
    subtotal: order.subtotal ?? 0,
    delivery: order.shippingFee ?? order.delivery ?? 0,
    discount: order.discountAmount ?? order.discount ?? 0,
    items: normalizedItems,
    customer,
    address,
    paymentMethod: order.paymentMethod || "cod",
    createdAt: order.createdAt || order.created_at,
    timeline: Array.isArray(order.timeline) && order.timeline.length
      ? order.timeline
      : (Array.isArray(order.statusHistory) ? order.statusHistory.map((entry) => ({
          status: STATUS_TO_DISPLAY[entry.status] || entry.status,
          timestamp: entry.changedAt || entry.timestamp,
          note: entry.note || "",
        })) : [{ status: normalizedStatus, timestamp: order.createdAt || new Date().toISOString(), note: "Order placed" }]),
  };
};

const normalizeOrderResponse = (response) => {
  if (!response?.data) return response;
  if (Array.isArray(response.data.data)) {
    response.data.data = response.data.data.map(normalizeOrder).filter(Boolean);
  } else if (response.data.data && typeof response.data.data === "object") {
    response.data.data = normalizeOrder(response.data.data);
  }
  return response;
};

export const listOrders = async (params = {}) => {
  const safeParams = { ...params };
  if (safeParams.limit == null || safeParams.limit > 100) {
    safeParams.limit = 100;
  }
  const response = await api.get("/orders", { params: safeParams });
  return normalizeOrderResponse(response);
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return normalizeOrderResponse(response);
};

export const createOrder = (payload) => api.post("/orders", payload);

export const updateOrderStatus = (id, payload) => {
  // Translate the admin UI's display label back to the backend's enum
  // value before sending — the backend only accepts lowercase enum values.
  const backendStatus = DISPLAY_TO_STATUS[payload.status] || payload.status;
  return api.patch(`/orders/${id}/status`, { ...payload, status: backendStatus });
};

export default api;