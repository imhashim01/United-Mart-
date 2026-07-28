import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 300 },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number, min: 0, default: null },
    minPurchaseAmount: { type: Number, min: 0, default: 0 },
    usageLimit: { type: Number, min: 0, default: null },
    usedCount: { type: Number, default: 0, min: 0 },
    usageLimitPerUser: { type: Number, min: 0, default: 1 },
    usersUsed: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        count: { type: Number, default: 0 },
      },
    ],
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    validFrom: { type: Date, required: true, default: Date.now },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.index({ validFrom: 1, validUntil: 1 });

couponSchema.methods.isCurrentlyValid = function isCurrentlyValid() {
  const now = new Date();
  if (!this.isActive) return false;
  if (now < this.validFrom || now > this.validUntil) return false;
  if (this.usageLimit != null && this.usedCount >= this.usageLimit) return false;
  return true;
};

couponSchema.methods.calculateDiscount = function calculateDiscount(subtotal) {
  if (subtotal < this.minPurchaseAmount) return 0;
  let discount =
    this.discountType === 'percentage' ? (subtotal * this.discountValue) / 100 : this.discountValue;
  if (this.maxDiscountAmount != null) discount = Math.min(discount, this.maxDiscountAmount);
  return Math.min(discount, subtotal);
};

export const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
