import { Router } from 'express';
import { protect, authorize } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { updateSettingsSchema } from '../validators/settingValidators.js';
import { cachePublic } from '../../../middlewares/cachePublic.js';

const router = Router();

// Public — the storefront needs this (delivery fee, minimum order) without being logged in.
router.get('/', cachePublic(60), getSettings);

router.use(protect, authorize('admin', 'manager'));
router.patch('/', validate(updateSettingsSchema), updateSettings);

export default router;