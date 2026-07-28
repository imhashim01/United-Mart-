import User from '../models/userModel.js';
import { ApiError } from '../../../utils/ApiError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../../../utils/tokens.js';
import { sendEmail } from '../../../utils/sendEmail.js';
import crypto from 'crypto';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const issueTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshTokenHash = hashToken(refreshToken);
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const registerUser = async ({ name, email, password, phone }) => {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const user = new User({ name, email, password, phone });
  const verificationToken = user.createEmailVerificationToken();
  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your United Mart Sukkur account',
      html: `<p>Welcome ${user.name}!</p><p>Please verify your email: <a href="${CLIENT_URL}/verify-email/${verificationToken}">${CLIENT_URL}/verify-email/${verificationToken}</a></p>`,
    });
  } catch (error) {
    console.error('Failed to send registration verification email:', error);
  }

  return { user: user.toSafeObject() };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  if (!user.isActive) throw ApiError.forbidden('Your account has been deactivated');

  const tokens = await issueTokens(user);
  return { user: user.toSafeObject(), ...tokens };
};

export const refreshSession = async ({ refreshToken }) => {
  if (!refreshToken) throw ApiError.unauthorized('Refresh token is required');

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(payload.id).select('+refreshTokenHash');
  if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
    throw ApiError.unauthorized('Refresh token is no longer valid');
  }

  const tokens = await issueTokens(user);
  return { user: user.toSafeObject(), ...tokens };
};

export const logoutUser = async ({ userId }) => {
  await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
  return { message: 'Logged out successfully' };
};

export const verifyEmail = async ({ token }) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) throw ApiError.badRequest('Invalid or expired verification token');

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return { message: 'Email verified successfully' };
};

export const requestPasswordReset = async ({ email }) => {
  const user = await User.findOne({ email });
  const genericMessage = { message: 'If an account exists, a reset link has been sent.' };
  if (!user) return genericMessage;

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your United Mart Sukkur password',
      html: `<p>Reset your password using this link (valid for 15 minutes): <a href="${CLIENT_URL}/reset-password/${resetToken}">${CLIENT_URL}/reset-password/${resetToken}</a></p>`,
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }

  return genericMessage;
};

export const resetPassword = async ({ token, password }) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) throw ApiError.badRequest('Invalid or expired password reset token');

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokenHash = undefined;
  await user.save();

  return { message: 'Password updated successfully. Please log in again.' };
};

export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw ApiError.notFound('User not found');
  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  return { message: 'Password changed successfully' };
};

export const getCurrentUser = async ({ userId }) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return { user: user.toSafeObject() };
};
