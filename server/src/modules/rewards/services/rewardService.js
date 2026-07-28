import mongoose from 'mongoose';
import Reward from '../models/rewardModel.js';
import Gift from '../models/giftModel.js';
import Redemption from '../models/redemptionModel.js';
import User from '../../auth/models/userModel.js';
import { ApiError } from '../../../utils/ApiError.js';

// 1 reward point earned per Rs. 100 spent.
const POINTS_PER_BASE_AMOUNT = 1;
const BASE_AMOUNT = 100;

export const calculatePointsForAmount = (amount) => Math.floor((amount / BASE_AMOUNT) * POINTS_PER_BASE_AMOUNT);

export const earnPoints = async ({ userId, amount, orderId, description }, session) => {
  const points = calculatePointsForAmount(amount);
  if (points <= 0) return null;

  const user = await User.findById(userId).session(session || null);
  if (!user) throw ApiError.notFound('User not found');

  user.rewardPoints += points;
  await user.save({ validateBeforeSave: false, session });

  const [reward] = await Reward.create(
    [
      {
        user: userId,
        points,
        type: 'earned',
        order: orderId || null,
        description: description || 'Earned from purchase',
        balanceAfter: user.rewardPoints,
      },
    ],
    { session }
  );

  return reward;
};

export const adjustPoints = async ({ userId, points, description }) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  if (points < 0 && user.rewardPoints + points < 0) throw ApiError.badRequest('Insufficient points balance');

  user.rewardPoints += points;
  await user.save({ validateBeforeSave: false });

  return Reward.create({
    user: userId,
    points,
    type: 'adjusted',
    description: description || 'Manual adjustment',
    balanceAfter: user.rewardPoints,
  });
};

export const getUserRewardSummary = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const [earned, redeemed] = await Promise.all([
    Reward.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), type: 'earned' } },
      { $group: { _id: null, total: { $sum: '$points' } } },
    ]),
    Reward.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), type: 'redeemed' } },
      { $group: { _id: null, total: { $sum: '$points' } } },
    ]),
  ]);

  return {
    currentBalance: user.rewardPoints,
    totalEarned: earned[0]?.total || 0,
    totalRedeemed: Math.abs(redeemed[0]?.total || 0),
  };
};

export const getUserRewardHistory = async (userId) =>
  Reward.find({ user: userId }).sort('-createdAt').populate('order', 'orderNumber').populate('gift', 'name');

export const listGifts = async ({ activeOnly = true } = {}) =>
  Gift.find(activeOnly ? { isActive: true } : {}).sort('pointsRequired');

export const createGift = async (data) => Gift.create(data);

export const updateGift = async (id, updates) => {
  const gift = await Gift.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!gift) throw ApiError.notFound('Gift not found');
  return gift;
};

export const deleteGift = async (id) => {
  const gift = await Gift.findByIdAndDelete(id);
  if (!gift) throw ApiError.notFound('Gift not found');
  return gift;
};

export const redeemGift = async ({ userId, giftId }) => {
  const [user, gift] = await Promise.all([User.findById(userId), Gift.findById(giftId)]);
  if (!user) throw ApiError.notFound('User not found');
  if (!gift || !gift.isActive) throw ApiError.notFound('Gift not found');
  if (gift.stock != null && gift.stock <= 0) throw ApiError.badRequest('This gift is out of stock');
  if (user.rewardPoints < gift.pointsRequired) {
    throw ApiError.badRequest(
      `Insufficient points. Need ${gift.pointsRequired}, have ${user.rewardPoints}`
    );
  }

  user.rewardPoints -= gift.pointsRequired;
  await user.save({ validateBeforeSave: false });

  if (gift.stock != null) {
    gift.stock -= 1;
    await gift.save();
  }

  const redemption = await Redemption.create({
    user: userId,
    gift: gift._id,
    pointsUsed: gift.pointsRequired,
    discountValue: gift.discountValue,
  });

  await Reward.create({
    user: userId,
    points: -gift.pointsRequired,
    type: 'redeemed',
    gift: gift._id,
    description: `Redeemed "${gift.name}" for Rs.${gift.discountValue} discount`,
    balanceAfter: user.rewardPoints,
  });

  return redemption;
};

export const getUserRedemptions = async (userId) =>
  Redemption.find({ user: userId }).sort('-createdAt').populate('gift', 'name tier discountValue');

export const getAllRedemptions = async () =>
  Redemption.find().sort('-createdAt').populate('gift', 'name tier discountValue').populate('user', 'name email');

export const getRewardDashboard = async (userId) => {
  const [summary, gifts, redemptions] = await Promise.all([
    getUserRewardSummary(userId),
    listGifts(),
    getUserRedemptions(userId),
  ]);

  const nextGift = gifts
    .filter((g) => g.pointsRequired > summary.currentBalance)
    .sort((a, b) => a.pointsRequired - b.pointsRequired)[0];

  return {
    ...summary,
    gifts,
    nextGift: nextGift || null,
    recentRedemptions: redemptions.slice(0, 5),
  };
};
