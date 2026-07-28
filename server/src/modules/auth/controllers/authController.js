import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import { cookieOptions } from '../../../utils/tokens.js';
import * as authService from '../services/authService.js';

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, cookieOptions());
};

export const register = asyncHandler(async (req, res) => {
  const { user } = await authService.registerUser(req.body);
  sendResponse(res, 201, { user }, 'Registered successfully. Please verify your email.');
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);
  setRefreshCookie(res, refreshToken);
  sendResponse(res, 200, { user, accessToken }, 'Logged in successfully');
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
  const result = await authService.refreshSession({ refreshToken });
  setRefreshCookie(res, result.refreshToken);
  sendResponse(res, 200, { user: result.user, accessToken: result.accessToken }, 'Session refreshed');
});

export const logout = asyncHandler(async (req, res) => {
  const result = await authService.logoutUser({ userId: req.user.id });
  res.clearCookie('refreshToken', cookieOptions());
  sendResponse(res, 200, null, result.message);
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const token = req.body.token || req.query.token;
  const result = await authService.verifyEmail({ token });
  sendResponse(res, 200, null, result.message);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body);
  sendResponse(res, 200, null, result.message);
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  sendResponse(res, 200, null, result.message);
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const result = await authService.changePassword({ userId: req.user.id, ...req.body });
  sendResponse(res, 200, null, result.message);
});

export const getMe = asyncHandler(async (req, res) => {
  const result = await authService.getCurrentUser({ userId: req.user.id });
  sendResponse(res, 200, result.user, 'Current user fetched');
});
