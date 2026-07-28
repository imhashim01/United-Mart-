import { useState, useMemo } from "react";
import { Search, Pencil, Trash2, Plus, Eye, X } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminTableShell from "../../components/admin/AdminTableShell";
import Badge from "../../components/ui/Badge";
import VariantImageUploader from "../../components/admin/VariantImageUploader";
import { products as persistedProducts, categoriesList, slugify } from "../../data/productsData";
import * as productsApi from "../../features/admin/products/api/productsApi";
import { formatPrice } from "../../utils/formatCurrency";
import { persistProducts } from "../../utils/persistedData";

export default function ProductsPage() {
  const [products, setProducts] = useState(persistedProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: categoriesList[0] ?? "",
    price: "",
    unit: "",
    stockCount: "",
    inStock: true,
    description: "",
    imageUrl: "",
    variants: [],
    isFeatured: false,
    isBestSeller: false,
    isTodaysDeal: false,
  });

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return list;
  }, [products, query, category]);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedProduct(null);
    setForm({
      name: "",
      brand: "",
      category: categoriesList[0] ?? "",
      price: "",
      unit: "",
      stockCount: "",
      inStock: true,
      description: "",
      imageUrl: "",
      variants: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      unit: product.unit,
      stockCount: product.stockCount,
      inStock: product.inStock,
      description: product.description || "",
      imageUrl: product.images?.[0] ?? "",
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

  const handleDelete = (product) => {
    if (window.confirm(`Delete ${product.name}?`)) {
      setProducts((prev) => {
        const next = prev.filter((item) => item.id !== product.id);
        persistProducts(next);
        persistedProducts.splice(0, persistedProducts.length, ...next);
        return next;
      });
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
      variants: [
        ...prev.variants,
        {
          id: `variant-${Date.now()}`,
          name: "",
          sku: "",
          price: "",
          discountPrice: "",
          stock: 0,
          unit: "pcs",
          isDefault: prev.variants.length === 0,
          images: [],
        },
      ],
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const setDefaultVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => ({
        ...variant,
        isDefault: i === index,
      })),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim()) return;

    const productName = form.name.trim();
    const payload = {
      id: selectedProduct?.id ?? `product-${Date.now()}`,
      slug: selectedProduct?.slug ?? slugify(productName),
      name: productName,
      brand: form.brand.trim(),
      category: form.category,
      categorySlug: slugify(form.category),
      price: Number(form.price) || 0,
      unit: form.unit.trim() || "1 unit",
      stockCount: Number(form.stockCount) || 0,
      inStock: form.inStock,
      description: form.description.trim(),
      images: form.imageUrl.trim()
        ? [form.imageUrl.trim()]
        : selectedProduct?.images ?? ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"],
      rating: selectedProduct?.rating ?? 4.7,
      reviewCount: selectedProduct?.reviewCount ?? 0,
      badge: selectedProduct?.badge ?? null,
      isFeatured: Boolean(form.isFeatured),
      isBestSeller: Boolean(form.isBestSeller),
      isTodaysDeal: Boolean(form.isTodaysDeal),
      variants: form.variants.map((variant) => ({
        ...variant,
        name: variant.name.trim(),
        sku: variant.sku.trim().toUpperCase(),
        price: Number(variant.price) || 0,
        discountPrice: variant.discountPrice ? Number(variant.discountPrice) : null,
        stock: Number(variant.stock) || 0,
        unit: variant.unit.trim() || "pcs",
        images: Array.isArray(variant.images)
          ? variant.images.map((image, idx) => ({
              ...image,
              id: image.id || `variant-img-${Date.now()}-${idx}`,
              imageUrl: image.imageUrl || image.url || "",
              thumbnailUrl: image.thumbnailUrl || image.imageUrl || image.url || "",
              altText: image.altText || `Variant image ${idx + 1}`,
              isPrimary: Boolean(image.isPrimary),
              sortOrder: Number(image.sortOrder ?? idx),
            }))
          : [],
      })),
    };

    setProducts((prev) => {
      const next = selectedProduct
        ? prev.map((item) => (item.id === selectedProduct.id ? payload : item))
        : [payload, ...prev];
      // Persist locally first for immediate feedback
      persistProducts(next);
      // Try persisting to backend; non-blocking
      (async () => {
        try {
          if (selectedProduct) await productsApi.updateProduct(selectedProduct.id, payload);
          else await productsApi.createProduct(payload);
        } catch (err) {
          // ignore network errors — local persistence keeps UI usable
          console.error('Failed to save product to server', err?.response?.data || err.message || err);
        }
      })();
      persistedProducts.splice(0, persistedProducts.length, ...next);
      return next;
    });
    setModalOpen(false);
  };

  return (
    <AdminLayout title="Products">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-3">
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
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 px-3 rounded-[var(--radius-sm)] border border-border-strong text-sm bg-white focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10"
          >
            <option value="All">All Categories</option>
            {categoriesList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
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
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-linen-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-[var(--radius-sm)] object-cover" />
                    <span className="font-medium text-charcoal-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal-600">{p.brand}</td>
                <td className="px-4 py-3 text-charcoal-600">{p.category}</td>
                <td className="px-4 py-3 font-medium text-charcoal-900 tabular-nums">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 tabular-nums text-charcoal-600">{p.stockCount}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.inStock ? "success" : "danger"}>{p.inStock ? "In Stock" : "Out of Stock"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" aria-label="View" onClick={() => openViewModal(p)} className="p-1.5 text-charcoal-600 hover:text-orchard-700 transition-colors">
                      <Eye size={15} />
                    </button>
                    <button type="button" aria-label="Edit" onClick={() => openEditModal(p)} className="p-1.5 text-charcoal-600 hover:text-orchard-700 transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button type="button" aria-label="Delete" onClick={() => handleDelete(p)} className="p-1.5 text-charcoal-600 hover:text-danger-600 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal-900/50 px-4 py-6">
          <div className="w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto rounded-[var(--radius-lg)] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orchard-700">{modalMode === "add" ? "Add Product" : modalMode === "edit" ? "Edit Product" : "Product Details"}</p>
                <h3 className="text-xl font-semibold text-charcoal-900">{selectedProduct?.name ?? "New product"}</h3>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full p-2 hover:bg-linen-50" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {modalMode === "view" && selectedProduct ? (
              <div className="mt-6 space-y-3 text-sm text-charcoal-700">
                <p><span className="font-semibold text-charcoal-900">Name:</span> {selectedProduct.name}</p>
                <p><span className="font-semibold text-charcoal-900">Brand:</span> {selectedProduct.brand}</p>
                <p><span className="font-semibold text-charcoal-900">Category:</span> {selectedProduct.category}</p>
                <p><span className="font-semibold text-charcoal-900">Base Price:</span> {formatPrice(selectedProduct.price)}</p>
                <p><span className="font-semibold text-charcoal-900">Stock:</span> {selectedProduct.stockCount}</p>
                <p><span className="font-semibold text-charcoal-900">Status:</span> {selectedProduct.inStock ? "In Stock" : "Out of Stock"}</p>
                {selectedProduct.variants?.length > 0 && (
                  <div>
                    <p className="font-semibold text-charcoal-900">Variants</p>
                    <ul className="mt-2 space-y-2 text-sm text-charcoal-600">
                      {selectedProduct.variants.map((variant) => (
                        <li key={variant.id} className="rounded-[var(--radius-sm)] bg-linen-50 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-charcoal-900">{variant.name || variant.sku}</span>
                            <span>{formatPrice(variant.price)}</span>
                          </div>
                          <p className="text-xs text-charcoal-500">
                            SKU: {variant.sku} · {variant.unit} · {variant.stock} in stock
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Product name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
                </label>
                <label className="text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Brand</span>
                  <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
                </label>
                <label className="text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Category</span>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2 bg-white">
                    {categoriesList.map((c) => <option key={c} value={c}>{c}</option>)}
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
                <label className="md:col-span-2 text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Description</span>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2 resize-none" />
                </label>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-charcoal-900">Variants</p>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="text-sm font-semibold text-orchard-700 hover:text-orchard-900"
                    >
                      + Add variant
                    </button>
                  </div>
                  {form.variants.length === 0 ? (
                    <p className="text-sm text-charcoal-600">No variants added. Save as a single SKU product or add variants here.</p>
                  ) : (
                    <div className="space-y-3">
                      {form.variants.map((variant, index) => (
                        <div key={variant.id} className="rounded-[var(--radius-md)] border border-border p-3 bg-linen-50">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-medium text-charcoal-900">Variant {index + 1}</p>
                            <div className="flex items-center gap-2">
                              <label className="text-xs font-medium uppercase tracking-[0.18em] text-charcoal-600">
                                <input
                                  type="radio"
                                  name="defaultVariant"
                                  checked={variant.isDefault}
                                  onChange={() => setDefaultVariant(index)}
                                  className="mr-2"
                                />
                                Default
                              </label>
                              <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="text-sm text-danger-600 hover:text-danger-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-sm font-medium text-charcoal-900">
                              <span className="mb-1.5 block">Variant name</span>
                              <input
                                value={variant.name}
                                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2"
                              />
                            </label>
                            <label className="text-sm font-medium text-charcoal-900">
                              <span className="mb-1.5 block">SKU</span>
                              <input
                                value={variant.sku}
                                onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2 uppercase"
                              />
                            </label>
                            <label className="text-sm font-medium text-charcoal-900">
                              <span className="mb-1.5 block">Price</span>
                              <input
                                type="number"
                                min="0"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2"
                              />
                            </label>
                            <label className="text-sm font-medium text-charcoal-900">
                              <span className="mb-1.5 block">Discount price</span>
                              <input
                                type="number"
                                min="0"
                                value={variant.discountPrice}
                                onChange={(e) => handleVariantChange(index, 'discountPrice', e.target.value)}
                                className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2"
                              />
                            </label>
                            <label className="text-sm font-medium text-charcoal-900">
                              <span className="mb-1.5 block">Stock</span>
                              <input
                                type="number"
                                min="0"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2"
                              />
                            </label>
                            <label className="text-sm font-medium text-charcoal-900">
                              <span className="mb-1.5 block">Unit</span>
                              <input
                                value={variant.unit}
                                onChange={(e) => handleVariantChange(index, 'unit', e.target.value)}
                                className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2"
                              />
                            </label>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-charcoal-900 mb-2">Variant images</p>
                            <VariantImageUploader
                              images={variant.images ?? []}
                              onChange={(images) => handleVariantChange(index, 'images', images)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <label className="md:col-span-2 text-sm font-medium text-charcoal-900">
                  <span className="mb-1.5 block">Image URL</span>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" className="w-full rounded-[var(--radius-sm)] border border-border-strong px-3 py-2" />
                </label>
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
