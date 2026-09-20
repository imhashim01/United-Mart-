import { Router } from 'express';
import { protect, authorize, optionalAuth } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  listCoupons,
  updateCoupon,
  validateCoupon,
} from '../controllers/couponController.js';
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
} from '../validators/couponValidators.js';

const router = Router();

// Guests can apply a coupon at checkout too — optionalAuth attaches
// req.user when a valid token is present but never blocks the request.
router.post('/validate', optionalAuth, validate(validateCouponSchema), validateCoupon);

router.use(protect);
router.use(authorize('admin', 'manager'));
router.get('/', listCoupons);
router.get('/:id', getCoupon);
router.post('/', validate(createCouponSchema), createCoupon);
router.patch('/:id', validate(updateCouponSchema), updateCoupon);
router.delete('/:id', authorize('admin'), deleteCoupon);

export default router;
