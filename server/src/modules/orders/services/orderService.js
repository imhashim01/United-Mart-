import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import Cart from '../../cart/models/cartModel.js';
import Product from '../../products/models/productModel.js';
import Coupon from '../../coupons/models/couponModel.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiFeatures, buildPaginationMeta } from '../../../utils/apiFeatures.js';
import { generateOrderNumber } from '../../../utils/generateInvoiceNumber.js';
import { earnPoints, calculatePointsForAmount } from '../../rewards/services/rewardService.js';
import { createInvoiceForOrder } from '../../invoices/services/invoiceService.js';
import { createPaymentForOrder } from '../../payments/services/paymentService.js';
import { notifyUser } from '../../notifications/services/notificationService.js';

const TAX_RATE = Number(process.env.TAX_RATE || 0);
const FLAT_SHIPPING_FEE = Number(process.env.SHIPPING_FEE || 200);
const FREE_SHIPPING_THRESHOLD = Number(process.env.FREE_SHIPPING_THRESHOLD || 5000);

const canUseTransactions = () => mongoose.connection.readyState === 1 && !!process.env.MONGO_REPLICA_SET;

export const createOrderFromCart = async ({ userId, shippingAddress, billingAddress, paymentMethod, couponCode, customerNote, items }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw ApiError.badRequest('Your cart is empty');
  }

  const useTransaction = canUseTransactions();
  const session = useTransaction ? await mongoose.startSession() : null;
  if (session) session.startTransaction();

  try {
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of items) {
      const product = await Product.findById(cartItem.productId).session(session);
      if (!product || !product.isActive) {
        throw ApiError.badRequest('One of the items in your cart is no longer available');
      }

      let variant = null;
      if (cartItem.variantId) {
        variant = product.variants.id(cartItem.variantId);
        if (!variant) throw ApiError.badRequest(`Selected variant for "${product.name}" is no longer available`);
      }

      const availableStock = variant ? variant.stock : product.stock;
      if (availableStock < cartItem.quantity) {
        throw ApiError.badRequest(`Insufficient stock for "${product.name}". Available: ${availableStock}`);
      }

      const effectivePrice = variant
        ? variant.discountPrice != null ? variant.discountPrice : variant.price
        : product.discountPrice != null ? product.discountPrice : product.price;

      const itemSubtotal = effectivePrice * cartItem.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        variantId: variant?._id ?? null,
        variantName: variant?.name ?? null,
        variantSku: variant?.sku ?? null,
        variantUnit: variant?.unit ?? product.unit,
        name: product.name,
        image: product.images?.[0]?.url,
        price: effectivePrice,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal,
      });

      if (variant) {
        variant.stock -= cartItem.quantity;
      } else {
        product.stock -= cartItem.quantity;
      }
      product.totalSold += cartItem.quantity;
      await product.save({ session });
    }

    let discountAmount = 0;
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true }).session(session);
      if (coupon) {
        const meetsMinSpend = !coupon.minSpend || subtotal >= coupon.minSpend;
        const withinUsageLimit = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
        const withinExpiry = !coupon.expiresAt || new Date(coupon.expiresAt) >= new Date();
        if (meetsMinSpend && withinUsageLimit && withinExpiry) {
          discountAmount = coupon.type === 'percent'
            ? Math.round((subtotal * coupon.value) / 100)
            : coupon.value;
          discountAmount = Math.min(discountAmount, subtotal);
        } else {
          coupon = null;
        }
      }
    }

    const taxableAmount = subtotal - discountAmount;
    const taxAmount = Math.round(taxableAmount * TAX_RATE);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
    const totalAmount = taxableAmount + taxAmount + shippingFee;

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          shippingAddress,
          billingAddress: billingAddress || shippingAddress,
          paymentMethod,
          subtotal,
          discountAmount,
          taxAmount,
          shippingFee,
          totalAmount,
          coupon: coupon?._id ?? null,
          orderNumber: generateOrderNumber(),
          customerNote,
          orderStatus: 'pending',
          statusHistory: [{ status: 'pending', changedAt: new Date(), note: 'Order placed' }],
        },
      ],
      { session }
    );

    if (coupon) {
      coupon.usedCount += 1;
      await coupon.save({ session });
    }

    await createPaymentForOrder(
  {
    orderId: order._id,
    userId,
    amount: totalAmount,
    method: paymentMethod,
  },
  session
);

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }
    try {
      await earnPoints(userId, calculatePointsForAmount(totalAmount));
      await createInvoiceForOrder(order);
      await notifyUser(userId, `Your order ${order.orderNumber} has been placed successfully.`);
    } catch (sideEffectError) {
      console.error('Post-order side effects failed:', sideEffectError.message);
    }

    return order;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

export const listOrders = async (queryString, filter = {}) => {
  const total = await Order.countDocuments({ ...filter, ...new ApiFeatures(Order.find(), queryString).filter().query.getFilter() });
  const features = new ApiFeatures(Order.find(filter).populate('user', 'name email'), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;
  return { orders, meta: buildPaginationMeta({ ...features.pagination, total }) };
};

export const getOrderById = async (id, { userId, isAdmin } = {}) => {
  const order = await Order.findById(id).populate('user', 'name email').populate('coupon', 'code discountType discountValue');
  if (!order) throw ApiError.notFound('Order not found');
  if (!isAdmin && userId && order.user._id.toString() !== userId) {
    throw ApiError.forbidden('You do not have permission to view this order');
  }
  return order;
};

export const updateOrderStatus = async (id, { status, note }, changedBy) => {
  const order = await Order.findById(id);
  if (!order) throw ApiError.notFound('Order not found');

  order.orderStatus = status;
  order.statusHistory.push({ status, note, changedBy, changedAt: new Date() });
  if (status === 'delivered') order.deliveredAt = new Date();
  if (status === 'delivered' && order.paymentMethod === 'cod') order.paymentStatus = 'paid';

  await order.save();

  await notifyUser({
    userId: order.user,
    title: 'Order status updated',
    message: `Your order ${order.orderNumber} is now "${status}".`,
    type: 'order',
    link: `/orders/${order._id}`,
  });

  return order;
};

export const cancelOrder = async (id, { reason }, requester) => {
  const order = await Order.findById(id);
  if (!order) throw ApiError.notFound('Order not found');

  const isOwner = order.user.toString() === requester.id;
  if (!isOwner && !['admin', 'manager'].includes(requester.role)) {
    throw ApiError.forbidden('You do not have permission to cancel this order');
  }
  if (['delivered', 'cancelled', 'returned'].includes(order.orderStatus)) {
    throw ApiError.badRequest(`Order cannot be cancelled once it is "${order.orderStatus}"`);
  }

  order.orderStatus = 'cancelled';
  order.cancelReason = reason;
  order.cancelledAt = new Date();
  order.statusHistory.push({ status: 'cancelled', note: reason, changedBy: requester.id, changedAt: new Date() });
  await order.save();

  await Promise.all(
    order.items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) return;
      if (item.variantId) {
        const variant = product.variants.id(item.variantId);
        if (variant) variant.stock += item.quantity;
      } else {
        product.stock += item.quantity;
      }
      product.totalSold -= item.quantity;
      await product.save();
    })
  );

  await notifyUser({
    userId: order.user,
    title: 'Order cancelled',
    message: `Your order ${order.orderNumber} has been cancelled.`,
    type: 'order',
    link: `/orders/${order._id}`,
  });

  return order;
};

export const getMyOrders = async (userId, queryString) => listOrders(queryString, { user: userId });
