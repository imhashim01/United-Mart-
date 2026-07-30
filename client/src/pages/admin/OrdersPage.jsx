import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Search, Eye, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import Pagination from "../../features/search/components/Pagination";
import { ORDER_STATUSES, STATUS_BADGE_VARIANT } from "../../data/adminData";
import * as ordersApi from "../../features/admin/orders/api/ordersApi";
import { formatPrice, formatDate } from "../../utils/formatCurrency";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await ordersApi.listOrders({ limit: 200 });
        setOrders(data.data || []);
      } catch (error) {
        const message = error?.response?.data?.message || error.message || "Unknown error";
        console.error("Failed to fetch dashboard orders:", error?.response?.data || error);
        setLoadError(message);
        toast.error(`Couldn't load orders: ${message}`);
      }
    })();
  }, []);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== "All") list = list.filter((o) => o.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await ordersApi.updateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          return {
            ...o,
            status: newStatus,
            timeline: [
              ...o.timeline,
              { status: newStatus, timestamp: new Date().toISOString(), note: `Status updated to ${newStatus} by admin` },
            ],
          };
        })
      );
      toast.success(`Order ${orderId} marked as ${newStatus}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update order status');
      console.error('Update order status failed:', error?.response || error.message);
    }
  };

  return (
    <AdminLayout title="Orders">
      {loadError && (
  <div className="mb-5 rounded-[var(--radius-md)] border border-danger-600/30 bg-danger-100 px-4 py-3 text-sm text-danger-600">
    Couldn't load orders: {loadError}
  </div>
)}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search order ID or customer..."
            className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-border-strong text-sm focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-10 px-3 rounded-[var(--radius-sm)] border border-border-strong text-sm bg-white focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700"
        >
          <option value="All">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <AdminTableShell isEmpty={filtered.length === 0} emptyMessage="No orders match your filters">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Order</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Customer</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Date</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Total</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3.5 font-medium text-charcoal-900">{order.id}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <img src={order.customer.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                    <span className="text-charcoal-900">{order.customer.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-charcoal-600">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3.5 font-semibold text-charcoal-900 tabular-nums">{formatPrice(order.total)}</td>
                <td className="px-4 py-3.5">
                  {["Cancelled", "Delivered", "Returned"].includes(order.status) ? (
                    <Badge variant={STATUS_BADGE_VARIANT[order.status]}>{order.status}</Badge>
                  ) : (
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label={`Update status for order ${order.id}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Badge variant={STATUS_BADGE_VARIANT[order.status]} className="flex items-center gap-1 pointer-events-none">
                        {order.status}
                        <ChevronDown size={11} />
                      </Badge>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-orchard-900 hover:text-mango-500 transition-colors"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
      />
    </AdminLayout>
  );
}
