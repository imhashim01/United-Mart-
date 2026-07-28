import { Router } from 'express';
import { protect, authorize } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import { createAdmin, listAdmins, removeAdmin, updateAdmin } from '../controllers/adminController.js';
import { createAdminSchema, updateAdminSchema } from '../validators/adminValidators.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/', listAdmins);
router.post('/', validate(createAdminSchema), createAdmin);
router.patch('/:id', validate(updateAdminSchema), updateAdmin);
router.delete('/:id', removeAdmin);

export default router;
