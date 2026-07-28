import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

const handleCastError = (err) => ApiError.badRequest(`Invalid value for field "${err.path}": ${err.value}`);

const handleDuplicateFieldError = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = field ? err.keyValue[field] : '';
  return ApiError.conflict(field ? `${field} "${value}" is already in use` : 'Duplicate field value');
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors || {}).map((val) => val.message);
  return ApiError.badRequest('Validation failed', errors);
}; 

const handleJWTError = () => ApiError.unauthorized('Invalid token, please log in again');
const handleJWTExpiredError = () => ApiError.unauthorized('Session expired, please log in again');

// Centralized Express error-handling middleware. Must be registered last, after all routes.
export const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (error.name === 'CastError') error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateFieldError(error);
  if (error.name === 'ValidationError') error = handleValidationError(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode && Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const message = error.isOperational ? error.message : statusCode === 500 ? 'Internal server error' : error.message;

  if (statusCode === 500 && process.env.NODE_ENV !== 'test') {
    console.error(`[error] ${req.method} ${req.originalUrl} ->`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors && error.errors.length ? error.errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
