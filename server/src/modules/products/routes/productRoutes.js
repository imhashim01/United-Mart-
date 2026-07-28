import { Router } from 'express';
import { protect, authorize } from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import { uploadImage } from '../../../middlewares/upload.js';
import {
  adjustStock,
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getLowStockProducts,
  getOutOfStockProducts,
  getProduct,
  getProductBySlug,
  listProducts,
  removeProductImage,
  removeVariantImage,
  updateProduct,
  uploadProductImages,
  uploadVariantImages,
} from '../controllers/productController.js';
import {
  adjustStockSchema,
  createProductSchema,
  listProductsQuerySchema,
  updateProductSchema,
} from '../validators/productValidators.js';

const router = Router();

router.get('/', validate(listProductsQuerySchema, 'query'), listProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/low-stock', protect, authorize('admin', 'manager'), getLowStockProducts);
router.get('/out-of-stock', protect, authorize('admin', 'manager'), getOutOfStockProducts);
router.get('/:id', getProduct);

router.use(protect, authorize('admin', 'manager'));
router.post('/', validate(createProductSchema), createProduct);
router.patch('/:id', validate(updateProductSchema), updateProduct);
router.post('/:id/images', uploadImage.array('images', 6), uploadProductImages);
router.post('/:id/variants/:variantId/images', uploadImage.array('images', 6), uploadVariantImages);
router.delete('/:id/images/:publicId', removeProductImage);
router.delete('/:id/variants/:variantId/images/:publicId', removeVariantImage);
router.patch('/:id/stock', validate(adjustStockSchema), adjustStock);
router.delete('/:id', authorize('admin'), deleteProduct);

export default router;
