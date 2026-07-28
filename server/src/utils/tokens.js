import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-jwt-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-jwt-refresh-secret';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRY || process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRY || process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id, tokenType: 'refresh' }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);

export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const generateRawToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
