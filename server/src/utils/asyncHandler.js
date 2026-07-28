// Wraps async route/controller handlers so rejected promises are forwarded to Express error handling middleware.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
