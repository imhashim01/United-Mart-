import { Router } from 'express';
import { protect, authorize } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import {
  getMyPayments,
  getPayment,
  listPayments,
  refundPayment,
  updatePaymentStatus,
} from '../controllers/paymentController.js';
import { refundPaymentSchema, updatePaymentStatusSchema } from '../validators/paymentValidators.js';

const router = Router();

router.use(protect);

router.get('/me', getMyPayments);

router.use(authorize('admin', 'manager'));
router.get('/', listPayments);
router.get('/:id', getPayment);
router.patch('/:id/status', validate(updatePaymentStatusSchema), updatePaymentStatus);
router.post('/:id/refund', authorize('admin'), validate(refundPaymentSchema), refundPayment);

export default router;
