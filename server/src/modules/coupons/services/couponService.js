import Coupon from '../models/couponModel.js';
import Product from '../../products/models/productModel.js';
import Category from '../../categories/models/categoryModel.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiFeatures, buildPaginationMeta } from '../../../utils/apiFeatures.js';

export const listCoupons = async (queryString) => {
  const total = await Coupon.countDocuments(new ApiFeatures(Coupon.find(), queryString).filter().query.getFilter());
  const features = new ApiFeatures(Coupon.find(), queryString).filter().sort().limitFields().paginate();
  const coupons = await features.query;
  return { coupons, meta: buildPaginationMeta({ ...features.pagination, total }) };
};

export const getCouponById = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw ApiError.notFound('Coupon not found');
  return coupon;
};

export const createCoupon = async (data) => {
  const existing = await Coupon.findOne({ code: data.code });
  if (existing) throw ApiError.conflict('A coupon with this code already exists');
  return Coupon.create(data);
};

export const updateCoupon = async (id, updates) => {
  const coupon = await Coupon.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!coupon) throw ApiError.notFound('Coupon not found');
  return coupon;
};

export const deleteCoupon = async (id) => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw ApiError.notFound('Coupon not found');
  return coupon;
};

// Splits cart items into the part a coupon applies to and the part it doesn't.
// Prices and categories always come from the database, never the client. Only a
// product's primary category is checked: a product filed under an excluded
// category stays excluded even if one of its additionalCategories isn't.
// Items that no longer exist are skipped — order creation rejects those itself.
export const calculateEligibleSubtotal = async (items, coupon, session = null) => {
  const excluded = new Set((coupon.excludedCategories ?? []).map((id) => id.toString()));
  const productIds = [...new Set(items.map((item) => item.productId.toString()))];
  const products = await Product.find({ _id: { $in: productIds } })
    .select('category price discountPrice variants isActive')
    .session(session);
  const productsById = new Map(products.map((product) => [product._id.toString(), product]));

  let subtotal = 0;
  let eligibleSubtotal = 0;
  const excludedCategoryIdsInCart = new Set();

  for (const item of items) {
    const product = productsById.get(item.productId.toString());
    if (!product || !product.isActive) continue;
    const variant = item.variantId ? product.variants.id(item.variantId) : null;
    if (item.variantId && !variant) continue;

    const effectivePrice = variant
      ? variant.discountPrice != null ? variant.discountPrice : variant.price
      : product.discountPrice != null ? product.discountPrice : product.price;
    const lineTotal = effectivePrice * item.quantity;
    subtotal += lineTotal;

    const categoryId = product.category?.toString();
    if (categoryId && excluded.has(categoryId)) excludedCategoryIdsInCart.add(categoryId);
    else eligibleSubtotal += lineTotal;
  }

  return {
    subtotal,
    eligibleSubtotal,
    excludedSubtotal: subtotal - eligibleSubtotal,
    excludedCategoryIds: [...excludedCategoryIdsInCart],
  };
};

const describeExcludedCategories = async (categoryIds) => {
  const categories = await Category.find({ _id: { $in: categoryIds } }).select('name');
  return categories.map((category) => category.name).join(', ') || 'some categories';
};

export const validateCouponForUser = async ({ code, items, userId }) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon || !coupon.isCurrentlyValid()) throw ApiError.badRequest('Invalid or expired coupon');

  const { eligibleSubtotal, excludedSubtotal, excludedCategoryIds } = await calculateEligibleSubtotal(items, coupon);

  // Only reachable when the coupon has exclusions and the cart holds excluded
  // items — coupons without exclusions behave exactly as before.
  if (excludedSubtotal > 0 && eligibleSubtotal === 0) {
    const names = await describeExcludedCategories(excludedCategoryIds);
    throw ApiError.badRequest(`None of the items in your cart are eligible for this coupon. ${names} don't count toward it.`);
  }
  if (eligibleSubtotal < coupon.minPurchaseAmount) {
    if (excludedSubtotal > 0) {
      const shortfall = Math.ceil(coupon.minPurchaseAmount - eligibleSubtotal);
      const names = await describeExcludedCategories(excludedCategoryIds);
      throw ApiError.badRequest(
        `Add Rs ${shortfall.toLocaleString('en-PK')} more of eligible items. Some categories, like ${names}, don't count toward this coupon.`
      );
    }
    throw ApiError.badRequest(`Minimum purchase of Rs.${coupon.minPurchaseAmount} required for this coupon`);
  }

  // Guests have no persistent identity to track per-user usage against —
  // only enforced for a logged-in user.
  const userUsage = userId ? coupon.usersUsed.find((u) => u.user.toString() === userId) : null;
  if (userUsage && userUsage.count >= coupon.usageLimitPerUser) {
    throw ApiError.badRequest('You have already used this coupon the maximum number of times');
  }

  // calculateDiscount caps the discount at the amount it's given, so it can
  // never exceed the eligible subtotal.
  const discount = coupon.calculateDiscount(eligibleSubtotal);
  return { coupon, discount, eligibleSubtotal };
};

// Marks the coupon as used by this user; called once an order is successfully placed.
export const registerCouponUsage = async (couponId, userId) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) return null;

  coupon.usedCount += 1;
  const userUsage = coupon.usersUsed.find((u) => u.user.toString() === userId.toString());
  if (userUsage) userUsage.count += 1;
  else coupon.usersUsed.push({ user: userId, count: 1 });

  await coupon.save();
  return coupon;
};
