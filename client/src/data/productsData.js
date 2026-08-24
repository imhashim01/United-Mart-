// Product/category/brand catalog — now backed by the real MongoDB API
// instead of localStorage. Data is fetched once (on app boot, see main.jsx)
// and cached in memory; admin mutations call refreshProducts()/etc. to
// re-sync the cache after a successful server write.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80";

export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";

export const normalizeProduct = (product, fallbackId = null) => {
  const baseName = product?.name?.trim() || "New Product";
  const slug = product?.slug || slugify(baseName);
  const category = product?.category || "Other";
  const images = Array.isArray(product?.images) && product.images.filter(Boolean).length > 0
    ? product.images
        .map((image) => (typeof image === "string" ? image : image.imageUrl || image.url || image.thumbnailUrl))
        .filter(Boolean)
    : [DEFAULT_PRODUCT_IMAGE];

  return {
    ...product,
    id: product?.id || fallbackId || `product-${slug}`,
    slug,
    category,
    categorySlug: product?.categorySlug || slugify(category),
    price: Number(product?.price) || 0,
    originalPrice: product?.originalPrice != null ? Number(product.originalPrice) : null,
    stockCount: Number(product?.stockCount) || 0,
    inStock: product?.inStock ?? Number(product?.stockCount) > 0,
    images,
    rating: Number(product?.rating) || 4.7,
    reviewCount: Number(product?.reviewCount) || 0,
    badge: product?.badge ?? null,
    isFeatured: Boolean(product?.isFeatured ?? false),
    isBestSeller: Boolean(product?.isBestSeller ?? false),
    isTodaysDeal: Boolean(product?.isTodaysDeal ?? false),
    relatedIds: Array.isArray(product?.relatedIds) ? product.relatedIds : [],
    variants: Array.isArray(product?.variants)
      ? product.variants.map((variant, index) => ({
          ...variant,
          id: variant.id || `${slug}-variant-${index + 1}`,
          name: variant.name || variant.sku || `Variant ${index + 1}`,
          sku: String(variant.sku || "").toUpperCase(),
          price: Number(variant.price) || 0,
          discountPrice: variant.discountPrice !== "" && variant.discountPrice != null ? Number(variant.discountPrice) : null,
          stock: Number(variant.stock) || 0,
          unit: variant.unit?.trim() || "pcs",
          isDefault: Boolean(variant.isDefault),
          images: Array.isArray(variant.images)
            ? variant.images
                .map((image, idx) => {
                  if (typeof image === "string") {
                    return { id: `variant-img-${index}-${idx}`, imageUrl: image, thumbnailUrl: image, altText: `Variant image ${idx + 1}`, isPrimary: idx === 0, sortOrder: idx };
                  }
                  return {
                    id: image.id || `variant-img-${index}-${idx}`,
                    imageUrl: image.imageUrl || image.url || image.thumbnailUrl || "",
                    thumbnailUrl: image.thumbnailUrl || image.imageUrl || image.url || "",
                    altText: image.altText || `Variant image ${idx + 1}`,
                    isPrimary: Boolean(image.isPrimary),
                    sortOrder: Number(image.sortOrder ?? idx),
                  };
                })
                .filter((image) => image.imageUrl)
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            : [],
        }))
      : [],
    reviewsList: Array.isArray(product?.reviewsList) ? product.reviewsList : [],
  };
};

// Converts a raw Mongo product document (as returned by GET /products) into
// the loosely-shaped input normalizeProduct() expects. This is the one
// place that needs to change if your backend product shape ever changes.
const normalizeImageEntry = (image, index) => {
  if (!image) return null;
  if (typeof image === "string") {
    return {
      id: `img-${index}`,
      imageUrl: image,
      thumbnailUrl: image,
      altText: `Image ${index + 1}`,
      isPrimary: index === 0,
      sortOrder: index,
    };
  }

  return {
    id: image.id || image.publicId || image.url || image.imageUrl || image.thumbnailUrl || `img-${index}`,
    imageUrl: image.imageUrl || image.url || image.thumbnailUrl || "",
    thumbnailUrl: image.thumbnailUrl || image.imageUrl || image.url || "",
    altText: image.altText || `Image ${index + 1}`,
    isPrimary: Boolean(image.isPrimary),
    sortOrder: Number(image.sortOrder ?? index),
    publicId: image.publicId,
  };
};

