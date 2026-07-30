import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Download, Eye, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import * as ordersApi from "../../features/admin/orders/api/ordersApi";
import { STATUS_BADGE_VARIANT } from "../../data/adminData";
import { formatPrice, formatDate } from "../../utils/formatCurrency";
import { downloadInvoicePdf } from "../../utils/invoicePdf";

export default function InvoicesPage() {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await ordersApi.listOrders({ limit: 200 });
        setOrders(data.data || []);
      } catch (error) {
        console.error("Failed to load invoices:", error?.response || error.message);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return orders;
    const q = query.toLowerCase();
    return orders.filter((o) => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q));
  }, [query, orders]);

  const handleDownload = (order) => {
    downloadInvoicePdf(order);
    toast.success(`Invoice ${order.id} downloaded`);
  };

  return (
    <AdminLayout title="Invoices">
      <div className="relative w-72 max-w-full mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search invoice or customer..."
          className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-border-strong text-sm focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700"
        />
      </div>

      <AdminTableShell isEmpty={filtered.length === 0}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Invoice</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Customer</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Date</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Amount</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 25).map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Receipt size={15} className="text-charcoal-600" />
                    <span className="font-medium text-charcoal-900">INV-{order.id.split("-")[1]}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal-900">{order.customer.name}</td>
                <td className="px-4 py-3 text-charcoal-600">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 font-semibold text-charcoal-900 tabular-nums">{formatPrice(order.total)}</td>
                <td className="px-4 py-3"><Badge variant={STATUS_BADGE_VARIANT[order.status]}>{order.status}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="flex items-center gap-1 text-xs font-semibold text-orchard-900 hover:text-mango-500 transition-colors"
                    >
                      <Eye size={13} />
                      View
                    </Link>
                    <button
                      onClick={() => handleDownload(order)}
                      className="flex items-center gap-1 text-xs font-semibold text-orchard-900 hover:text-mango-500 transition-colors"
                    >
                      <Download size={13} />
                      PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminLayout>
  );
}
