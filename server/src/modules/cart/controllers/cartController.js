import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as cartService from '../services/cartService.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  sendResponse(res, 200, cart, 'Cart fetched');
});

export const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user.id, req.body);
  sendResponse(res, 200, cart, 'Item added to cart');
});

export const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItemQuantity(req.user.id, req.params.itemId, req.body.quantity);
  sendResponse(res, 200, cart, 'Cart item updated');
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.itemId);
  sendResponse(res, 200, cart, 'Item removed from cart');
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  sendResponse(res, 200, cart, 'Cart cleared');
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.applyCoupon(req.user.id, req.body.code);
  sendResponse(res, 200, cart, 'Coupon applied');
});

export const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCoupon(req.user.id);
  sendResponse(res, 200, cart, 'Coupon removed');
});
