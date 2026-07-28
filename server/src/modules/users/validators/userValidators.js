import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  phone: Joi.string().trim().allow('', null),
});

export const addressSchema = Joi.object({
  label: Joi.string().trim().max(50).default('Home'),
  line1: Joi.string().trim().required(),
  line2: Joi.string().trim().allow('', null),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().allow('', null),
  postalCode: Joi.string().trim().allow('', null),
  country: Joi.string().trim().default('Pakistan'),
  phone: Joi.string().trim().allow('', null),
  isDefault: Joi.boolean().default(false),
});

export const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  role: Joi.string().valid('customer', 'manager', 'admin'),
  isActive: Joi.boolean(),
  search: Joi.string().trim(),
  sort: Joi.string(),
  fields: Joi.string(),
});
