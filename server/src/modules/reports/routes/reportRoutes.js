import { Router } from 'express';
import { protect, authorize } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import {
  getCustomerGrowth,
  getDashboardSummary,
  getInventoryReport,
  getOrderStatusBreakdown,
  getPaymentMethodBreakdown,
  getSalesReport,
  getTopCustomers,
  getTopSellingProducts,
} from '../controllers/reportController.js';
import { dateRangeQuerySchema } from '../validators/reportValidators.js';

const router = Router();

router.use(protect, authorize('admin', 'manager'));

router.get('/dashboard', getDashboardSummary);
router.get('/sales', validate(dateRangeQuerySchema, 'query'), getSalesReport);
router.get('/top-products', getTopSellingProducts);
router.get('/order-status', validate(dateRangeQuerySchema, 'query'), getOrderStatusBreakdown);
router.get('/payment-methods', validate(dateRangeQuerySchema, 'query'), getPaymentMethodBreakdown);
router.get('/customer-growth', validate(dateRangeQuerySchema, 'query'), getCustomerGrowth);
router.get('/inventory', getInventoryReport);
router.get('/top-customers', getTopCustomers);

export default router;
