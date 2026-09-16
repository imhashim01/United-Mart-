import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { getBrandObjects, getProducts, refreshBrands } from "../../data/productsData";
import * as brandsApi from "../../features/admin/brands/api/brandsApi";

export default function BrandsPage() {
  const [brandObjects, setBrandObjects] = useState(getBrandObjects());
  // The backend doesn't compute a per-brand product count, so derive it
  // from the live product cache the same way CategoriesPage does.
  const brands = brandObjects.map((b) => ({
    ...b,
    productsCount: getProducts().filter((p) => p.brand === b.name).length,
  }));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [form, setForm] = useState({ name: "", logo: "", status: "Active" });
  const [saving, setSaving] = useState(false);

  const syncFromServer = async () => {
    await refreshBrands();
    setBrandObjects(getBrandObjects());
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedBrand(null);
    setForm({ name: "", logo: null, status: "Active" });
    setModalOpen(true);
  };

  const openEditModal = (brand) => {
    setModalMode("edit");
    setSelectedBrand(brand);
    setForm({ name: brand.name, logo: brand.logo, status: brand.status });
    setModalOpen(true);
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Delete ${brand.name}?`)) return;
    try {
      await brandsApi.deleteBrand(brand.id);
      await syncFromServer();
      toast.success("Brand deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete brand");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    // The brand logo is uploaded separately via the real Cloudinary endpoint
    // (immediately when editing, or right after create below) — never sent
    // as part of this JSON payload.
    const payload = {
      name,
      isActive: form.status === "Active",
    };

    setSaving(true);
    try {
      let savedBrand;
      if (selectedBrand) {
        const { data } = await brandsApi.updateBrand(selectedBrand.id, payload);
        savedBrand = data.data;
      } else {
        const { data } = await brandsApi.createBrand(payload);
        savedBrand = data.data;
      }

      // A queued logo only happens when the brand didn't exist yet — flush
      // it now that we have a real id.
      if (form.logo instanceof File) {
        const brandId = savedBrand.id ?? savedBrand._id;
        try {
          await brandsApi.uploadBrandLogo(brandId, form.logo);
        } catch (error) {
          console.error("Queued brand logo upload failed:", error?.response || error.message);
          toast.error(`${name} saved, but its logo failed to upload — add it via Edit.`);
        }
      }

      await syncFromServer();
      toast.success(selectedBrand ? "Brand updated" : "Brand created");
      setModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save brand");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Brands">
      <div className="flex justify-end mb-5">
        <button type="button" onClick={openAddModal} className="flex items-center gap-1.5 h-10 px-4 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors">
          <Plus size={16} />
          Add Brand
        </button>
      </div>

      <AdminTableShell isEmpty={brands.length === 0}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Brand</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Products</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={b.logo} alt="" className="h-8 w-8 rounded-[var(--radius-sm)] object-contain bg-linen-50 p-1" />
                    <span className="font-medium text-charcoal-900">{b.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums text-charcoal-600">{b.productsCount} products</td>
                <td className="px-4 py-3"><Badge variant={b.status === "Active" ? "success" : "neutral"}>{b.status}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" aria-label="Edit" onClick={() => openEditModal(b)} className="p-1.5 text-charcoal-600 hover:text-orchard-700 transition-colors"><Pencil size={15} /></button>
                    <button type="button" aria-label="Delete" onClick={() => handleDelete(b)} className="p-1.5 text-charcoal-600 hover:text-danger-600 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal-900/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-[var(--radius-lg)] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orchard-700">{modalMode === "add" ? "Add Brand" : "Edit Brand"}</p>
                <h3 className="text-xl font-semibold text-charcoal-900">{modalMode === "add" ? "New brand details" : form.name}</h3>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full p-2 hover:bg-linen-50" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-charcoal-900">
                <span className="mb-1.5 block">Brand name</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
              </label>
              <ImageUploadField
                value={form.logo}
                onChange={(next) => setForm({ ...form, logo: next })}
                label="Brand logo"
                successMessage="Brand logo uploaded"
                errorMessage="Failed to upload brand logo"
                uploadFn={
                  selectedBrand
                    ? async (file) => {
                        const { data } = await brandsApi.uploadBrandLogo(selectedBrand.id, file);
                        return data.data.logo?.url || "";
                      }
                    : undefined
                }
              />
              <label className="block text-sm font-medium text-charcoal-900">
                <span className="mb-1.5 block">Status</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong bg-white px-3 py-2">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="h-10 rounded-[var(--radius-md)] border border-border-strong px-4 text-sm font-semibold text-charcoal-900">Cancel</button>
                <button type="submit" disabled={saving} className="h-10 rounded-[var(--radius-md)] bg-orchard-900 px-4 text-sm font-semibold text-white disabled:opacity-60">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}