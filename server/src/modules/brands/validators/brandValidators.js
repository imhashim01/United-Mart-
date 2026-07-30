import Joi from 'joi';

export const createBrandSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().allow('', null).max(1000),
  website: Joi.string().uri().allow('', null),
  isActive: Joi.boolean().default(true),
  // Accepts a plain URL string from the admin form; brandService normalizes
  // it into the { url, publicId } shape the schema stores.
  logo: Joi.string().trim().allow('', null),
});

export const updateBrandSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().allow('', null).max(1000),
  website: Joi.string().uri().allow('', null),
  isActive: Joi.boolean(),
  logo: Joi.string().trim().allow('', null),
});

export const listBrandsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  isActive: Joi.boolean(),
  search: Joi.string().trim(),
  sort: Joi.string(),
  fields: Joi.string(),
});