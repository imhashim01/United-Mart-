import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import * as paymentsApi from "../../features/admin/payments/api/paymentsApi";
import { formatPrice, formatDate } from "../../utils/formatCurrency";

const STATUS_VARIANT = { paid: "success", pending: "warning", processing: "warning", refunded: "danger", completed: "success", failed: "danger" };

export default function PaymentsPage() {
  const [methodFilter, setMethodFilter] = useState("All");
  const [payments, setPayments] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await paymentsApi.listPayments({ limit: 200 });
        setPayments(data.data || []);
      } catch (error) {
        console.error("Failed to load payments:", error?.response || error.message);
      }
    })();
  }, []);

  const markAsPaid = async (id) => {
    setUpdatingId(id);
    try {
      const { data } = await paymentsApi.updatePaymentStatus(id, { status: "completed" });
      setPayments((prev) => prev.map((p) => (p._id === id ? data.data : p)));
      toast.success("Payment marked as paid");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update payment");
      console.error("Mark as paid failed:", error?.response || error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const methods = useMemo(() => {
    const unique = new Set(payments.map((p) => p.method || "Unknown"));
    return ["All", ...Array.from(unique)];
  }, [payments]);

  const filtered = useMemo(() => {
    if (methodFilter === "All") return payments;
    return payments.filter((p) => p.method === methodFilter);
  }, [methodFilter, payments]);

  return (
    <AdminLayout title="Payments">
      <div className="flex flex-wrap gap-2 mb-5">
        {methods.map((m) => (
          <button
            key={m}
            onClick={() => setMethodFilter(m)}
            className={`h-9 px-3.5 rounded-full text-sm font-medium transition-colors ${
              methodFilter === m ? "bg-orchard-900 text-white" : "bg-white border border-border-strong text-charcoal-900 hover:bg-linen-50"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <AdminTableShell isEmpty={filtered.length === 0}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Payment ID</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Order</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Customer</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Method</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Amount</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Date</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3 font-medium text-charcoal-900">{p._id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-3 text-charcoal-600">{p.order?.orderNumber ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal-900">{p.user?.name ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal-600">{p.method}</td>
                <td className="px-4 py-3 font-semibold text-charcoal-900 tabular-nums">{formatPrice(p.amount)}</td>
                <td className="px-4 py-3 text-charcoal-600">{formatDate(p.createdAt)}</td>
                <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge></td>
                <td className="px-4 py-3 text-right">
                  {(p.status === "pending" || p.status === "processing") && (
                    <button
                      onClick={() => markAsPaid(p._id)}
                      disabled={updatingId === p._id}
                      className="text-xs font-semibold text-orchard-900 hover:text-mango-500 transition-colors disabled:opacity-50"
                    >
                      {updatingId === p._id ? "Updating..." : "Mark as Paid"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminLayout>
  );
}
