import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as couponService from '../services/couponService.js';

export const listCoupons = asyncHandler(async (req, res) => {
  const { coupons, meta } = await couponService.listCoupons(req.query);
  sendResponse(res, 200, coupons, 'Coupons fetched', meta);
});

export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.getCouponById(req.params.id);
  sendResponse(res, 200, coupon, 'Coupon fetched');
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  sendResponse(res, 201, coupon, 'Coupon created');
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  sendResponse(res, 200, coupon, 'Coupon updated');
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  sendResponse(res, 200, null, 'Coupon deleted');
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const result = await couponService.validateCouponForUser({
    code: req.body.code,
    subtotal: req.body.subtotal,
    userId: req.user.id,
  });
  sendResponse(res, 200, result, 'Coupon is valid');
});
