import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import { ApiError } from '../../../utils/ApiError.js';
import * as userService from '../services/userService.js';

export const listUsers = asyncHandler(async (req, res) => {
  const { users, meta } = await userService.listUsers(req.query);
  sendResponse(res, 200, users, 'Users fetched', meta);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  sendResponse(res, 200, user, 'User fetched');
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  sendResponse(res, 200, user, 'Profile updated');
});

export const uploadMyAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('An image file is required');
  const user = await userService.updateAvatar(req.user.id, req.file.buffer);
  sendResponse(res, 200, user, 'Avatar updated');
});

export const addMyAddress = asyncHandler(async (req, res) => {
  const user = await userService.addAddress(req.user.id, req.body);
  sendResponse(res, 201, user, 'Address added');
});

export const updateMyAddress = asyncHandler(async (req, res) => {
  const user = await userService.updateAddress(req.user.id, req.params.addressId, req.body);
  sendResponse(res, 200, user, 'Address updated');
});

export const deleteMyAddress = asyncHandler(async (req, res) => {
  const user = await userService.deleteAddress(req.user.id, req.params.addressId);
  sendResponse(res, 200, user, 'Address removed');
});

export const toggleMyWishlist = asyncHandler(async (req, res) => {
  const result = await userService.toggleWishlist(req.user.id, req.params.productId);
  sendResponse(res, 200, result, result.added ? 'Added to wishlist' : 'Removed from wishlist');
});

export const getMyWishlist = asyncHandler(async (req, res) => {
  const wishlist = await userService.getWishlist(req.user.id);
  sendResponse(res, 200, wishlist, 'Wishlist fetched');
});

export const setActiveStatus = asyncHandler(async (req, res) => {
  const user = await userService.setUserActiveStatus(req.params.userId, req.body.isActive);
  sendResponse(res, 200, user, `User ${req.body.isActive ? 'activated' : 'deactivated'}`);
});

export const setRole = asyncHandler(async (req, res) => {
  const user = await userService.setUserRole(req.params.userId, req.body.role);
  sendResponse(res, 200, user, 'User role updated');
});
