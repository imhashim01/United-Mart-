import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as settingService from '../services/settingService.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingService.getSettings();
  sendResponse(res, 200, settings, 'Settings fetched');
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingService.updateSettings(req.body);
  sendResponse(res, 200, settings, 'Settings updated');
});