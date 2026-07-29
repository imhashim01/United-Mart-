import { useState } from "react";
import { Pencil, Trash2, Plus, FolderTree, Eye, X } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import { categoryObjects, getProducts } from "../../data/productsData";
import { persistCategoryObjects, persistProducts, persistCategoryNames } from "../../utils/persistedData";

export default function CategoriesPage() {
  const [categories, setCategories] = useState(categoryObjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form, setForm] = useState({ name: "", status: "Active", image: "" });

  const categoryRows = categories.map((category) => ({
    ...category,
    productsCount: getProducts().filter((p) => p.category === category.name).length,
  }));

  const openAddModal = () => {
    setModalMode("add");
    setSelectedCategory(null);
    setForm({ name: "", status: "Active", image: "" });
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setForm({ name: category.name, status: category.status, image: category.image || "" });
    setModalOpen(true);
  };

  const openViewModal = (category) => {
    setModalMode("view");
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = (category) => {
    if (window.confirm(`Delete ${category.name}?`)) {
      setCategories((prev) => {
        const next = prev.filter((item) => item.id !== category.id);
        persistCategoryObjects(next);
        // update persisted category names for filters/footer
        persistCategoryNames(next.map((c) => c.name));
        return next;
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const nextName = form.name.trim();
    if (!nextName) return;

    setCategories((prev) => {
      const next = selectedCategory
        ? prev.map((category) =>
            category.id === selectedCategory.id
              ? { ...category, name: nextName, status: form.status, image: form.image }
              : category
          )
        : [
            {
              id: `cat-${nextName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
              name: nextName,
              status: form.status,
              image: form.image,
            },
            ...prev,
          ];

      persistCategoryObjects(next);
      // update persisted category names for filters/footer
      persistCategoryNames(next.map((c) => c.name));

      if (selectedCategory && selectedCategory.name !== nextName) {
        const nextProducts = getProducts().map((product) =>
          product.category === selectedCategory.name ? { ...product, category: nextName } : product
        );
        persistProducts(nextProducts);
      }

      return next;
    });

    setModalOpen(false);
  };

  return (
    <AdminLayout title="Categories">
      <div className="flex justify-end mb-5">
        <button type="button" onClick={openAddModal} className="flex items-center gap-1.5 h-10 px-4 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors">
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <AdminTableShell isEmpty={categories.length === 0}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Category</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Products</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryRows.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-[var(--radius-sm)] bg-linen-50 overflow-hidden flex items-center justify-center">
                      {c.image ? (
                        <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                      ) : (
                        <FolderTree size={16} className="text-orchard-700" />
                      )}
                    </div>
                    <span className="font-medium text-charcoal-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums text-charcoal-600">{c.productsCount} products</td>
                <td className="px-4 py-3"><Badge variant="success">{c.status}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" aria-label="View" onClick={() => openViewModal(c)} className="p-1.5 text-charcoal-600 hover:text-orchard-700 transition-colors"><Eye size={15} /></button>
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
          <div className="w-full max-w-xl rounded-[var(--radius-lg)] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orchard-700">{modalMode === "add" ? "Add Category" : modalMode === "edit" ? "Edit Category" : "Category Details"}</p>
                <h3 className="text-xl font-semibold text-charcoal-900">{selectedCategory?.name ?? "New category"}</h3>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full p-2 hover:bg-linen-50" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {modalMode === "view" && selectedCategory ? (
              <div className="mt-6 space-y-3 text-sm text-charcoal-700">
                {selectedCategory.image && (
                  <div className="rounded-[var(--radius-md)] overflow-hidden mb-3">
                    <img src={selectedCategory.image} alt={selectedCategory.name} className="w-full h-40 object-cover" />
                  </div>
                )}
                <p><span className="font-semibold text-charcoal-900">Name:</span> {selectedCategory.name}</p>
                <p><span className="font-semibold text-charcoal-900">Products:</span> {selectedCategory.productsCount}</p>
                <p><span className="font-semibold text-charcoal-900">Status:</span> {selectedCategory.status}</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <label className="text-sm font-medium text-charcoal-900 block">
                  <span className="mb-1.5 block">Category name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
                </label>
                <label className="text-sm font-medium text-charcoal-900 block">
                  <span className="mb-1.5 block">Image URL</span>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://example.com/category.jpg" className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
                </label>
                <label className="text-sm font-medium text-charcoal-900 block">
                  <span className="mb-1.5 block">Status</span>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2 bg-white">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </label>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="h-10 rounded-[var(--radius-md)] border border-border-strong px-4 text-sm font-semibold text-charcoal-900">Cancel</button>
                  <button type="submit" className="h-10 rounded-[var(--radius-md)] bg-orchard-900 px-4 text-sm font-semibold text-white">Save</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
