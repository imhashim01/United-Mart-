import { useState, useEffect, useMemo } from "react";
import { Search, Pencil, Trash2, Plus, Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import VariantImageUploader from "../../components/admin/VariantImageUploader";
import { loadCategories, loadBrands, mapApiProduct, slugify } from "../../data/productsData";
import * as productsApi from "../../features/admin/products/api/productsApi";
import { formatPrice } from "../../utils/formatCurrency";
import Pagination from "../../features/search/components/Pagination";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categoryObjects, setCategoryObjects] = useState([]);
  const [brandObjects, setBrandObjects] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", brand: "", categoryId: "", additionalCategoryIds: [], price: "", unit: "", stockCount: "",
    inStock: true, description: "", imageUrl: "", variants: [],
    isFeatured: false, isBestSeller: false, isTodaysDeal: false,
  });

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const categories = await loadCategories();
        const brands = await loadBrands();
        setCategoryObjects(categories);
        setBrandObjects(brands);
      } catch (error) {
        console.error("Failed to load categories or brands:", error?.response || error.message);
      }
    };

    loadCatalog();
    syncFromServer();
  }, []);

  const categoryNames = categoryObjects.map((c) => c.name);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return list;
  }, [products, query, category]);

  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetForm = () => ({
    name: "", brand: brandObjects[0]?.id ?? "", categoryId: categoryObjects[0]?.id ?? "",
    additionalCategoryIds: [],
    price: "", unit: "",
    stockCount: "", inStock: true, description: "", imageUrl: "", variants: [],
    isFeatured: false, isBestSeller: false, isTodaysDeal: false,
  });

  const openAddModal = () => {
    setModalMode("add");
    setSelectedProduct(null);
    setForm(resetForm());
    setModalOpen(true);
  };

  const resolveImageUrl = (value) =>
    typeof value === "string"
      ? value
      : value?.imageUrl || value?.url || value?.thumbnailUrl || "";

  const openEditModal = (product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    const matchingCategory = categoryObjects.find((c) => c.name === product.category);
    const matchingBrand = brandObjects.find((b) => b.name === product.brand);
    const matchingAdditionalCategoryIds = (product.additionalCategoryNames ?? [])
      .map((name) => categoryObjects.find((c) => c.name === name)?.id)
      .filter(Boolean);
    setForm({
      name: product.name,
      brand: matchingBrand?.id ?? "",
      categoryId: matchingCategory?.id ?? categoryObjects[0]?.id ?? "",
      additionalCategoryIds: matchingAdditionalCategoryIds,
      price: product.price,
      unit: product.unit,
      stockCount: product.stockCount,
      inStock: product.inStock,
      description: product.description || "",
      imageUrl: resolveImageUrl(product.images?.[0]),
      isFeatured: product.isFeatured ?? false,
      isBestSeller: product.isBestSeller ?? false,
      isTodaysDeal: product.isTodaysDeal ?? false,
      variants: product.variants ?? [],
    });
    setModalOpen(true);
  };

  const openViewModal = (product) => {
    setModalMode("view");
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const syncFromServer = async () => {
    try {
      const results = [];
      let page = 1;
      let totalPages = 1;
      do {
        const { data } = await productsApi.listProducts({
          limit: 200,
          page,
          fields: 'name,sku,description,price,discountPrice,unit,stock,category,additionalCategories,brand,images,variants,isFeatured,isBestSeller,isTodaysDeal',
        });
        results.push(...(data.data || []));
        totalPages = data?.meta?.totalPages ?? 1;
        page += 1;
      } while (page <= totalPages);
      setProducts(results.map((product) => mapApiProduct(product)));
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to load products from server.";
      toast.error(message);
      console.error("Failed to sync products from server:", error?.response || error.message);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    try {
      await productsApi.deleteProduct(product.id);
      await syncFromServer();
      toast.success(`${product.name} deleted`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete product on the server");
      console.error("Delete failed:", error?.response?.data || error.message);
    }
  };

  const handleVariantChange = (index, field, value) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { id: `variant-${Date.now()}`, name: "", sku: "", price: "", discountPrice: "", stock: 0, unit: "pcs", isDefault: prev.variants.length === 0, images: [] }],
    }));
  };

  const removeVariant = (index) => setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  const setDefaultVariant = (index) => setForm((prev) => ({ ...prev, variants: prev.variants.map((v, i) => ({ ...v, isDefault: i === index })) }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brand || !form.categoryId) {
      toast.error("Name, brand, and category are required");
      return;
    }

    const productName = form.name.trim();
    const generatedSku = `${slugify(productName).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Real backend shape: category must be a Mongo ObjectId, sku and
    // description are required, images must be {url, publicId} objects.
    const payload = {
      name: productName,
      sku: selectedProduct?.sku || generatedSku,
      category: form.categoryId, // ObjectId, not the category name
      additionalCategories: form.additionalCategoryIds,
      brand: form.brand,
      price: Number(form.price) || 0,
      unit: form.unit.trim() || "1 unit",
      stock: Number(form.stockCount) || 0,
      description: form.description.trim() || `${productName} — no description provided yet.`,
      isFeatured: Boolean(form.isFeatured),
      isBestSeller: Boolean(form.isBestSeller),
      isTodaysDeal: Boolean(form.isTodaysDeal),
      images: form.imageUrl.trim()
        ? [{ url: form.imageUrl.trim(), publicId: `manual-${Date.now()}` }]
        : undefined,
      variants: form.variants.length > 0
        ? form.variants.map((variant, index) => {
            const variantSku = String(variant.sku || `${slugify(productName)}-${index + 1}`).trim().toUpperCase();
            return {
              name: variant.name.trim() || `Variant ${index + 1}`,
              sku: variantSku,
              price: Number(variant.price) || 0,
              discountPrice: variant.discountPrice !== "" && variant.discountPrice != null ? Number(variant.discountPrice) : undefined,
              stock: Number(variant.stock) || 0,
              unit: variant.unit.trim() || "pcs",
              isDefault: Boolean(variant.isDefault),
              images: Array.isArray(variant.images) && variant.images.length > 0
                ? variant.images.map((img, i) => ({
                    url: img.imageUrl || img.url || img.thumbnailUrl || "",
                    publicId: img.publicId || img.id || `manual-variant-${Date.now()}-${i}`,
                    altText: img.altText || "",
                    sortOrder: Number(img.sortOrder ?? i),
                    isPrimary: Boolean(img.isPrimary),
                  }))
                : undefined,
            };
          })
        : undefined,
    };

    setSaving(true);
    try {
      if (selectedProduct) {
        await productsApi.updateProduct(selectedProduct.id, payload);
        toast.success(`${productName} updated`);
      } else {
        await productsApi.createProduct(payload);
        toast.success(`${productName} created`);
      }
      await syncFromServer();
      setModalOpen(false);
    } catch (error) {
      const resp = error?.response?.data;
      console.error("Save failed:", error?.response || error.message);
      if (resp) {
        toast.error(resp.message || JSON.stringify(resp));
        console.error("Server response body:", resp);
      } else {
        toast.error("Failed to save product on the server");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Products">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-3">
          <div className="relative w-64 max-w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-border-strong text-sm focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 px-3 rounded-[var(--radius-sm)] border border-border-strong text-sm bg-white focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10">
            <option value="All">All Categories</option>
            {categoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button type="button" onClick={openAddModal} className="flex items-center gap-1.5 h-10 px-4 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <AdminTableShell isEmpty={filtered.length === 0}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-linen-50 text-left">
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Product</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Brand</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Category</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Price</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Stock</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={resolveImageUrl(p.images?.[0])} alt="" className="h-10 w-10 rounded-[var(--radius-sm)] object-cover" />
                    <span className="font-medium text-charcoal-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal-600">{p.brand}</td>
                <td className="px-4 py-3 text-charcoal-600">{p.category}</td>
                <td className="px-4 py-3 font-medium text-charcoal-900 tabular-nums">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 tabular-nums text-charcoal-600">{p.stockCount}</td>
                <td className="px-4 py-3"><Badge variant={p.inStock ? "success" : "danger"}>{p.inStock ? "In Stock" : "Out of Stock"}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" aria-label="View" onClick={() => openViewModal(p)} className="p-1.5 text-charcoal-600 hover:text-orchard-700 transition-colors"><Eye size={15} /></button>
                    <button type="button" aria-label="Edit" onClick={() => openEditModal(p)} className="p-1.5 text-charcoal-600 hover:text-orchard-700 transition-colors"><Pencil size={15} /></button>
                    <button type="button" aria-label="Delete" onClick={() => handleDelete(p)} className="p-1.5 text-charcoal-600 hover:text-danger-600 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal-900/50 px-4 py-6">
          <div className="w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto rounded-[var(--radius-lg)] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orchard-700">{modalMode === "add" ? "Add Product" : modalMode === "edit" ? "Edit Product" : "Product Details"}</p>
                <h3 className="text-xl font-semibold text-charcoal-900">{selectedProduct?.name ?? "New product"}</h3>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full p-2 hover:bg-linen-50" aria-label="Close"><X size={18} /></button>
            </div>

            {modalMode === "view" && selectedProduct ? (
              <div className="mt-6 space-y-3 text-sm text-charcoal-700">
                <p><span className="font-semibold text-charcoal-900">Name:</span> {selectedProduct.name}</p>
                <p><span className="font-semibold text-charcoal-900">Brand:</span> {selectedProduct.brand}</p>
                <p><span className="font-semibold text-charcoal-900">Category:</span> {selectedProduct.category}</p>
                {selectedProduct.additionalCategoryNames?.length > 0 && (
                  <p><span className="font-semibold text-charcoal-900">Also in:</span> {selectedProduct.additionalCategoryNames.join(", ")}</p>
                )}
                <p><span className="font-semibold text-charcoal-900">Price:</span> {formatPrice(selectedProduct.price)}</p>
                <p><span className="font-semibold text-charcoal-900">Stock:</span> {selectedProduct.stockCount}</p>
                <p><span className="font-semibold text-charcoal-900">Status:</span> {selectedProduct.inStock ? "In Stock" : "Out of Stock"}</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Product name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
                </label>
                <label className="text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Brand</span>
                  <select required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2 bg-white">
                    <option value="" disabled>Select a brand</option>
                    {brandObjects.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Category</span>
                  <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2 bg-white">
                    <option value="" disabled>Select a category</option>
                    {categoryObjects.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Unit</span>
                  <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
                </label>
                <label className="text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Price</span>
                  <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
                </label>
                <label className="text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Stock</span>
                  <input type="number" min="0" value={form.stockCount} onChange={(e) => setForm({ ...form, stockCount: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
                </label>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-charcoal-900 mb-1.5 block">
                    Also show in these categories <span className="text-charcoal-600 font-normal">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categoryObjects
                      .filter((c) => c.id !== form.categoryId)
                      .map((c) => {
                        const checked = form.additionalCategoryIds.includes(c.id);
                        return (
                          <label
                            key={c.id}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm cursor-pointer transition-colors ${
                              checked ? "border-orchard-900 bg-linen-50 text-orchard-900" : "border-border-strong text-charcoal-600"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  additionalCategoryIds: e.target.checked
                                    ? [...form.additionalCategoryIds, c.id]
                                    : form.additionalCategoryIds.filter((id) => id !== c.id),
                                })
                              }
                              className="hidden"
                            />
                            {c.name}
                          </label>
                        );
                      })}
                  </div>
                </div>
                <label className="md:col-span-2 text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Description</span>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2 resize-none" />
                </label>
                <label className="md:col-span-2 text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Image URL</span>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
                </label>
                <div className="md:col-span-2">
                
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-charcoal-900">Variants</h4>
                    <button type="button" onClick={addVariant} className="h-9 rounded-[var(--radius-md)] bg-orchard-900 px-3 text-sm font-semibold text-white">Add Variant</button>
                  </div>
                  {form.variants.length === 0 && (
                    <p className="text-sm text-charcoal-600">No variants — add one above to create multiple SKUs.</p>
                  )}
                  <div className="space-y-3">
                    {form.variants.map((variant, idx) => (
                      <div key={variant.id} className="rounded-[var(--radius-sm)] border border-border p-3 bg-white">
                        <div className="grid gap-2 sm:grid-cols-3">
                          <input placeholder="Name" value={variant.name} onChange={(e) => handleVariantChange(idx, 'name', e.target.value)} className="rounded-[var(--radius-sm)] border border-border-strong px-2 py-2" />
                          <input placeholder="SKU" value={variant.sku} onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)} className="rounded-[var(--radius-sm)] border border-border-strong px-2 py-2" />
                          <input placeholder="Price" type="number" min="0" value={variant.price} onChange={(e) => handleVariantChange(idx, 'price', e.target.value)} className="rounded-[var(--radius-sm)] border border-border-strong px-2 py-2" />
                        </div>
                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                          <input placeholder="Discount" type="number" min="0" value={variant.discountPrice} onChange={(e) => handleVariantChange(idx, 'discountPrice', e.target.value)} className="rounded-[var(--radius-sm)] border border-border-strong px-2 py-2" />
                          <input placeholder="Stock" type="number" min="0" value={variant.stock} onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)} className="rounded-[var(--radius-sm)] border border-border-strong px-2 py-2" />
                          <input placeholder="Unit" value={variant.unit} onChange={(e) => handleVariantChange(idx, 'unit', e.target.value)} className="rounded-[var(--radius-sm)] border border-border-strong px-2 py-2" />
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="radio" name="defaultVariant" checked={Boolean(variant.isDefault)} onChange={() => setDefaultVariant(idx)} />
                            Default
                          </label>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => removeVariant(idx)} className="h-8 rounded-[var(--radius-md)] border border-danger-600 px-2 text-sm font-semibold text-danger-600">Remove</button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <VariantImageUploader images={variant.images || []} onChange={(next) => handleVariantChange(idx, 'images', next)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <label className="md:col-span-2 flex items-center gap-2 text-sm font-medium text-charcoal-900">
                  <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
                  In stock
                </label>
                <label className="md:col-span-2 flex items-center gap-2 text-sm font-medium text-charcoal-900">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                  Featured
                </label>
                <label className="md:col-span-2 flex items-center gap-2 text-sm font-medium text-charcoal-900">
                  <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} />
                  Best Seller
                </label>
                <label className="md:col-span-2 flex items-center gap-2 text-sm font-medium text-charcoal-900">
                  <input type="checkbox" checked={form.isTodaysDeal} onChange={(e) => setForm({ ...form, isTodaysDeal: e.target.checked })} />
                  Today's Deal
                </label>
                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="h-10 rounded-[var(--radius-md)] border border-border-strong px-4 text-sm font-semibold text-charcoal-900">Cancel</button>
                  <button type="submit" disabled={saving} className="h-10 rounded-[var(--radius-md)] bg-orchard-900 px-4 text-sm font-semibold text-white disabled:opacity-60">
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}