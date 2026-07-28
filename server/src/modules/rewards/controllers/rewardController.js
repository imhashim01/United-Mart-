import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as rewardService from '../services/rewardService.js';

export const getMyRewardSummary = asyncHandler(async (req, res) => {
  const summary = await rewardService.getUserRewardSummary(req.user.id);
  sendResponse(res, 200, summary, 'Reward summary fetched');
});

export const getMyRewardHistory = asyncHandler(async (req, res) => {
  const history = await rewardService.getUserRewardHistory(req.user.id);
  sendResponse(res, 200, history, 'Reward history fetched');
});

export const getMyDashboard = asyncHandler(async (req, res) => {
  const dashboard = await rewardService.getRewardDashboard(req.user.id);
  sendResponse(res, 200, dashboard, 'Reward dashboard fetched');
});

export const getMyRedemptions = asyncHandler(async (req, res) => {
  const redemptions = await rewardService.getUserRedemptions(req.user.id);
  sendResponse(res, 200, redemptions, 'Redemptions fetched');
});

export const redeemGift = asyncHandler(async (req, res) => {
  const redemption = await rewardService.redeemGift({ userId: req.user.id, giftId: req.body.giftId });
  sendResponse(res, 201, redemption, 'Gift redeemed successfully');
});

export const listGifts = asyncHandler(async (req, res) => {
  const gifts = await rewardService.listGifts({ activeOnly: req.query.all !== 'true' });
  sendResponse(res, 200, gifts, 'Gifts fetched');
});

export const createGift = asyncHandler(async (req, res) => {
  const gift = await rewardService.createGift(req.body);
  sendResponse(res, 201, gift, 'Gift created');
});

export const updateGift = asyncHandler(async (req, res) => {
  const gift = await rewardService.updateGift(req.params.id, req.body);
  sendResponse(res, 200, gift, 'Gift updated');
});

export const deleteGift = asyncHandler(async (req, res) => {
  await rewardService.deleteGift(req.params.id);
  sendResponse(res, 200, null, 'Gift deleted');
});

export const adjustPoints = asyncHandler(async (req, res) => {
  const reward = await rewardService.adjustPoints(req.body);
  sendResponse(res, 200, reward, 'Points adjusted');
});

export const getAllRedemptions = asyncHandler(async (req, res) => {
  const redemptions = await rewardService.getAllRedemptions();
  sendResponse(res, 200, redemptions, 'All redemptions fetched');
});