const mapApiProduct = (apiProduct) => {
  const images = Array.isArray(apiProduct.images)
    ? apiProduct.images.map(normalizeImageEntry).filter(Boolean)
    : [];

  const variants = Array.isArray(apiProduct.variants)
    ? apiProduct.variants.map((variant, index) => ({
        id: variant.id ?? variant._id ?? `variant-${index}`,
        name: variant.name || `Variant ${index + 1}`,
        sku: variant.sku,
        price: variant.price ?? 0,
        discountPrice: variant.discountPrice ?? null,
        stock: variant.stock ?? variant.stockCount ?? 0,
        unit: variant.unit ?? "pcs",
        isDefault: Boolean(variant.isDefault),
        images: Array.isArray(variant.images)
          ? variant.images.map(normalizeImageEntry).filter(Boolean)
          : [],
      }))
    : [];

  return {
    id: apiProduct.id ?? apiProduct._id,
    sku: apiProduct.sku,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description ?? "",
    category: apiProduct.category?.name ?? "Other",
    additionalCategoryNames: (apiProduct.additionalCategories ?? []).map((c) => c.name),
    categorySlug: apiProduct.category?.slug,
    brand: apiProduct.brand?.name ?? "Unbranded",
    price: apiProduct.effectivePrice ?? apiProduct.discountPrice ?? apiProduct.price,
    originalPrice: apiProduct.discountPrice != null && apiProduct.discountPrice < apiProduct.price ? apiProduct.price : null,
    discountPrice: apiProduct.discountPrice ?? null,
    discount:
      apiProduct.discountPrice != null && apiProduct.discountPrice < apiProduct.price
        ? Math.round((1 - apiProduct.discountPrice / apiProduct.price) * 100)
        : 0,
    unit: apiProduct.unit ?? "pcs",
    stockCount: apiProduct.stockCount ?? apiProduct.stock ?? 0,
    inStock: apiProduct.inStock ?? (apiProduct.stock ?? 0) > 0,
    images,
    rating: apiProduct.ratings?.average ?? 4.7,
    reviewCount: apiProduct.ratings?.count ?? 0,
    isFeatured: Boolean(apiProduct.isFeatured),
    isBestSeller: Boolean(apiProduct.isBestSeller),
    isTodaysDeal: Boolean(apiProduct.isTodaysDeal),
    variants,
  };
};

const mapApiCategory = (apiCategory) => ({
  id: apiCategory.id ?? apiCategory._id,
  name: apiCategory.name,
  status: apiCategory.isActive === false ? "Inactive" : "Active",
  image: apiCategory.image?.url ?? apiCategory.image ?? "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
});

const mapApiBrand = (apiBrand) => ({
  id: apiBrand.id ?? apiBrand._id,
  name: apiBrand.name,
  status: apiBrand.isActive === false ? "Inactive" : "Active",
  logo: apiBrand.logo?.url ?? apiBrand.logo ?? "https://logo.clearbit.com/example.com",
  productsCount: apiBrand.productsCount ?? 0,
});

// ---- Live caches, populated by loadCatalog() in main.jsx before the app renders ----
let cachedProducts = [];
let cachedCategories = [];
let cachedBrands = [];

