import Cart from '../models/cartModel.js';
import Product from '../../products/models/productModel.js';
import Coupon from '../../coupons/models/couponModel.js';
import { ApiError } from '../../../utils/ApiError.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

export const getCart = async (userId) => {
  const cart = await (await getOrCreateCart(userId)).populate('coupon', 'code discountType discountValue');
  return cart;
};

export const addItem = async (userId, { productId, variantId, quantity }) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw ApiError.notFound('Product not found');

  let variant = null;
  if (variantId) {
    variant = product.variants.id(variantId);
    if (!variant) throw ApiError.notFound('Selected variant not found');
  }

  const availableStock = variant ? variant.stock : product.stock;
  if (availableStock < quantity) throw ApiError.badRequest('Not enough stock available');

  const effectivePrice = variant
    ? variant.discountPrice != null
      ? variant.discountPrice
      : variant.price
    : product.discountPrice != null
    ? product.discountPrice
    : product.price;

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find((item) => {
    const sameVariant = !item.variantId && !variantId
      ? true
      : item.variantId && variantId && item.variantId.toString() === variantId;
    return item.product.toString() === productId && sameVariant;
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (availableStock < newQuantity) throw ApiError.badRequest('Not enough stock available');
    existingItem.quantity = newQuantity;
    existingItem.price = effectivePrice;
  } else {
    cart.items.push({
      product: product._id,
      variantId: variant?._id ?? null,
      variantName: variant?.name ?? null,
      variantSku: variant?.sku ?? null,
      variantUnit: variant?.unit ?? product.unit,
      name: product.name,
      image: product.images?.[0]?.url,
      price: effectivePrice,
      quantity,
    });
  }

  await cart.save();
  return cart;
};

export const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) throw ApiError.notFound('Cart item not found');

  const product = await Product.findById(item.product);
  if (!product || !product.isActive) throw ApiError.notFound('Product not found');

  let availableStock = product.stock;
  if (item.variantId) {
    const variant = product.variants.id(item.variantId);
    if (!variant) throw ApiError.badRequest('Selected variant not found');
    availableStock = variant.stock;
  }

  if (availableStock < quantity) throw ApiError.badRequest('Not enough stock available');
  item.quantity = quantity;
  await cart.save();
  return cart;
};

export const removeItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) throw ApiError.notFound('Cart item not found');

  item.deleteOne();
  await cart.save();
  return cart;
};

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.coupon = null;
  await cart.save();
  return cart;
};

export const applyCoupon = async (userId, code) => {
  const cart = await getOrCreateCart(userId);
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon || !coupon.isCurrentlyValid()) throw ApiError.badRequest('Invalid or expired coupon');

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (subtotal < coupon.minPurchaseAmount) {
    throw ApiError.badRequest(`Minimum purchase of Rs.${coupon.minPurchaseAmount} required for this coupon`);
  }

  const userUsage = coupon.usersUsed.find((u) => u.user.toString() === userId);
  if (userUsage && userUsage.count >= coupon.usageLimitPerUser) {
    throw ApiError.badRequest('You have already used this coupon the maximum number of times');
  }

  cart.coupon = coupon._id;
  await cart.save();
  return cart.populate('coupon', 'code discountType discountValue');
};

export const removeCoupon = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.coupon = null;
  await cart.save();
  return cart;
};
