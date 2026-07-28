import { ApiError } from '../utils/ApiError.js';

// Validates req[source] (default body) against a Joi schema, stripping unknown keys.
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message.replace(/"/g, ''));
    return next(ApiError.badRequest('Validation failed', messages));
  }

  req[source] = value;
  return next();
};

export default validate;
