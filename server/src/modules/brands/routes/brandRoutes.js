import { Router } from 'express';
import { protect, authorize } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import { uploadImage } from '../../../middlewares/upload.js';
import {
  createBrand,
  deleteBrand,
  getBrand,
  listBrands,
  updateBrand,
  uploadBrandLogo,
} from '../controllers/brandController.js';
import { createBrandSchema, listBrandsQuerySchema, updateBrandSchema } from '../validators/brandValidators.js';

const router = Router();

router.get('/', validate(listBrandsQuerySchema, 'query'), listBrands);
router.get('/:id', getBrand);

router.use(protect, authorize('admin', 'manager'));
router.post('/', validate(createBrandSchema), createBrand);
router.patch('/:id', validate(updateBrandSchema), updateBrand);
router.post('/:id/logo', uploadImage.single('logo'), uploadBrandLogo);
router.delete('/:id', authorize('admin'), deleteBrand);

export default router;
