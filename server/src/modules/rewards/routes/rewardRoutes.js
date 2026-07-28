import { Router } from 'express';
import { protect, authorize } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import {
  adjustPoints,
  createGift,
  deleteGift,
  getAllRedemptions,
  getMyDashboard,
  getMyRedemptions,
  getMyRewardHistory,
  getMyRewardSummary,
  listGifts,
  redeemGift,
  updateGift,
} from '../controllers/rewardController.js';
import {
  adjustPointsSchema,
  createGiftSchema,
  redeemGiftSchema,
  updateGiftSchema,
} from '../validators/rewardValidators.js';

const router = Router();

router.get('/gifts', listGifts);

router.use(protect);

router.get('/me', getMyRewardSummary);
router.get('/me/history', getMyRewardHistory);
router.get('/me/dashboard', getMyDashboard);
router.get('/me/redemptions', getMyRedemptions);
router.post('/redeem', validate(redeemGiftSchema), redeemGift);

router.use(authorize('admin', 'manager'));
router.post('/gifts', validate(createGiftSchema), createGift);
router.patch('/gifts/:id', validate(updateGiftSchema), updateGift);
router.delete('/gifts/:id', authorize('admin'), deleteGift);
router.post('/adjust', validate(adjustPointsSchema), adjustPoints);
router.get('/redemptions', getAllRedemptions);

export default router;
