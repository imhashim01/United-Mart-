import Joi from 'joi';

const addressSchema = Joi.object({
  label: Joi.string().trim().max(50),
  line1: Joi.string().trim().required(),
  line2: Joi.string().trim().allow('', null),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().allow('', null),
  postalCode: Joi.string().trim().allow('', null),
  country: Joi.string().trim().default('Pakistan'),
  phone: Joi.string().trim().allow('', null),
});

export const createOrderSchema = Joi.object({
  shippingAddress: addressSchema.required(),
  billingAddress: addressSchema,
  paymentMethod: Joi.string().valid('cod', 'card', 'bank_transfer', 'jazzcash', 'easypaisa').required(),
  couponCode: Joi.string().trim().uppercase().allow('', null),
  customerNote: Joi.string().trim().max(500).allow('', null),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')
    .required(),
  note: Joi.string().trim().allow('', null),
});

export const cancelOrderSchema = Joi.object({
  reason: Joi.string().trim().max(300).allow('', null),
});

export const listOrdersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  orderStatus: Joi.string(),
  paymentStatus: Joi.string(),
  sort: Joi.string(),
  fields: Joi.string(),
});
