import Coupon from '../models/couponModel.js';
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

export const validateCouponForUser = async ({ code, subtotal, userId }) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon || !coupon.isCurrentlyValid()) throw ApiError.badRequest('Invalid or expired coupon');
  if (subtotal < coupon.minPurchaseAmount) {
    throw ApiError.badRequest(`Minimum purchase of Rs.${coupon.minPurchaseAmount} required for this coupon`);
  }

  const userUsage = coupon.usersUsed.find((u) => u.user.toString() === userId);
  if (userUsage && userUsage.count >= coupon.usageLimitPerUser) {
    throw ApiError.badRequest('You have already used this coupon the maximum number of times');
  }

  const discount = coupon.calculateDiscount(subtotal);
  return { coupon, discount };
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
