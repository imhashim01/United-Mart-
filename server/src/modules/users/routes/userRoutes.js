import { Router } from 'express';
import Joi from 'joi';
import { protect, authorize, restrictToSelfOrRoles } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import { uploadImage } from '../../../middlewares/upload.js';
import { addressSchema, listUsersQuerySchema, updateProfileSchema } from '../validators/userValidators.js';
import {
  addMyAddress,
  deleteMyAddress,
  getMyWishlist,
  getUser,
  listUsers,
  setActiveStatus,
  setRole,
  toggleMyWishlist,
  updateMyAddress,
  updateMyProfile,
  uploadMyAvatar,
} from '../controllers/userController.js';

const router = Router();

router.use(protect);

router.patch('/me', validate(updateProfileSchema), updateMyProfile);
router.post('/me/avatar', uploadImage.single('avatar'), uploadMyAvatar);

router.get('/me/wishlist', getMyWishlist);
router.post('/me/wishlist/:productId', toggleMyWishlist);

router.post('/me/addresses', validate(addressSchema), addMyAddress);
router.patch('/me/addresses/:addressId', validate(addressSchema), updateMyAddress);
router.delete('/me/addresses/:addressId', deleteMyAddress);

router.get('/', authorize('admin', 'manager'), validate(listUsersQuerySchema, 'query'), listUsers);
router.get('/:userId', restrictToSelfOrRoles('userId', 'admin', 'manager'), getUser);
router.patch(
  '/:userId/status',
  authorize('admin'),
  validate(Joi.object({ isActive: Joi.boolean().required() })),
  setActiveStatus
);
router.patch(
  '/:userId/role',
  authorize('admin'),
  validate(Joi.object({ role: Joi.string().valid('customer', 'manager', 'admin').required() })),
  setRole
);

export default router;
