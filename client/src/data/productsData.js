// Extended product catalog for Search, Product Grid, and Product Details.
// Replace with TanStack Query hooks hitting /api/v1/products once the
// backend products module is live — shapes here match what those
// endpoints should return.

import {
  getPersistedProducts,
  getPersistedBrandNames,
  getPersistedCategoryObjects,
} from "../utils/persistedData";

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
    // Admin-controlled flags
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
          discountPrice: variant.discountPrice != null ? Number(variant.discountPrice) : null,
          stock: Number(variant.stock) || 0,
          unit: variant.unit?.trim() || "pcs",
          isDefault: Boolean(variant.isDefault),
            images: Array.isArray(variant.images)
              ? variant.images
                  .map((image, idx) => {
                    if (typeof image === "string") {
                      return {
                        id: `variant-img-${index}-${idx}`,
                        imageUrl: image,
                        thumbnailUrl: image,
                        altText: `Variant image ${idx + 1}`,
                        isPrimary: idx === 0,
                        sortOrder: idx,
                      };
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

const seedBrandsList = [
  "National Foods", "Shan Foods", "Nestlé", "Engro Foods", "Unilever", "Olpers",
];

const seedCategoryObjects = [
  { id: "cat-fruits-vegetables", name: "Fruits & Vegetables", status: "Active", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80" },
  { id: "cat-dairy-eggs", name: "Dairy & Eggs", status: "Active", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80" },
  { id: "cat-bakery", name: "Bakery", status: "Active", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" },
  { id: "cat-meat-seafood", name: "Meat & Seafood", status: "Active", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80" },
  { id: "cat-beverages", name: "Beverages", status: "Active", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80" },
  { id: "cat-snacks", name: "Snacks", status: "Active", image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80" },
  { id: "cat-household", name: "Household", status: "Active", image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400&q=80" },
  { id: "cat-personal-care", name: "Personal Care", status: "Active", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80" },
  { id: "cat-grocery", name: "Grocery", status: "Active", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" },
  { id: "cat-pantry", name: "Pantry", status: "Active", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" },
];

export const brandsList = getPersistedBrandNames(seedBrandsList);
export const categoryObjects = getPersistedCategoryObjects(seedCategoryObjects);
export const categoriesList = categoryObjects.map((category) => category.name);

const makeReviews = (seedRating, count) => {
  const names = ["Ayesha Raza", "Bilal Ahmed", "Sana Khan", "Farhan Malik", "Mahnoor Iqbal", "Usman Tariq"];
  const comments = [
    "Exactly as described, fresh and well packaged.",
    "Good value for the price, will order again.",
    "Delivery was quick and the quality was better than expected.",
    "Decent product but packaging could be improved.",
    "My go-to brand now, consistent quality every time.",
  ];
  return Array.from({ length: count }).map((_, i) => ({
    id: `rev-${seedRating}-${i}`,
    name: names[i % names.length],
    avatar: `https://i.pravatar.cc/100?img=${(i * 7 + seedRating) % 70}`,
    rating: Math.max(3, Math.min(5, seedRating + (i % 3 === 0 ? -1 : 0))),
    date: `2026-0${(i % 6) + 1}-1${i % 9}`,
    comment: comments[i % comments.length],
    verified: i % 3 !== 0,
    helpful: (i * 3 + seedRating) % 24,
  }));
};

const seedProducts = [
  {
    id: "prod-1", name: "Organic Baby Spinach", slug: "organic-baby-spinach",
    category: "Fruits & Vegetables", brand: "National Foods", price: 180, originalPrice: 220, discount: 18,
    images: [
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80",
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80",
    ],
    rating: 4.7, reviewCount: 88, unit: "250g pack", badge: "Organic", inStock: true, stockCount: 42,
    description: "Hand-picked baby spinach leaves, washed and ready to use. Grown pesticide-free on local farms around Sukkur and delivered within 24 hours of harvest.",
    relatedIds: ["prod-6", "prod-2", "prod-11"],
    reviewsList: makeReviews(5, 6),
  },
  {
    id: "prod-2", name: "Greek Style Yogurt", slug: "greek-style-yogurt",
    category: "Dairy & Eggs", brand: "Olpers", price: 340, originalPrice: null, discount: 0,
    images: [
      "https://images.unsplash.com/photo-1571212515416-fca988083b70?w=800&q=80",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
    ],
    rating: 4.8, reviewCount: 122, unit: "500g tub", badge: "New", inStock: true, stockCount: 30,
    variants: [
      {
        id: "prod-2-var-250g",
        name: "250g tub",
        sku: "YOG-250",
        price: 240,
        discountPrice: 220,
        unit: "250g tub",
        stock: 22,
        isDefault: true,
        images: [
          {
            id: 'prod-2-var-250g-img-1',
            imageUrl: 'https://images.unsplash.com/photo-1571212515416-fca988083b70?w=1200&q=80',
            thumbnailUrl: 'https://images.unsplash.com/photo-1571212515416-fca988083b70?w=500&q=60',
            altText: 'Greek yogurt 250g - pack',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            id: 'prod-2-var-250g-img-2',
            imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&q=80',
            thumbnailUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=60',
            altText: 'Greek yogurt in bowl',
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
      {
        id: "prod-2-var-1kg",
        name: "1kg tub",
        sku: "YOG-1KG",
        price: 640,
        discountPrice: null,
        unit: "1kg tub",
        stock: 8,
        images: [
          {
            id: 'prod-2-var-1kg-img-1',
            imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&q=80',
            thumbnailUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=60',
            altText: 'Greek yogurt 1kg tub',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
    ],
    description: "Thick, creamy Greek-style yogurt made from full-cream milk. High in protein, no added sugar, perfect for breakfast bowls or cooking.",
    relatedIds: ["prod-8", "prod-13", "prod-6"],
    reviewsList: makeReviews(5, 4),
  },
  {
    id: "prod-3", name: "Sourdough Artisan Loaf", slug: "sourdough-artisan-loaf",
    category: "Bakery", brand: "National Foods", price: 450, originalPrice: null, discount: 0,
    images: [
      "https://images.unsplash.com/photo-1585478259715-4d3a5f3e3d5c?w=800&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    ],
    rating: 4.9, reviewCount: 61, unit: "1 loaf", badge: "Best Seller", inStock: true, stockCount: 15,
    description: "72-hour naturally fermented sourdough, baked fresh every morning. Crisp crust, open airy crumb — no additives or preservatives.",
    relatedIds: ["prod-9", "prod-13"],
    reviewsList: makeReviews(5, 5),
  },
  {
    id: "prod-4", name: "Norwegian Salmon Fillet", slug: "norwegian-salmon-fillet",
    category: "Meat & Seafood", brand: "Engro Foods", price: 1650, originalPrice: 1850, discount: 11,
    images: [
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    ],
    rating: 4.8, reviewCount: 47, unit: "500g", badge: "Premium", inStock: true, stockCount: 8,
    description: "Sustainably farmed Norwegian salmon, flash-frozen at peak freshness. Rich in omega-3, perfect for grilling or pan-searing.",
    relatedIds: ["prod-6", "prod-11"],
    reviewsList: makeReviews(4, 3),
  },
  {
    id: "prod-5", name: "Cold Brew Coffee Concentrate", slug: "cold-brew-coffee-concentrate",
    category: "Beverages", brand: "Nestlé", price: 620, originalPrice: null, discount: 0,
    images: [
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
      "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&q=80",
    ],
    rating: 4.6, reviewCount: 39, unit: "750ml", badge: "New", inStock: true, stockCount: 22,
    description: "Smooth, low-acid cold brew concentrate. Dilute 1:3 with water or milk — makes up to 6 servings per bottle.",
    relatedIds: ["prod-9"],
    reviewsList: makeReviews(4, 3),
  },
  {
    id: "prod-6", name: "Mixed Berry Granola", slug: "mixed-berry-granola",
    category: "Snacks", brand: "National Foods", price: 510, originalPrice: 590, discount: 14,
    images: [
      "https://images.unsplash.com/photo-1517686748843-bb360cd21e6b?w=800&q=80",
      "https://images.unsplash.com/photo-1541599468348-e96984315921?w=800&q=80",
    ],
    rating: 4.7, reviewCount: 84, unit: "400g", badge: "Organic", inStock: true, stockCount: 50,
    variants: [
      {
        id: "prod-6-var-400g",
        name: "400g pack",
        sku: "GRN-400",
        price: 510,
        discountPrice: 450,
        unit: "400g pack",
        stock: 35,
        isDefault: true,
      },
      {
        id: "prod-6-var-750g",
        name: "750g pack",
        sku: "GRN-750",
        price: 890,
        discountPrice: 820,
        unit: "750g pack",
        stock: 15,
      },
    ],
    description: "Oats, almonds, and freeze-dried berries baked to a golden crunch. No refined sugar — sweetened naturally with honey.",
    relatedIds: ["prod-1", "prod-2"],
    reviewsList: makeReviews(5, 7),
  },
  {
    id: "prod-7", name: "Extra Virgin Coconut Oil", slug: "extra-virgin-coconut-oil",
    category: "Pantry", brand: "Unilever", price: 890, originalPrice: null, discount: 0,
    images: [
      "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800&q=80",
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
    ],
    rating: 4.5, reviewCount: 55, unit: "500ml", badge: null, inStock: false, stockCount: 0,
    description: "Cold-pressed, unrefined coconut oil. Ideal for cooking, baking, or skincare — retains natural coconut aroma.",
    relatedIds: ["prod-14"],
    reviewsList: makeReviews(4, 2),
  },
  {
    id: "prod-8", name: "Free-Range Chicken Eggs", slug: "free-range-chicken-eggs",
    category: "Dairy & Eggs", brand: "Engro Foods", price: 420, originalPrice: 480, discount: 13,
    images: [
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&q=80",
    ],
    rating: 4.8, reviewCount: 167, unit: "Tray of 12", badge: "Best Seller", inStock: true, stockCount: 60,
    description: "Eggs from free-range hens raised without antibiotics. Rich golden yolks, collected daily.",
    relatedIds: ["prod-2", "prod-3"],
    reviewsList: makeReviews(5, 9),
  },
  {
    id: "prod-9", name: "Sella Basmati Rice", slug: "sella-basmati-rice",
    category: "Grocery", brand: "Shan Foods", price: 1950, originalPrice: null, discount: 0,
    images: [
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    ],
    rating: 4.9, reviewCount: 512, unit: "5kg bag", badge: "Best Seller", inStock: true, stockCount: 90,
    description: "Extra-long grain Sella basmati, aged for a full year for maximum aroma and separate, fluffy grains.",
    relatedIds: ["prod-13", "prod-3"],
    reviewsList: makeReviews(5, 12),
  },
  {
    id: "prod-10", name: "Full Cream Milk", slug: "full-cream-milk",
    category: "Dairy & Eggs", brand: "Olpers", price: 320, originalPrice: null, discount: 0,
    images: [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80",
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80",
    ],
    rating: 4.7, reviewCount: 431, unit: "1.5L pack", badge: null, inStock: true, stockCount: 75,
    description: "UHT full cream milk, homogenized and pasteurized. No preservatives, 6-month shelf life unopened.",
    relatedIds: ["prod-2", "prod-8"],
    reviewsList: makeReviews(4, 5),
  },
  {
    id: "prod-11", name: "Red Onions", slug: "red-onions",
    category: "Fruits & Vegetables", brand: "National Foods", price: 140, originalPrice: null, discount: 0,
    images: [
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&q=80",
      "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800&q=80",
    ],
    rating: 4.6, reviewCount: 388, unit: "2kg bag", badge: null, inStock: true, stockCount: 110,
    description: "Firm, medium-sized red onions sourced from Sindh farms. Ideal shelf life and consistent size for cooking.",
    relatedIds: ["prod-1", "prod-4"],
    reviewsList: makeReviews(4, 4),
  },
  {
    id: "prod-12", name: "Sunflower Cooking Oil", slug: "sunflower-cooking-oil",
    category: "Pantry", brand: "Unilever", price: 980, originalPrice: 1120, discount: 13,
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
      "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800&q=80",
    ],
    rating: 4.8, reviewCount: 359, unit: "3L bottle", badge: "Best Seller", inStock: true, stockCount: 65,
    variants: [
      {
        id: "prod-12-var-1l",
        name: "1L bottle",
        sku: "OIL-1L",
        price: 520,
        discountPrice: null,
        unit: "1L",
        stock: 24,
        isDefault: true,
      },
      {
        id: "prod-12-var-3l",
        name: "3L bottle",
        sku: "OIL-3L",
        price: 2840,
        discountPrice: 2540,
        unit: "3L",
        stock: 41,
      },
    ],
    description: "Light, low-cholesterol sunflower oil suitable for daily cooking and deep frying.",
    relatedIds: ["prod-7", "prod-9"],
    reviewsList: makeReviews(5, 8),
  },
  {
    id: "prod-13", name: "Chapati Wheat Flour", slug: "chapati-wheat-flour",
    category: "Grocery", brand: "Shan Foods", price: 1150, originalPrice: null, discount: 0,
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&q=80",
    ],
    rating: 4.9, reviewCount: 302, unit: "10kg bag", badge: "Best Seller", inStock: true, stockCount: 40,
    description: "Stone-ground whole wheat flour, chakki-fresh. No bleaching agents or additives.",
    relatedIds: ["prod-3", "prod-9"],
    reviewsList: makeReviews(5, 6),
  },
  {
    id: "prod-14", name: "Chicken Breast Fillet", slug: "chicken-breast-fillet",
    category: "Meat & Seafood", brand: "Engro Foods", price: 890, originalPrice: 1050, discount: 15,
    images: [
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80",
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80",
    ],
    rating: 4.6, reviewCount: 154, unit: "1kg pack", badge: null, inStock: true, stockCount: 35,
    description: "Boneless, skinless chicken breast, halal certified and vacuum-sealed for freshness.",
    relatedIds: ["prod-4", "prod-11"],
    reviewsList: makeReviews(4, 5),
  },
  {
    id: "prod-15", name: "Sindhri Mangoes (Crate 5kg)", slug: "sindhri-mangoes-crate",
    category: "Fruits & Vegetables", brand: "National Foods", price: 1450, originalPrice: 1900, discount: 24,
    images: [
      "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=800&q=80",
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
    ],
    rating: 4.8, reviewCount: 214, unit: "1 crate", badge: "Seasonal", inStock: true, stockCount: 18,
    description: "Peak-season Sindhri mangoes, hand-selected from orchards around Sukkur. Naturally ripened, no carbide.",
    relatedIds: ["prod-11", "prod-1"],
    reviewsList: makeReviews(5, 10),
  },
  {
    id: "prod-16", name: "Whole Wheat Bread Loaf", slug: "whole-wheat-bread-loaf",
    category: "Bakery", brand: "National Foods", price: 220, originalPrice: 280, discount: 21,
    images: [
      "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=800&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    ],
    rating: 4.5, reviewCount: 76, unit: "600g loaf", badge: null, inStock: true, stockCount: 28,
    description: "Soft whole wheat sandwich bread, baked daily with no artificial preservatives.",
    relatedIds: ["prod-3"],
    reviewsList: makeReviews(4, 4),
  },
];

export const getProducts = () => {
  const persistedProducts = getPersistedProducts(seedProducts);
  const list = Array.isArray(persistedProducts) ? persistedProducts : [];
  return list.map((product, index) => normalizeProduct(product, `product-${index + 1}`));
};

export const products = getProducts();

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
  return getProducts().find((product) => {
    const slugValue = product.slug || slugify(product.name);
    return product.id === normalizedValue || slugValue === normalizedValue || slugValue === slugify(normalizedValue);
  }) ?? null;
};

export const getRelatedProducts = (product) => {
  if (!product) return [];
  return (product.relatedIds ?? []).map((id) => getProductById(id)).filter(Boolean);
};

// Price range for filter bounds
export const priceRange = {
  min: Math.min(...products.map((p) => getEffectiveProductPrice(p))),
  max: Math.max(...products.map((p) => getEffectiveProductPrice(p))),
};
