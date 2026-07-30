import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import { ORDER_STATUSES } from "../../data/adminData";
import * as ordersApi from "../../features/admin/orders/api/ordersApi";
import { formatPrice } from "../../utils/formatCurrency";

const CATEGORY_COLORS = ["#173A2E", "#E8A33D", "#2A6FA8", "#2F8556", "#C97A1E", "#5A5F5B"];
const STATUS_COLORS = {
  Pending: "#C97A1E",
  Confirmed: "#2A6FA8",
  Packing: "#2A6FA8",
  "Out for Delivery": "#E8A33D",
  Delivered: "#2F8556",
  Cancelled: "#C4392C",
};

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-border rounded-[var(--radius-lg)] p-5">
      <p className="text-sm font-semibold text-charcoal-900">{title}</p>
      {subtitle && <p className="text-xs text-charcoal-600 mb-4">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await ordersApi.listOrders({ limit: 100 });
        setOrders(data.data || []);
        setLoadError(null);
      } catch (error) {
        const message = error?.response?.data?.message || error.message || "Unknown error";
        console.error("Failed to fetch dashboard orders:", error?.response?.data || error);
        setLoadError(message);
        toast.error(`Couldn't load orders: ${message}`);
      }
    })();
  }, []);

  const totals = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map((order) => order.customer?.email?.toLowerCase())).size;
    const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers: uniqueCustomers,
      avgOrderValue,
    };
  }, [orders]);

  const revenueChartData = useMemo(() => {
    const ordersByDay = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[date] = acc[date] || { date, revenue: 0, orders: 0 };
      acc[date].revenue += order.total || 0;
      acc[date].orders += 1;
      return acc;
    }, {});

    return Object.values(ordersByDay).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [orders]);

  const salesByCategory = useMemo(() => {
    const categoryMap = orders.reduce((acc, order) => {
      (order.items || []).forEach((item) => {
        const category = item.category || "Other";
        acc[category] = (acc[category] || 0) + (item.subtotal || item.price * item.qty || 0);
      });
      return acc;
    }, {});

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [orders]);

  const topProducts = useMemo(() => {
    const productMap = orders.reduce((acc, order) => {
      (order.items || []).forEach((item) => {
        const key = item.name || item.id || "Unknown product";
        if (!acc[key]) {
          acc[key] = {
            name: key,
            sold: 0,
            revenue: 0,
          };
        }
        const qty = item.qty || 0;
        const subtotal = item.subtotal || item.price * qty || 0;
        acc[key].sold += qty;
        acc[key].revenue += subtotal;
      });
      return acc;
    }, {});

    return Object.values(productMap).sort((a, b) => b.sold - a.sold).slice(0, 5);
  }, [orders]);

  const statusChartData = useMemo(() => {
    const counts = ORDER_STATUSES.map((status) => ({ status, count: 0 }));
    orders.forEach((order) => {
      const item = counts.find((entry) => entry.status === order.status);
      if (item) item.count += 1;
    });
    return counts;
  }, [orders]);

  return (
    <AdminLayout title="Dashboard">
      {loadError && (
  <div className="mb-5 rounded-[var(--radius-md)] border border-danger-600/30 bg-danger-100 px-4 py-3 text-sm text-danger-600">
    Couldn't load orders: {loadError}
  </div>
)}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Total Revenue"
          value={formatPrice(totals.totalRevenue).replace("Rs ", "")}
          prefix="Rs "
          changePct={0}
          icon={DollarSign}
        />
        <StatCard label="Total Orders" value={totals.totalOrders} changePct={0} icon={ShoppingBag} />
        <StatCard label="Total Customers" value={totals.totalCustomers} changePct={0} icon={Users} />
        <StatCard
          label="Avg. Order Value"
          value={formatPrice(totals.avgOrderValue).replace("Rs ", "")}
          prefix="Rs "
          changePct={0}
          icon={TrendingUp}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue (Recent Orders)" subtitle="Daily revenue and order volume">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueChartData} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#173A2E" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#173A2E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E1D8" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#5A5F5B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5A5F5B" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value, name) => [name === "revenue" ? formatPrice(value) : value, name === "revenue" ? "Revenue" : "Orders"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #E4E1D8", fontSize: 13 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#173A2E" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Sales by Category" subtitle="Revenue share this month">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={salesByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {salesByCategory.map((entry, i) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: 8, border: "1px solid #E4E1D8", fontSize: 12 }} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, lineHeight: "18px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-border rounded-[var(--radius-lg)] p-5">
          <p className="text-sm font-semibold text-charcoal-900 mb-1">Top Selling Products</p>
          <p className="text-xs text-charcoal-600 mb-4">By units sold, this month</p>
          <div className="flex flex-col divide-y divide-border">
            {topProducts.length > 0 ? (
              topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-7 w-7 rounded-full bg-linen-50 flex items-center justify-center text-xs font-semibold text-charcoal-600 shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-charcoal-900 truncate">{p.name}</p>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <p className="text-sm font-semibold text-charcoal-900 tabular-nums">{p.sold} sold</p>
                    <p className="text-xs text-charcoal-600 tabular-nums">{formatPrice(p.revenue)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-sm text-charcoal-600">No sales data available yet.</div>
            )}
          </div>
        </div>

        <ChartCard title="Orders by Status" subtitle="Current distribution">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusChartData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E1D8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#5A5F5B" }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="status"
                width={90}
                tick={{ fontSize: 10, fill: "#5A5F5B" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E4E1D8", fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {statusChartData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </AdminLayout>
  );
}
