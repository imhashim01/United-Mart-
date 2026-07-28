import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    altText: { type: String, trim: true, default: '' },
    sortOrder: { type: Number, default: 0 },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 100 },
    sku: { type: String, required: true, uppercase: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function validateDiscount(value) {
          return value == null || value < this.price;
        },
        message: 'Discount price must be less than the regular price',
      },
    },
    costPrice: { type: Number, min: 0, select: false },
    unit: { type: String, default: 'pcs', trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    attributes: { type: Map, of: String },
    tags: [{ type: String, trim: true, lowercase: true }],
    isDefault: { type: Boolean, default: false },
    images: [imageSchema],
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true, index: true },
    description: { type: String, required: true, trim: true },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function validateDiscount(value) {
          return value == null || value < this.price;
        },
        message: 'Discount price must be less than the regular price',
      },
    },
    costPrice: { type: Number, min: 0, select: false },
    unit: { type: String, default: 'pcs', trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    images: [imageSchema],
    variants: [variantSchema],
    attributes: { type: Map, of: String },
    tags: [{ type: String, trim: true, lowercase: true }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isTodaysDeal: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    totalSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'variants.sku': 1 });

productSchema.virtual('defaultVariant').get(function defaultVariant() {
  if (!this.variants?.length) return null;
  return this.variants.find((item) => item.isDefault) ?? this.variants[0];
});

productSchema.virtual('effectivePrice').get(function effectivePrice() {
  if (this.variants?.length) {
    const variant = this.defaultVariant;
    return variant.discountPrice != null ? variant.discountPrice : variant.price;
  }
  return this.discountPrice != null ? this.discountPrice : this.price;
});

productSchema.virtual('stockCount').get(function stockCount() {
  if (this.variants?.length) {
    return this.variants.reduce((sum, item) => sum + (item.stock ?? 0), 0);
  }
  return this.stock;
});

productSchema.virtual('inStock').get(function inStock() {
  if (this.variants?.length) {
    return this.variants.some((item) => item.stock > 0);
  }
  return this.stock > 0;
});

productSchema.virtual('isLowStock').get(function isLowStock() {
  if (this.variants?.length) {
    return this.variants.some(
      (item) => item.stock > 0 && item.stock <= item.lowStockThreshold
    );
  }
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

productSchema.pre('validate', function generateSlug(next) {
  if (this.name && (this.isModified('name') || !this.slug)) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }

  if (this.variants?.length) {
    this.stock = this.variants.reduce((sum, item) => sum + (item.stock ?? 0), 0);
  }

  next();
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);

export default Product;
