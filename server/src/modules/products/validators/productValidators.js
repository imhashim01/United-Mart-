import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().required(),
  shortDescription: Joi.string().trim().max(300).allow('', null),
  sku: Joi.string().trim().uppercase().required(),
  category: Joi.string().hex().length(24).required(),
  additionalCategories: Joi.array().items(Joi.string().hex().length(24)).default([]),
  brand: Joi.string().hex().length(24).allow(null, ''),
  price: Joi.number().min(0).required(),
  discountPrice: Joi.number().min(0).allow(null),
  costPrice: Joi.number().min(0).allow(null),
  unit: Joi.string().trim().default('pcs'),
  stock: Joi.number().integer().min(0).required(),
  lowStockThreshold: Joi.number().integer().min(0).default(10),
  attributes: Joi.object().pattern(Joi.string(), Joi.string()),
  tags: Joi.array().items(Joi.string().trim().lowercase()),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().trim().required(),
      altText: Joi.string().trim().allow('', null),
      sortOrder: Joi.number().integer().min(0).default(0),
      isPrimary: Joi.boolean().default(false),
    })
  ).default([]),
  isFeatured: Joi.boolean().default(false),
  isBestSeller: Joi.boolean().default(false),
  isTodaysDeal: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
  variants: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().max(100).allow('', null),
        sku: Joi.string().trim().uppercase().required(),
        price: Joi.number().min(0).required(),
        discountPrice: Joi.number().min(0).allow(null),
        costPrice: Joi.number().min(0).allow(null),
        unit: Joi.string().trim().default('pcs'),
        stock: Joi.number().integer().min(0).default(0),
        lowStockThreshold: Joi.number().integer().min(0).default(10),
        attributes: Joi.object().pattern(Joi.string(), Joi.string()),
        tags: Joi.array().items(Joi.string().trim().lowercase()),
        isDefault: Joi.boolean(),
        images: Joi.array().items(
          Joi.object({
            url: Joi.string().uri().required(),
            publicId: Joi.string().trim().required(),
            altText: Joi.string().trim().allow('', null),
            sortOrder: Joi.number().integer().min(0).default(0),
            isPrimary: Joi.boolean().default(false),
          })
        ).default([]),
      })
    )
    .min(0),
});

export const updateProductSchema = Joi.object({
  // The frontend echoes an existing variant's real _id back on every save;
  // without it here, `validate`'s stripUnknown silently drops it, Mongoose
  // then treats every variant as brand new and mints a fresh _id for it —
  // breaking anything that had captured the old id (e.g. an in-progress
  // variant image upload, or an order line referencing that variant).
  //
  // Unlike the create schema, fields here must NOT carry a `.default(...)`:
  // this schema validates a PARTIAL update, and Joi injects `.default()`
  // values for any key the request simply didn't mention. `updateProduct`
  // then $sets that injected value, so e.g. `images: Joi.array().default([])`
  // silently wiped every product's images back to `[]` on every save that
  // didn't happen to touch them — which main-image/variant-image uploads
  // never do, since they go through their own dedicated endpoints.
  name: Joi.string().trim().min(2).max(200),
  description: Joi.string().trim(),
  shortDescription: Joi.string().trim().max(300).allow('', null),
  sku: Joi.string().trim().uppercase(),
  category: Joi.string().hex().length(24),
  additionalCategories: Joi.array().items(Joi.string().hex().length(24)),
  brand: Joi.string().hex().length(24).allow(null, ''),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0).allow(null),
  costPrice: Joi.number().min(0).allow(null),
  unit: Joi.string().trim(),
  lowStockThreshold: Joi.number().integer().min(0),
  attributes: Joi.object().pattern(Joi.string(), Joi.string()),
  tags: Joi.array().items(Joi.string().trim().lowercase()),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().trim().required(),
      altText: Joi.string().trim().allow('', null),
      sortOrder: Joi.number().integer().min(0).default(0),
      isPrimary: Joi.boolean().default(false),
    })
  ),
  isFeatured: Joi.boolean(),
  isBestSeller: Joi.boolean(),
  isTodaysDeal: Joi.boolean(),
  isActive: Joi.boolean(),
  variants: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().hex().length(24),
        name: Joi.string().trim().max(100).allow('', null),
        sku: Joi.string().trim().uppercase().required(),
        price: Joi.number().min(0).required(),
        discountPrice: Joi.number().min(0).allow(null),
        costPrice: Joi.number().min(0).allow(null),
        unit: Joi.string().trim().default('pcs'),
        stock: Joi.number().integer().min(0).default(0),
        lowStockThreshold: Joi.number().integer().min(0).default(10),
        attributes: Joi.object().pattern(Joi.string(), Joi.string()),
        tags: Joi.array().items(Joi.string().trim().lowercase()),
        isDefault: Joi.boolean(),
        images: Joi.array().items(
          Joi.object({
            url: Joi.string().uri().required(),
            publicId: Joi.string().trim().required(),
            altText: Joi.string().trim().allow('', null),
            sortOrder: Joi.number().integer().min(0).default(0),
            isPrimary: Joi.boolean().default(false),
          })
        ).default([]),
      })
    )
    .min(0),
});

export const adjustStockSchema = Joi.object({
  quantity: Joi.number().integer().required(),
  reason: Joi.string().trim().allow('', null),
});

export const listProductsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  // Matches apiFeatures.js's pagination ceiling — the storefront fetches the
  // whole catalog in one request rather than paging through it.
  limit: Joi.number().integer().min(1).max(1000),
  category: Joi.string(),
  brand: Joi.string(),
  isActive: Joi.boolean(),
  isFeatured: Joi.boolean(),
  inStock: Joi.boolean(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  search: Joi.string().trim(),
  keyword: Joi.string().trim(),
  sort: Joi.string(),
  fields: Joi.string(),
  price: Joi.object().unknown(true),
  stock: Joi.object().unknown(true),
}).unknown(true);
