import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import { getProducts } from "../../data/productsData";
import { persistProducts, getPersistedProducts } from "../../utils/persistedData";

export default function TodaysDealsPage() {
  const [products, setProducts] = useState(getProducts());

  const toggleDeal = (product) => {
    const persisted = getPersistedProducts(products);
    const next = products.map((p) => (p.id === product.id ? { ...p, isTodaysDeal: !p.isTodaysDeal } : p));
    // Persist minimal shape (the admin UI persists entire product objects elsewhere)
    persistProducts(next);
    setProducts(next);
    window.location.reload();
  };

  return (
    <AdminLayout title="Today's Deals">
      <div className="mb-6">
        <p className="text-sm text-charcoal-600">Select which products are included in today's deal. Use the toggle to add or remove items.</p>
      </div>

      <AdminTableShell isEmpty={products.length === 0}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Product</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Price</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Today's Deal</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-[var(--radius-sm)] object-cover" />
                    <span className="font-medium text-charcoal-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-charcoal-900">{p.price}</td>
                <td className="px-4 py-3 text-right">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={p.isTodaysDeal} onChange={() => toggleDeal(p)} />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminLayout>
  );
}
