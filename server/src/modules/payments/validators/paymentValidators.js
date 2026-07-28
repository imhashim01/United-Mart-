import Joi from 'joi';

export const updatePaymentStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'completed', 'failed', 'refunded').required(),
  transactionId: Joi.string().trim().allow('', null),
  failureReason: Joi.string().trim().allow('', null),
});

export const refundPaymentSchema = Joi.object({
  amount: Joi.number().min(0).required(),
});
