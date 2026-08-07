import Product from '../models/productModel.js';
import Category from '../../categories/models/categoryModel.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiFeatures, buildPaginationMeta } from '../../../utils/apiFeatures.js';
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../../../config/cloudinary.js';

const applyPriceRange = (query, { minPrice, maxPrice }) => {
  if (minPrice == null && maxPrice == null) return query;
  const priceFilter = {};
  if (minPrice != null) priceFilter.$gte = Number(minPrice);
  if (maxPrice != null) priceFilter.$lte = Number(maxPrice);
  return { ...query, price: priceFilter };
};

export const listProducts = async (queryString) => {
  const { category: categoryId, ...restQuery } = queryString;
  const baseFilter = applyPriceRange({}, restQuery);
  if (restQuery.inStock === 'true' || restQuery.inStock === true) baseFilter.stock = { $gt: 0 };
  // A product can belong to one primary category plus any number of
  // additional categories — matching either keeps every browse/filter path
  // working the same way regardless of which list a product was added to.
  if (categoryId) baseFilter.$or = [{ category: categoryId }, { additionalCategories: categoryId }];

  const countFeatures = new ApiFeatures(Product.find(baseFilter), restQuery).filter();
  const total = await Product.countDocuments(countFeatures.query.getFilter());

  const features = new ApiFeatures(
    Product.find(baseFilter)
      .populate('category', 'name slug')
      .populate('additionalCategories', 'name slug')
      .populate('brand', 'name slug'),
    restQuery
  )
    .filter()
    .search(['name', 'description', 'tags'])
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;
  return { products, meta: buildPaginationMeta({ ...features.pagination, total }) };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate('category', 'name slug')
    .populate('additionalCategories', 'name slug')
    .populate('brand', 'name slug');
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true })
    .populate('category', 'name slug')
    .populate('additionalCategories', 'name slug')
    .populate('brand', 'name slug');
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};
const ensureUniqueVariantSkus = (variants = []) => {
  const skus = variants
    .map((variant) => variant.sku?.trim().toUpperCase())
    .filter(Boolean);
  const duplicates = skus.filter((sku, index) => skus.indexOf(sku) !== index);
  if (duplicates.length) {
    throw ApiError.badRequest(`Duplicate variant SKU(s) detected: ${[...new Set(duplicates)].join(', ')}`);
  }
};

export const createProduct = async (data) => {
  const category = await Category.findById(data.category);
  if (!category) throw ApiError.badRequest('Category not found');

  if (data.additionalCategories?.length) {
    const count = await Category.countDocuments({ _id: { $in: data.additionalCategories } });
    if (count !== data.additionalCategories.length) {
      throw ApiError.badRequest('One or more additional categories were not found');
    }
  }

  const existingSku = await Product.findOne({ sku: data.sku });
  if (existingSku) throw ApiError.conflict('A product with this SKU already exists');

  ensureUniqueVariantSkus(data.variants);
  return Product.create(data);
};

export const updateProduct = async (id, updates) => {
  if (updates.variants) ensureUniqueVariantSkus(updates.variants);
  const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

const buildImageRecord = ({ url, public_id, altText = '', sortOrder = 0, isPrimary = false }) => ({
  url,
  publicId: public_id,
  altText,
  sortOrder,
  isPrimary,
});

export const addProductImages = async (id, files) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  const uploads = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer, { folder: 'united-mart-sukkur/products' }))
  );

  const newImages = uploads.map((result, index) => ({
    ...buildImageRecord(result),
    isPrimary: product.images.length === 0 && index === 0,
    sortOrder: product.images.length + index,
  }));

  product.images.push(...newImages);
  await product.save();
  return product;
};

export const addVariantImages = async (id, variantId, files) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  const variant = product.variants.id(variantId);
  if (!variant) throw ApiError.notFound('Variant not found');

  const uploads = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer, { folder: 'united-mart-sukkur/variant-images' }))
  );

  const newImages = uploads.map((result, index) => ({
    ...buildImageRecord(result),
    isPrimary: variant.images.length === 0 && index === 0,
    sortOrder: variant.images.length + index,
  }));

  variant.images.push(...newImages);
  await product.save();
  return product;
};

export const removeProductImage = async (id, imagePublicId) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  const image = product.images.find((img) => img.publicId === imagePublicId);
  if (!image) throw ApiError.notFound('Image not found on this product');

  await deleteFromCloudinary(image.publicId);
  product.images = product.images.filter((img) => img.publicId !== imagePublicId);
  await product.save();
  return product;
};

export const removeVariantImage = async (id, variantId, imagePublicId) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  const variant = product.variants.id(variantId);
  if (!variant) throw ApiError.notFound('Variant not found');

  const image = variant.images.find((img) => img.publicId === imagePublicId);
  if (!image) throw ApiError.notFound('Image not found on this variant');

  await deleteFromCloudinary(image.publicId);
  variant.images = variant.images.filter((img) => img.publicId !== imagePublicId);
  await product.save();
  return product;
};

export const adjustStock = async (id, quantityDelta) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  const newStock = product.stock + quantityDelta;
  if (newStock < 0) throw ApiError.badRequest('Insufficient stock for this operation');

  product.stock = newStock;
  await product.save();
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw ApiError.notFound('Product not found');

  await Promise.all(product.images.map((img) => deleteFromCloudinary(img.publicId)));
  return product;
};

export const getFeaturedProducts = async (limit = 12) =>
  Product.find({ isFeatured: true, isActive: true }).limit(Number(limit)).sort('-createdAt');

export const getLowStockProducts = async () =>
  Product.find({ isActive: true, $expr: { $lte: ['$stock', '$lowStockThreshold'] }, stock: { $gt: 0 } });

export const getOutOfStockProducts = async () => Product.find({ isActive: true, stock: 0 });
