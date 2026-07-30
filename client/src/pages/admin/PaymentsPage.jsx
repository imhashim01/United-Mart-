import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import * as paymentsApi from "../../features/admin/payments/api/paymentsApi";
import { formatPrice, formatDate } from "../../utils/formatCurrency";

const STATUS_VARIANT = { paid: "success", pending: "warning", refunded: "danger", completed: "success", failed: "danger" };

export default function PaymentsPage() {
  const [methodFilter, setMethodFilter] = useState("All");
  const [payments, setPayments] = useState([]);

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
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3 font-medium text-charcoal-900">{p.id}</td>
                <td className="px-4 py-3 text-charcoal-600">{p.orderId}</td>
                <td className="px-4 py-3 text-charcoal-900">{p.customer}</td>
                <td className="px-4 py-3 text-charcoal-600">{p.method}</td>
                <td className="px-4 py-3 font-semibold text-charcoal-900 tabular-nums">{formatPrice(p.amount)}</td>
                <td className="px-4 py-3 text-charcoal-600">{formatDate(p.date)}</td>
                <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminLayout>
  );
}
