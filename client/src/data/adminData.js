import { mergeOrders } from "../utils/orderStorage";
import { getPersistedBrandObjects, getPersistedCoupons, getPersistedAdminUsers } from "../utils/persistedData";

// Mock data for the Admin Dashboard. Replace with TanStack Query hooks
// hitting real /api/v1/admin/* endpoints once the backend modules are built.

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Packing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

// Ordered progression for the stepper — Cancelled is a terminal branch, not a step.
export const ORDER_STATUS_FLOW = ["Pending", "Confirmed", "Packing", "Out for Delivery", "Delivered"];

export const STATUS_BADGE_VARIANT = {
  Pending: "warning",
  Confirmed: "info",
  Packing: "info",
  "Out for Delivery": "accent",
  Delivered: "success",
  Cancelled: "danger",
};

const CUSTOMER_NAMES = [
  "Ayesha Raza", "Bilal Ahmed", "Sana Khan", "Farhan Malik", "Mahnoor Iqbal",
  "Usman Tariq", "Hira Baig", "Zeeshan Qureshi", "Nida Farooq", "Omar Siddiqui",
  "Kiran Aslam", "Danish Sheikh",
];

function makeTimeline(status) {
  const flow = ORDER_STATUS_FLOW;
  const idx = status === "Cancelled" ? 1 : flow.indexOf(status);
  const base = new Date();
  base.setDate(base.getDate() - 2);

  const timeline = [];
  for (let i = 0; i <= (status === "Cancelled" ? idx : idx); i++) {
    const t = new Date(base);
    t.setHours(t.getHours() + i * 5);
    timeline.push({
      status: flow[i],
      timestamp: t.toISOString(),
      note:
        flow[i] === "Pending"
          ? "Order placed by customer"
          : flow[i] === "Confirmed"
          ? "Payment verified, order confirmed"
          : flow[i] === "Packing"
          ? "Items being picked and packed"
          : flow[i] === "Out for Delivery"
          ? "Rider dispatched from Sukkur hub"
          : "Delivered and signed for",
    });
  }
  if (status === "Cancelled") {
    const t = new Date(base);
    t.setHours(t.getHours() + 8);
    timeline.push({
      status: "Cancelled",
      timestamp: t.toISOString(),
      note: "Cancelled — customer requested cancellation",
    });
  }
  return timeline;
}

