import Joi from 'joi';

export const createAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid('manager', 'admin').default('manager'),
  department: Joi.string().valid('management', 'sales', 'inventory', 'support', 'finance').default('management'),
  permissions: Joi.array().items(
    Joi.string().valid(
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_coupons',
      'manage_rewards',
      'manage_reports',
      'manage_admins',
      'manage_payments'
    )
  ),
});

export const updateAdminSchema = Joi.object({
  department: Joi.string().valid('management', 'sales', 'inventory', 'support', 'finance'),
  permissions: Joi.array().items(
    Joi.string().valid(
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_coupons',
      'manage_rewards',
      'manage_reports',
      'manage_admins',
      'manage_payments'
    )
  ),
});
