import Joi from 'joi';

export const updateSettingsSchema = Joi.object({
  storeName: Joi.string().trim().min(2).max(100),
  supportEmail: Joi.string().trim().email(),
  supportPhone: Joi.string().trim(),
  address: Joi.string().trim().max(300),
  deliveryFlatRate: Joi.number().min(0),
  freeDeliveryThreshold: Joi.number().min(0),
  minimumOrderAmount: Joi.number().min(0),
  orderCutoffTime: Joi.string().trim(),
  emailNotifications: Joi.boolean(),
  smsNotifications: Joi.boolean(),
});