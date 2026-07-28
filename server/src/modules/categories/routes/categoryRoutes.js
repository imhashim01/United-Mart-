import { Router } from 'express';
import { protect, authorize } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import { uploadImage } from '../../../middlewares/upload.js';
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryBySlug,
  getCategoryTree,
  listCategories,
  updateCategory,
  uploadCategoryImage,
} from '../controllers/categoryController.js';
import {
  createCategorySchema,
  listCategoriesQuerySchema,
  updateCategorySchema,
} from '../validators/categoryValidators.js';

const router = Router();

router.get('/', validate(listCategoriesQuerySchema, 'query'), listCategories);
router.get('/tree', getCategoryTree);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);

router.use(protect, authorize('admin', 'manager'));
router.post('/', validate(createCategorySchema), createCategory);
router.patch('/:id', validate(updateCategorySchema), updateCategory);
router.post('/:id/image', uploadImage.single('image'), uploadCategoryImage);
router.delete('/:id', authorize('admin'), deleteCategory);

export default router;
