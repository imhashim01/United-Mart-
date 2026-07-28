import { Router } from 'express';
import { protect, authorize } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import { getInvoice, getMyInvoices, listInvoices, updateInvoiceStatus } from '../controllers/invoiceController.js';
import { updateInvoiceStatusSchema } from '../validators/invoiceValidators.js';

const router = Router();

router.use(protect);

router.get('/me', getMyInvoices);
router.get('/:id', getInvoice);

router.use(authorize('admin', 'manager'));
router.get('/', listInvoices);
router.patch('/:id/status', validate(updateInvoiceStatusSchema), updateInvoiceStatus);

export default router;
