import { Router } from 'express';
import { protect } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import {
  addItem,
  applyCoupon,
  clearCart,
  getCart,
  removeCoupon,
  removeItem,
  updateItem,
} from '../controllers/cartController.js';
import { addToCartSchema, applyCouponSchema, updateCartItemSchema } from '../validators/cartValidators.js';

const router = Router();

router.use(protect);

router.get('/', getCart);
router.post('/items', validate(addToCartSchema), addItem);
router.patch('/items/:itemId', validate(updateCartItemSchema), updateItem);
router.delete('/items/:itemId', removeItem);
router.delete('/', clearCart);
router.post('/coupon', validate(applyCouponSchema), applyCoupon);
router.delete('/coupon', removeCoupon);

export default router;
