import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Ban, CheckCircle } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import * as ordersApi from "../../features/admin/orders/api/ordersApi";
import { formatPrice, formatDate } from "../../utils/formatCurrency";

export default function CustomersPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [blockedCustomers, setBlockedCustomers] = useState({});
  const [loadError, setLoadError] = useState(null);


  useEffect(() => {
    (async () => {
      try {
        const { data } = await ordersApi.listOrders({ limit: 100 });
        setOrders(data.data || []);
        setLoadError(null);
      } catch (error) {
        const message = error?.response?.data?.message || error.message || "Unknown error";
        console.error("Failed to fetch orders:", error?.response?.data || error);
        setLoadError(message);
        toast.error(`Couldn't load orders: ${message}`);
      }
    })();
  }, []);

  const customers = useMemo(() => {
    const customersMap = new Map();

    orders.forEach((order) => {
      const email = order.customer?.email?.toLowerCase();
      if (!email) return;

      const existing = customersMap.get(email);
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += order.total || 0;
        existing.joinedAt = existing.joinedAt < order.createdAt ? existing.joinedAt : order.createdAt;
      } else {
        customersMap.set(email, {
          id: order.customer?.id || `cust-${customersMap.size + 1}`,
          name: order.customer?.name || "Unknown",
          email: order.customer?.email,
          phone: order.customer?.phone || "",
          avatar: order.customer?.avatar || "",
          ordersCount: 1,
          totalSpent: order.total || 0,
          joinedAt: order.createdAt || "",
          status: "Active",
        });
      }
    });

    return Array.from(customersMap.values());
  }, [orders]);

  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [customers, query]);

  const toggleBlock = (id) => {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return;

    setBlockedCustomers((prev) => {
      const emailKey = customer.email.toLowerCase();
      const isBlocked = !prev[emailKey];
      toast.success(`${customer.name} ${isBlocked ? "blocked" : "unblocked"}`);
      return {
        ...prev,
        [emailKey]: isBlocked,
      };
    });
  };

  return (
    <AdminLayout title="Customers">
      {loadError && (
  <div className="mb-5 rounded-[var(--radius-md)] border border-danger-600/30 bg-danger-100 px-4 py-3 text-sm text-danger-600">
    Couldn't load orders: {loadError}
  </div>
)}
      <div className="relative w-72 max-w-full mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers..."
          className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-border-strong text-sm focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700"
        />
      </div>

      <AdminTableShell isEmpty={filtered.length === 0}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Customer</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Orders</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Total Spent</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Joined</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-charcoal-900">{c.name}</p>
                      <p className="text-xs text-charcoal-600">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums text-charcoal-600">{c.ordersCount}</td>
                <td className="px-4 py-3 font-medium text-charcoal-900 tabular-nums">{formatPrice(c.totalSpent)}</td>
                <td className="px-4 py-3 text-charcoal-600">{formatDate(c.joinedAt)}</td>
                <td className="px-4 py-3"><Badge variant={(blockedCustomers[c.email.toLowerCase()] ? "danger" : "success")}>{blockedCustomers[c.email.toLowerCase()] ? "Blocked" : "Active"}</Badge></td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleBlock(c.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-orchard-900 transition-colors"
                  >
                    {blockedCustomers[c.email.toLowerCase()] ? <CheckCircle size={14} /> : <Ban size={14} />}
                    {blockedCustomers[c.email.toLowerCase()] ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminLayout>
  );
}
