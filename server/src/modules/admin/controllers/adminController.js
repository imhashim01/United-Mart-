import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as adminService from '../services/adminService.js';

export const listAdmins = asyncHandler(async (req, res) => {
  const admins = await adminService.listAdmins();
  sendResponse(res, 200, admins, 'Admins fetched');
});

export const createAdmin = asyncHandler(async (req, res) => {
  const admin = await adminService.createAdmin(req.body, req.user.id);
  sendResponse(res, 201, admin, 'Admin created');
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const admin = await adminService.updateAdmin(req.params.id, req.body);
  sendResponse(res, 200, admin, 'Admin updated');
});

export const removeAdmin = asyncHandler(async (req, res) => {
  await adminService.removeAdmin(req.params.id);
  sendResponse(res, 200, null, 'Admin removed');
});