// Fetches every page of a paginated list endpoint and returns the combined
// array. Page 1 is fetched first (to learn how many total pages exist),
// then every remaining page is fetched in parallel instead of one-at-a-time —
// sequential fetching meant a catalog spanning N pages took N times as long
// as it needed to, since each page waited for the previous one to finish.
const fetchAllPages = async (endpoint, maxLimit = 100, extraParams = {}) => {
  const { data: firstPage } = await api.get(endpoint, { params: { limit: maxLimit, page: 1, ...extraParams } });
  const results = [...(firstPage?.data ?? [])];
  const totalPages = firstPage?.meta?.totalPages ?? 1;

  if (totalPages > 1) {
    const remainingPageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const remainingResponses = await Promise.all(
      remainingPageNumbers.map((page) =>
        api.get(endpoint, { params: { limit: maxLimit, page, ...extraParams } })
      )
    );
    remainingResponses.forEach(({ data }) => results.push(...(data?.data ?? [])));
  }

  return results;
};

export const loadProducts = async () => {
  try {
    // Only request the fields the storefront actually renders — the full
    // product document (every variant's full image gallery, timestamps,
    // admin-only fields) was making each page several hundred KB larger
    // than it needed to be.
    const rawList = await fetchAllPages("/products", 200, {
      fields: "name,slug,sku,description,price,discountPrice,unit,stock,category,additionalCategories,brand,images,variants,isFeatured,isBestSeller,isTodaysDeal,ratings",
    });
    cachedProducts = rawList.map((p, i) => normalizeProduct(mapApiProduct(p), `product-${i + 1}`));
  } catch (error) {
    console.error("Failed to load products from API:", error?.response?.data || error.message);
  }
  return cachedProducts;
};

export const loadCategories = async () => {
  try {
    const rawList = await fetchAllPages("/categories", 100);
    cachedCategories = rawList.map(mapApiCategory);
  } catch (error) {
    console.error("Failed to load categories from API:", error?.response?.data || error.message);
  }
  return cachedCategories;
};

export const loadBrands = async () => {
  try {
    const rawList = await fetchAllPages("/brands", 100);
    cachedBrands = rawList.map(mapApiBrand);
  } catch (error) {
    console.error("Failed to load brands from API:", error?.response?.data || error.message);
  }
  return cachedBrands;
};

// Admin pages call these after a successful create/update/delete so every
// open tab/device picks up the change on its next fetch.
export const refreshProducts = loadProducts;
export const refreshCategories = loadCategories;
export const refreshBrands = loadBrands;

export const getProducts = () => cachedProducts;
export const getCategoryObjects = () => cachedCategories;
export const getCategoriesList = () => cachedCategories.map((c) => c.name);
export const getBrandsList = () => cachedBrands.map((b) => b.name);
export const getBrandObjects = () => cachedBrands;

const getEffectiveProductPrice = (product) => {
  const defaultVariant = product.variants?.length
    ? product.variants.find((variant) => variant.isDefault) ?? product.variants[0]
    : null;
  if (defaultVariant) return defaultVariant.discountPrice != null ? defaultVariant.discountPrice : defaultVariant.price;
  return product.discountPrice != null ? product.discountPrice : product.price;
};

export const getProductById = (idOrSlug) => {
  if (!idOrSlug) return null;
  const normalizedValue = String(idOrSlug).trim();
  return cachedProducts.find((product) => {
    const slugValue = product.slug || slugify(product.name);
    return product.id === normalizedValue || slugValue === normalizedValue || slugValue === slugify(normalizedValue);
  }) ?? null;
};

export const getRelatedProducts = (product) => {
  if (!product) return [];
  const byId = (product.relatedIds ?? []).map((id) => getProductById(id)).filter(Boolean);
  if (byId.length > 0) return byId;
  // Fallback: other products in the same category
  return cachedProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
};

export { mapApiProduct };
// Function, not a static object — computed fresh from whatever is currently
// cached, with a sane fallback range before the first fetch resolves.
export const getPriceRange = () => {
  if (cachedProducts.length === 0) return { min: 0, max: 10000 };
  const prices = cachedProducts.map((p) => getEffectiveProductPrice(p));
  return { min: Math.min(...prices), max: Math.max(...prices) };
};