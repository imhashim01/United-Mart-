import Joi from 'joi';

export const addToCartTrackingSchema = Joi.object({
  eventId: Joi.string().trim().required(),
  productId: Joi.string().trim().required(),
  productName: Joi.string().trim().allow('', null),
  price: Joi.number().min(0).required(),
  fbp: Joi.string().trim().allow('', null),
  email: Joi.string().trim().allow('', null),
  phone: Joi.string().trim().allow('', null),
  eventSourceUrl: Joi.string().trim().allow('', null),
});

export const initiateCheckoutTrackingSchema = Joi.object({
  eventId: Joi.string().trim().required(),
  value: Joi.number().min(0).required(),
  numItems: Joi.number().integer().min(0).required(),
  fbp: Joi.string().trim().allow('', null),
  email: Joi.string().trim().allow('', null),
  phone: Joi.string().trim().allow('', null),
  eventSourceUrl: Joi.string().trim().allow('', null),
});
