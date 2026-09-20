import { Router } from 'express';
import { protect, authorize, optionalAuth } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrder,
  listOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import {
  cancelOrderSchema,
  createOrderSchema,
  listOrdersQuerySchema,
  updateOrderStatusSchema,
} from '../validators/orderValidators.js';

const router = Router();

// Placing an order allows guest checkout — optionalAuth attaches req.user
// when a valid token is present but never blocks the request. Every other
// order route still requires a real login.
router.post('/', optionalAuth, validate(createOrderSchema), createOrder);

router.use(protect);

router.get('/me', validate(listOrdersQuerySchema, 'query'), getMyOrders);
router.get('/:id', getOrder);
router.post('/:id/cancel', validate(cancelOrderSchema), cancelOrder);

router.use(authorize('admin', 'manager'));
router.get('/', validate(listOrdersQuerySchema, 'query'), listOrders);
router.patch('/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
