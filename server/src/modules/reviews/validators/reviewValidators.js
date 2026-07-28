import Joi from 'joi';

export const createReviewSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  order: Joi.string().hex().length(24).allow('', null),
  rating: Joi.number().integer().min(1).max(5).required(),
  title: Joi.string().trim().max(120).allow('', null),
  comment: Joi.string().trim().max(1000).allow('', null),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  title: Joi.string().trim().max(120).allow('', null),
  comment: Joi.string().trim().max(1000).allow('', null),
});

export const adminReplySchema = Joi.object({
  adminReply: Joi.string().trim().max(1000).required(),
});

export const listReviewsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  product: Joi.string(),
  rating: Joi.number().integer().min(1).max(5),
  isApproved: Joi.boolean(),
  sort: Joi.string(),
  fields: Joi.string(),
});
