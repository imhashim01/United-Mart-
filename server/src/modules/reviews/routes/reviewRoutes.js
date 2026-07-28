import { Router } from 'express';
import Joi from 'joi';
import { protect, authorize } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import {
  createReview,
  deleteReview,
  getProductReviews,
  listReviews,
  replyToReview,
  setReviewApproval,
  updateReview,
} from '../controllers/reviewController.js';
import {
  adminReplySchema,
  createReviewSchema,
  listReviewsQuerySchema,
  updateReviewSchema,
} from '../validators/reviewValidators.js';

const router = Router();

router.get('/product/:productId', validate(listReviewsQuerySchema, 'query'), getProductReviews);

router.use(protect);

router.post('/', validate(createReviewSchema), createReview);
router.patch('/:id', validate(updateReviewSchema), updateReview);
router.delete('/:id', deleteReview);

router.use(authorize('admin', 'manager'));
router.get('/', validate(listReviewsQuerySchema, 'query'), listReviews);
router.patch('/:id/approval', validate(Joi.object({ isApproved: Joi.boolean().required() })), setReviewApproval);
router.patch('/:id/reply', validate(adminReplySchema), replyToReview);

export default router;
