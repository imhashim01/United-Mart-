import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as orderService from '../services/orderService.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrderFromCart({ userId: req.user.id, ...req.body });
  sendResponse(res, 201, order, 'Order placed successfully');
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const { orders, meta } = await orderService.getMyOrders(req.user.id, req.query);
  sendResponse(res, 200, orders, 'Your orders fetched', meta);
});

export const listOrders = asyncHandler(async (req, res) => {
  const { orders, meta } = await orderService.listOrders(req.query);
  sendResponse(res, 200, orders, 'Orders fetched', meta);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, {
    userId: req.user.id,
    isAdmin: ['admin', 'manager'].includes(req.user.role),
  });
  sendResponse(res, 200, order, 'Order fetched');
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body, req.user.id);
  sendResponse(res, 200, order, 'Order status updated');
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.body, req.user);
  sendResponse(res, 200, order, 'Order cancelled');
});
