import { verifyAccessToken } from '../utils/tokens.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../modules/auth/models/userModel.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies?.accessToken;

  if (!token) {
    throw ApiError.unauthorized('Authentication required');
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    throw ApiError.unauthorized(
      error.name === 'TokenExpiredError' ? 'Session expired, please log in again' : 'Invalid token'
    );
  }

  const user = await User.findById(payload.id);
  if (!user) throw ApiError.unauthorized('User no longer exists');
  if (!user.isActive) throw ApiError.forbidden('Your account has been deactivated');
  if (user.changedPasswordAfter(payload.iat)) {
    throw ApiError.unauthorized('Password recently changed, please log in again');
  }

  req.user = user;
  next();
});

// Attaches req.user if a valid token is present, but never blocks the request.
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies?.accessToken;
  if (!token) return next();

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.id);
    if (user && user.isActive) req.user = user;
  } catch (error) {
    // ignore invalid/expired tokens for optional auth
  }
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) throw ApiError.unauthorized('Authentication required');
  if (!roles.includes(req.user.role)) {
    throw ApiError.forbidden('You do not have permission to access this resource');
  }
  next();
};

export const restrictToSelfOrRoles = (paramField = 'userId', ...roles) => (req, _res, next) => {
  if (!req.user) throw ApiError.unauthorized('Authentication required');
  const targetId = req.params[paramField];
  if (req.user.id === targetId || roles.includes(req.user.role)) return next();
  throw ApiError.forbidden('You do not have permission to access this resource');
};
