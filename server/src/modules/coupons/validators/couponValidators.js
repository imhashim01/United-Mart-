import Joi from 'joi';

export const createCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(30).required(),
  description: Joi.string().trim().allow('', null).max(300),
  discountType: Joi.string().valid('percentage', 'fixed').required(),
  discountValue: Joi.number().min(0).required(),
  maxDiscountAmount: Joi.number().min(0).allow(null),
  minPurchaseAmount: Joi.number().min(0).default(0),
  usageLimit: Joi.number().integer().min(0).allow(null),
  usageLimitPerUser: Joi.number().integer().min(1).default(1),
  applicableCategories: Joi.array().items(Joi.string().hex().length(24)),
  applicableProducts: Joi.array().items(Joi.string().hex().length(24)),
  validFrom: Joi.date().default(() => new Date()),
  validUntil: Joi.date().greater(Joi.ref('validFrom')).required(),
  isActive: Joi.boolean().default(true),
});

export const updateCouponSchema = Joi.object({
  description: Joi.string().trim().allow('', null).max(300),
  discountType: Joi.string().valid('percentage', 'fixed'),
  discountValue: Joi.number().min(0),
  maxDiscountAmount: Joi.number().min(0).allow(null),
  minPurchaseAmount: Joi.number().min(0),
  usageLimit: Joi.number().integer().min(0).allow(null),
  usageLimitPerUser: Joi.number().integer().min(1),
  applicableCategories: Joi.array().items(Joi.string().hex().length(24)),
  applicableProducts: Joi.array().items(Joi.string().hex().length(24)),
  validFrom: Joi.date(),
  validUntil: Joi.date(),
  isActive: Joi.boolean(),
});

export const validateCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().required(),
  subtotal: Joi.number().min(0).required(),
});
