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

const normalizeOrder = (order) => {
  if (!order) return null;

  const normalizedStatus = order.orderStatus || order.status || "Pending";
  const normalizedItems = (order.items || []).map((item, index) => ({
    ...item,
    id: item.id ?? item._id ?? `${order.id ?? order._id ?? "order"}-${index}`,
    qty: item.quantity ?? item.qty ?? 0,
    price: item.price ?? 0,
    subtotal: item.subtotal ?? (item.price ?? 0) * (item.quantity ?? item.qty ?? 0),
  }));

  const customer = order.customer || (order.user
    ? {
        name: order.user.name || "Customer",
        email: order.user.email || "",
        phone: order.user.phone || "N/A",
        avatar: order.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user.name || order.user.email || "Customer")}&background=F7F0EB&color=23442C`,
      }
    : {
        name: "Customer",
        email: "",
        phone: "N/A",
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
          status: entry.status,
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

export const listOrders = async (params) => {
  const response = await api.get("/orders", { params });
  return normalizeOrderResponse(response);
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return normalizeOrderResponse(response);
};

export const createOrder = (payload) => api.post("/orders", payload);
export const updateOrderStatus = (id, payload) => api.patch(`/orders/${id}/status`, payload);

export default api;
