import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().allow('', null).max(1000),
  parent: Joi.string().hex().length(24).allow(null, ''),
  displayOrder: Joi.number().integer().default(0),
  isActive: Joi.boolean().default(true),
  // Accepts a plain URL string from the admin form; categoryService normalizes
  // it into the { url, publicId } shape the schema stores.
  image: Joi.string().trim().allow('', null),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().allow('', null).max(1000),
  parent: Joi.string().hex().length(24).allow(null, ''),
  displayOrder: Joi.number().integer(),
  isActive: Joi.boolean(),
  image: Joi.string().trim().allow('', null),
});

export const listCategoriesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  isActive: Joi.boolean(),
  parent: Joi.string(),
  search: Joi.string().trim(),
  sort: Joi.string(),
  fields: Joi.string(),
});