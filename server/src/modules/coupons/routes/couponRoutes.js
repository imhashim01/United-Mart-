import { Router } from 'express';
import { protect, authorize } from '../../../middlewares/auth.js';
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

router.use(protect);

router.post('/validate', validate(validateCouponSchema), validateCoupon);

router.use(authorize('admin', 'manager'));
router.get('/', listCoupons);
router.get('/:id', getCoupon);
router.post('/', validate(createCouponSchema), createCoupon);
router.patch('/:id', validate(updateCouponSchema), updateCoupon);
router.delete('/:id', authorize('admin'), deleteCoupon);

export default router;
