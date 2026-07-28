import { useState, useMemo } from "react";
import { Search, Ban, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import { getAdminCustomers } from "../../data/adminData";
import { formatPrice, formatDate } from "../../utils/formatCurrency";

export default function CustomersPage() {
  const [customers, setCustomers] = useState(() => getAdminCustomers());
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [customers, query]);

  const toggleBlock = (id) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "Active" ? "Blocked" : "Active" } : c))
    );
    const customer = customers.find((c) => c.id === id);
    toast.success(`${customer.name} ${customer.status === "Active" ? "blocked" : "unblocked"}`);
  };

  return (
    <AdminLayout title="Customers">
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
                <td className="px-4 py-3"><Badge variant={c.status === "Active" ? "success" : "danger"}>{c.status}</Badge></td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleBlock(c.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-orchard-900 transition-colors"
                  >
                    {c.status === "Active" ? <Ban size={14} /> : <CheckCircle size={14} />}
                    {c.status === "Active" ? "Block" : "Unblock"}
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
