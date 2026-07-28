import { useState, useMemo } from "react";
import { Search, AlertTriangle } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import { getProducts } from "../../data/productsData";

const LOW_STOCK_THRESHOLD = 15;

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...getProducts()];
    if (lowStockOnly) list = list.filter((p) => p.stockCount <= LOW_STOCK_THRESHOLD);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.stockCount - b.stockCount);
  }, [query, lowStockOnly]);

  const lowStockCount = getProducts().filter((p) => p.stockCount <= LOW_STOCK_THRESHOLD).length;

  return (
    <AdminLayout title="Inventory">
      {lowStockCount > 0 && (
        <div className="flex items-center gap-2.5 bg-warning-100 text-warning-600 text-sm px-4 py-3 rounded-[var(--radius-md)] mb-5">
          <AlertTriangle size={16} className="shrink-0" />
          {lowStockCount} product{lowStockCount > 1 ? "s are" : " is"} running low on stock (≤{LOW_STOCK_THRESHOLD} units)
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative w-64 max-w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-border-strong text-sm focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-charcoal-900 cursor-pointer">
          <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} className="accent-orchard-900" />
          Low stock only
        </label>
      </div>

      <AdminTableShell isEmpty={filtered.length === 0}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Product</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Category</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Stock</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-[var(--radius-sm)] object-cover" />
                    <span className="font-medium text-charcoal-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal-600">{p.category}</td>
                <td className="px-4 py-3 tabular-nums font-medium text-charcoal-900">{p.stockCount} units</td>
                <td className="px-4 py-3">
                  {!p.inStock ? (
                    <Badge variant="danger">Out of Stock</Badge>
                  ) : p.stockCount <= LOW_STOCK_THRESHOLD ? (
                    <Badge variant="warning">Low Stock</Badge>
                  ) : (
                    <Badge variant="success">In Stock</Badge>
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
