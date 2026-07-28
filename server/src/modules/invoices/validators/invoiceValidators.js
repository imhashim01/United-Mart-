import Joi from 'joi';

export const updateInvoiceStatusSchema = Joi.object({
  status: Joi.string().valid('paid', 'unpaid', 'overdue', 'void').required(),
});

export const listInvoicesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  status: Joi.string(),
  sort: Joi.string(),
  fields: Joi.string(),
});
