import { useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import { getProducts, refreshProducts } from "../../data/productsData";
import * as productsApi from "../../features/admin/products/api/productsApi";

export default function TodaysDealsPage() {
  const [products, setProducts] = useState(getProducts());
  const [pendingId, setPendingId] = useState(null);

  const toggleDeal = async (product) => {
    setPendingId(product.id);
    try {
      await productsApi.updateProduct(product.id, { isTodaysDeal: !product.isTodaysDeal });
      await refreshProducts();
      setProducts(getProducts());
      toast.success(product.isTodaysDeal ? "Removed from Today's Deals" : "Added to Today's Deals");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update deal status");
    } finally {
      setPendingId(null);
    }
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
                    <input
                      type="checkbox"
                      checked={p.isTodaysDeal}
                      disabled={pendingId === p.id}
                      onChange={() => toggleDeal(p)}
                    />
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