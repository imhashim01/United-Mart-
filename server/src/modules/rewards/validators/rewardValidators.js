import Joi from 'joi';

export const redeemGiftSchema = Joi.object({
  giftId: Joi.string().hex().length(24).required(),
});

export const createGiftSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().allow('', null),
  tier: Joi.string().valid('bronze', 'silver', 'gold', 'platinum').default('bronze'),
  pointsRequired: Joi.number().integer().min(1).required(),
  discountValue: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).allow(null),
  isActive: Joi.boolean().default(true),
});

export const updateGiftSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim().allow('', null),
  tier: Joi.string().valid('bronze', 'silver', 'gold', 'platinum'),
  pointsRequired: Joi.number().integer().min(1),
  discountValue: Joi.number().min(0),
  stock: Joi.number().integer().min(0).allow(null),
  isActive: Joi.boolean(),
});

export const adjustPointsSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  points: Joi.number().integer().required(),
  description: Joi.string().trim().allow('', null),
});
