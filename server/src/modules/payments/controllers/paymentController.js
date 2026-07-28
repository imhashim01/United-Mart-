import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as paymentService from '../services/paymentService.js';

export const listPayments = asyncHandler(async (req, res) => {
  const { payments, meta } = await paymentService.listPayments(req.query);
  sendResponse(res, 200, payments, 'Payments fetched', meta);
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const { payments, meta } = await paymentService.getMyPayments(req.user.id, req.query);
  sendResponse(res, 200, payments, 'Your payments fetched', meta);
});

export const getPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  sendResponse(res, 200, payment, 'Payment fetched');
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const payment = await paymentService.updatePaymentStatus(req.params.id, req.body);
  sendResponse(res, 200, payment, 'Payment status updated');
});

export const refundPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.refundPayment(req.params.id, req.body);
  sendResponse(res, 200, payment, 'Payment refunded');
});
