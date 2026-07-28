import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import { ApiError } from '../../../utils/ApiError.js';
import * as productService from '../services/productService.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { products, meta } = await productService.listProducts(req.query);
  sendResponse(res, 200, products, 'Products fetched', meta);
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeaturedProducts(req.query.limit);
  sendResponse(res, 200, products, 'Featured products fetched');
});

export const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await productService.getLowStockProducts();
  sendResponse(res, 200, products, 'Low stock products fetched');
});

export const getOutOfStockProducts = asyncHandler(async (req, res) => {
  const products = await productService.getOutOfStockProducts();
  sendResponse(res, 200, products, 'Out of stock products fetched');
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  sendResponse(res, 200, product, 'Product fetched');
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  sendResponse(res, 200, product, 'Product fetched');
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  sendResponse(res, 201, product, 'Product created');
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  sendResponse(res, 200, product, 'Product updated');
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) throw ApiError.badRequest('At least one image is required');
  const product = await productService.addProductImages(req.params.id, req.files);
  sendResponse(res, 200, product, 'Product images uploaded');
});

export const uploadVariantImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) throw ApiError.badRequest('At least one image is required');
  const product = await productService.addVariantImages(req.params.id, req.params.variantId, req.files);
  sendResponse(res, 200, product, 'Variant images uploaded');
});

export const removeProductImage = asyncHandler(async (req, res) => {
  const product = await productService.removeProductImage(req.params.id, req.params.publicId);
  sendResponse(res, 200, product, 'Product image removed');
});

export const removeVariantImage = asyncHandler(async (req, res) => {
  const product = await productService.removeVariantImage(req.params.id, req.params.variantId, req.params.publicId);
  sendResponse(res, 200, product, 'Variant image removed');
});

export const adjustStock = asyncHandler(async (req, res) => {
  const product = await productService.adjustStock(req.params.id, req.body.quantity);
  sendResponse(res, 200, product, 'Stock adjusted');
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  sendResponse(res, 200, null, 'Product deleted');
});
