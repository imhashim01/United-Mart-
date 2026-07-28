import Payment from '../models/paymentModel.js';
import Order from '../../orders/models/orderModel.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiFeatures, buildPaginationMeta } from '../../../utils/apiFeatures.js';

export const createPaymentForOrder = async ({ orderId, userId, amount, method }, session) => {
  const [payment] = await Payment.create(
    [
      {
        order: orderId,
        user: userId,
        amount,
        method,
        status: method === 'cod' ? 'pending' : 'pending',
      },
    ],
    session ? { session } : {}
  );
  return payment;
};

export const listPayments = async (queryString, filter = {}) => {
  const total = await Payment.countDocuments({ ...filter, ...new ApiFeatures(Payment.find(), queryString).filter().query.getFilter() });
  const features = new ApiFeatures(Payment.find(filter).populate('order', 'orderNumber totalAmount').populate('user', 'name email'), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const payments = await features.query;
  return { payments, meta: buildPaginationMeta({ ...features.pagination, total }) };
};

export const getMyPayments = async (userId, queryString) => listPayments(queryString, { user: userId });

export const getPaymentById = async (id) => {
  const payment = await Payment.findById(id).populate('order', 'orderNumber totalAmount').populate('user', 'name email');
  if (!payment) throw ApiError.notFound('Payment not found');
  return payment;
};

export const updatePaymentStatus = async (id, { status, transactionId, failureReason }) => {
  const payment = await Payment.findById(id);
  if (!payment) throw ApiError.notFound('Payment not found');

  payment.status = status;
  if (transactionId) payment.transactionId = transactionId;
  if (failureReason) payment.failureReason = failureReason;
  if (status === 'completed') payment.paidAt = new Date();

  await payment.save();

  if (status === 'completed') {
    await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' });
  } else if (status === 'failed') {
    await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'failed' });
  }

  return payment;
};

export const refundPayment = async (id, { amount }) => {
  const payment = await Payment.findById(id);
  if (!payment) throw ApiError.notFound('Payment not found');
  if (payment.status !== 'completed') throw ApiError.badRequest('Only completed payments can be refunded');
  if (amount > payment.amount) throw ApiError.badRequest('Refund amount cannot exceed the original payment');

  payment.status = 'refunded';
  payment.refundAmount = amount;
  payment.refundedAt = new Date();
  await payment.save();

  await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'refunded' });

  return payment;
};
