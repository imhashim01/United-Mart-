import Joi from 'joi';

export const dateRangeQuerySchema = Joi.object({
  from: Joi.date(),
  to: Joi.date(),
  groupBy: Joi.string().valid('day', 'month', 'year').default('day'),
});