function makeOrderItems(seed) {
  const catalog = [
    { name: "Sindhri Mangoes (Crate 5kg)", price: 1450, unit: "1 crate", image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=200&q=80" },
    { name: "Sella Basmati Rice", price: 1950, unit: "5kg bag", image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200&q=80" },
    { name: "Full Cream Milk", price: 320, unit: "1.5L pack", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80" },
    { name: "Free-Range Chicken Eggs", price: 420, unit: "Tray of 12", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&q=80" },
    { name: "Sunflower Cooking Oil", price: 980, unit: "3L bottle", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80" },
    { name: "Chicken Breast Fillet", price: 890, unit: "1kg pack", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&q=80" },
  ];
  const count = (seed % 3) + 1;
  const items = [];
  for (let i = 0; i < count; i++) {
    const item = catalog[(seed + i) % catalog.length];
    items.push({ ...item, qty: ((seed + i) % 3) + 1 });
  }
  return items;
}

const seedOrders = Array.from({ length: 42 }).map((_, i) => {
  const status = ORDER_STATUSES[i % ORDER_STATUSES.length === 5 && i % 7 !== 0 ? 4 : i % ORDER_STATUSES.length];
  const items = makeOrderItems(i + 1);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const delivery = subtotal >= 3000 ? 0 : 150;
  const discount = i % 5 === 0 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + delivery - discount;
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - (i % 14));
  createdAt.setHours(9 + (i % 10));

  return {
    id: `UMS-${100200 + i}`,
    customer: {
      name: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
      email: `${CUSTOMER_NAMES[i % CUSTOMER_NAMES.length].toLowerCase().replace(" ", ".")}@example.com`,
      phone: `03${String(100000000 + i * 137).slice(0, 9)}`,
      avatar: `https://i.pravatar.cc/100?img=${(i * 5) % 70}`,
    },
    address: {
      line1: `House ${12 + i}, Station Road`,
      area: i % 2 === 0 ? "Model Colony" : "Barrage Colony",
      city: "Sukkur",
    },
    items,
    subtotal,
    delivery,
    discount,
    total,
    paymentMethod: ["Cash on Delivery", "JazzCash", "EasyPaisa", "Bank Transfer"][i % 4],
    status,
    timeline: makeTimeline(status),
    createdAt: createdAt.toISOString(),
  };
});

export const orders = mergeOrders(seedOrders);
export const getAdminOrders = () => mergeOrders(seedOrders);

export const getOrderById = (id) => getAdminOrders().find((o) => o.id === id);

// ---- Customers ----
const buildAdminCustomers = (ordersList) => {
  const customersMap = new Map();

  ordersList.forEach((order) => {
    const key = order.customer.email.toLowerCase();
    const existing = customersMap.get(key);

    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += order.total;
      existing.joinedAt = existing.joinedAt < order.createdAt ? existing.joinedAt : order.createdAt;
    } else {
      customersMap.set(key, {
        id: `cust-${customersMap.size + 1}`,
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        avatar: order.customer.avatar,
        ordersCount: 1,
        totalSpent: order.total,
        joinedAt: order.createdAt,
        status: "Active",
      });
    }
  });

  return Array.from(customersMap.values());
};

export const customers = buildAdminCustomers(orders);
export const getAdminCustomers = () => buildAdminCustomers(getAdminOrders());

// ---- Brands ----
const seedAdminBrands = [
  { id: "b1", name: "National Foods", productsCount: 24, status: "Active", logo: "https://logo.clearbit.com/nationalfoods.pk" },
  { id: "b2", name: "Shan Foods", productsCount: 18, status: "Active", logo: "https://logo.clearbit.com/shanfoods.com" },
  { id: "b3", name: "Nestlé", productsCount: 31, status: "Active", logo: "https://logo.clearbit.com/nestle.com" },
  { id: "b4", name: "Engro Foods", productsCount: 15, status: "Active", logo: "https://logo.clearbit.com/engrofoods.com" },
  { id: "b5", name: "Unilever", productsCount: 22, status: "Active", logo: "https://logo.clearbit.com/unilever.com" },
  { id: "b6", name: "Olpers", productsCount: 9, status: "Inactive", logo: "https://logo.clearbit.com/olpers.com" },
];

export const adminBrands = getPersistedBrandObjects(seedAdminBrands);

// ---- Coupons ----
const seedAdminCoupons = [
  { id: "c1", code: "FRESH10", type: "percent", value: 10, minSpend: 1000, usedCount: 142, maxUses: 500, expiresAt: "2026-08-31", status: "Active" },
  { id: "c2", code: "SAVE200", type: "flat", value: 200, minSpend: 1500, usedCount: 89, maxUses: 300, expiresAt: "2026-08-15", status: "Active" },
  { id: "c3", code: "MANGO24", type: "percent", value: 24, minSpend: 2000, usedCount: 267, maxUses: 400, expiresAt: "2026-07-31", status: "Active" },
  { id: "c4", code: "WELCOME50", type: "flat", value: 50, minSpend: 500, usedCount: 512, maxUses: 500, expiresAt: "2026-06-30", status: "Expired" },
];

export const adminCoupons = getPersistedCoupons(seedAdminCoupons);

// ---- Reward Program tiers ----
export const rewardTiers = [
  { id: "t1", name: "Bronze", minSpend: 0, pointsMultiplier: 1, perks: ["1 point per Rs 100 spent"], membersCount: 1840 },
  { id: "t2", name: "Silver", minSpend: 25000, pointsMultiplier: 1.25, perks: ["1.25x points", "Free delivery over Rs 2000"], membersCount: 620 },
  { id: "t3", name: "Gold", minSpend: 75000, pointsMultiplier: 1.5, perks: ["1.5x points", "Free delivery always", "Early access to deals"], membersCount: 184 },
];

// ---- Payments ----
export const payments = orders.slice(0, 20).map((o, i) => ({
  id: `PAY-${5000 + i}`,
  orderId: o.id,
  customer: o.customer.name,
  method: o.paymentMethod,
  amount: o.total,
  status: o.status === "Cancelled" ? "Refunded" : o.paymentMethod === "Cash on Delivery" && o.status !== "Delivered" ? "Pending" : "Paid",
  date: o.createdAt,
}));

// ---- Admins / Staff ----
// ---- Admins / Staff ----
const seedAdminUsers = [
  { id: "u1", name: "Hashim Ahmed", email: "hashim@unitedmartsukkur.pk", role: "admin", status: "Active", avatar: "https://i.pravatar.cc/100?img=11", lastActive: "2026-07-25T09:00:00Z" },
  { id: "u2", name: "Mumtaz Ahmad", email: "mumtaz@unitedmartsukkur.pk", role: "manager", status: "Active", avatar: "https://i.pravatar.cc/100?img=15", lastActive: "2026-07-24T18:30:00Z" },
  { id: "u3", name: "Hassam Saqib", email: "hassam@unitedmartsukkur.pk", role: "manager", status: "Active", avatar: "https://i.pravatar.cc/100?img=22", lastActive: "2026-07-23T14:15:00Z" },
];

export const adminUsers = getPersistedAdminUsers(seedAdminUsers);

// ---- Chart data for Dashboard Analytics ----
export const revenueByDay = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Math.round(35000 + Math.random() * 45000 + (i > 9 ? 15000 : 0)),
    orders: Math.round(18 + Math.random() * 22),
  };
});

export const salesByCategory = [
  { name: "Fruits & Vegetables", value: 285000 },
  { name: "Dairy & Eggs", value: 198000 },
  { name: "Grocery", value: 342000 },
  { name: "Meat & Seafood", value: 156000 },
  { name: "Bakery", value: 89000 },
  { name: "Beverages", value: 121000 },
];

export const ordersByStatus = ORDER_STATUSES.map((status) => ({
  status,
  count: orders.filter((o) => o.status === status).length,
}));

export const topProducts = [
  { name: "Sella Basmati Rice", sold: 412, revenue: 803400 },
  { name: "Sindhri Mangoes (Crate 5kg)", sold: 356, revenue: 516200 },
  { name: "Full Cream Milk", sold: 891, revenue: 285120 },
  { name: "Free-Range Chicken Eggs", sold: 623, revenue: 261660 },
  { name: "Sunflower Cooking Oil", sold: 298, revenue: 292040 },
];

export const dashboardStats = {
  totalRevenue: revenueByDay.reduce((s, d) => s + d.revenue, 0),
  totalOrders: orders.length,
  totalCustomers: customers.length,
  avgOrderValue: Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length),
  revenueChangePct: 12.4,
  ordersChangePct: 8.1,
  customersChangePct: 5.6,
  aovChangePct: -2.3,
};
