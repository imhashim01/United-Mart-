import { useState } from "react";
import { Pencil, Trash2, Plus, Ticket, X } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import { adminCoupons } from "../../data/adminData";
import { formatDate } from "../../utils/formatCurrency";
import { persistCoupons } from "../../utils/persistedData";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(adminCoupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [form, setForm] = useState({ code: "", type: "percent", value: "", minSpend: "", maxUses: "", expiresAt: "", status: "Active" });

  const openAddModal = () => {
    setModalMode("add");
    setSelectedCoupon(null);
    setForm({ code: "", type: "percent", value: "", minSpend: "", maxUses: "", expiresAt: "", status: "Active" });
    setModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setModalMode("edit");
    setSelectedCoupon(coupon);
    setForm({ code: coupon.code, type: coupon.type, value: coupon.value, minSpend: coupon.minSpend, maxUses: coupon.maxUses, expiresAt: coupon.expiresAt, status: coupon.status });
    setModalOpen(true);
  };

  const handleDelete = (coupon) => {
    if (window.confirm(`Delete coupon ${coupon.code}?`)) {
      setCoupons((prev) => {
        const next = prev.filter((item) => item.id !== coupon.id);
        persistCoupons(next);
        return next;
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      id: selectedCoupon?.id ?? `coupon-${Date.now()}`,
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value) || 0,
      minSpend: Number(form.minSpend) || 0,
      maxUses: Number(form.maxUses) || 0,
      expiresAt: form.expiresAt,
      status: form.status,
      usedCount: selectedCoupon?.usedCount ?? 0,
    };

    setCoupons((prev) => {
      const next = selectedCoupon
        ? prev.map((item) => (item.id === selectedCoupon.id ? payload : item))
        : [payload, ...prev];
      persistCoupons(next);
      return next;
    });
    setModalOpen(false);
  };

  return (
    <AdminLayout title="Coupons">
      <div className="flex justify-end mb-5">
        <button type="button" onClick={openAddModal} className="flex items-center gap-1.5 h-10 px-4 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors">
          <Plus size={16} />
          Create Coupon
        </button>
      </div>

      <AdminTableShell isEmpty={coupons.length === 0}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Code</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Discount</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Usage</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Expires</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Ticket size={15} className="text-mango-500" />
                    <span className="font-mono font-semibold text-charcoal-900">{c.code}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal-900">
                  {c.type === "percent" ? `${c.value}% off` : `Rs ${c.value} off`}
                  <span className="text-charcoal-600"> · min Rs {c.minSpend.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 tabular-nums text-charcoal-600">{c.usedCount} / {c.maxUses}</td>
                <td className="px-4 py-3 text-charcoal-600">{formatDate(c.expiresAt)}</td>
                <td className="px-4 py-3"><Badge variant={c.status === "Active" ? "success" : "neutral"}>{c.status}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" aria-label="Edit" onClick={() => openEditModal(c)} className="p-1.5 text-charcoal-600 hover:text-orchard-700 transition-colors"><Pencil size={15} /></button>
                    <button type="button" aria-label="Delete" onClick={() => handleDelete(c)} className="p-1.5 text-charcoal-600 hover:text-danger-600 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal-900/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-[var(--radius-lg)] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orchard-700">{modalMode === "add" ? "Create Coupon" : "Edit Coupon"}</p>
                <h3 className="text-xl font-semibold text-charcoal-900">{modalMode === "add" ? "New discount code" : form.code}</h3>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full p-2 hover:bg-linen-50" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-charcoal-900">
                <span className="mb-1.5 block">Coupon code</span>
                <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
              </label>
              <label className="block text-sm font-medium text-charcoal-900">
                <span className="mb-1.5 block">Type</span>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong bg-white px-3 py-2">
                  <option value="percent">Percent</option>
                  <option value="flat">Flat</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-charcoal-900">
                <span className="mb-1.5 block">Value</span>
                <input type="number" min="0" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
              </label>
              <label className="block text-sm font-medium text-charcoal-900">
                <span className="mb-1.5 block">Minimum spend</span>
                <input type="number" min="0" value={form.minSpend} onChange={(e) => setForm({ ...form, minSpend: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
              </label>
              <label className="block text-sm font-medium text-charcoal-900">
                <span className="mb-1.5 block">Max uses</span>
                <input type="number" min="0" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
              </label>
              <label className="block text-sm font-medium text-charcoal-900">
                <span className="mb-1.5 block">Expires at</span>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
              </label>
              <label className="block text-sm font-medium text-charcoal-900">
                <span className="mb-1.5 block">Status</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong bg-white px-3 py-2">
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
              </label>
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="h-10 rounded-[var(--radius-md)] border border-border-strong px-4 text-sm font-semibold text-charcoal-900">Cancel</button>
                <button type="submit" className="h-10 rounded-[var(--radius-md)] bg-orchard-900 px-4 text-sm font-semibold text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
