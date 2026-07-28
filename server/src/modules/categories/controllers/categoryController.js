import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import { ApiError } from '../../../utils/ApiError.js';
import * as categoryService from '../services/categoryService.js';

export const listCategories = asyncHandler(async (req, res) => {
  const { categories, meta } = await categoryService.listCategories(req.query);
  sendResponse(res, 200, categories, 'Categories fetched', meta);
});

export const getCategoryTree = asyncHandler(async (req, res) => {
  const tree = await categoryService.getCategoryTree();
  sendResponse(res, 200, tree, 'Category tree fetched');
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendResponse(res, 200, category, 'Category fetched');
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  sendResponse(res, 200, category, 'Category fetched');
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  sendResponse(res, 201, category, 'Category created');
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendResponse(res, 200, category, 'Category updated');
});

export const uploadCategoryImage = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('An image file is required');
  const category = await categoryService.updateCategoryImage(req.params.id, req.file.buffer);
  sendResponse(res, 200, category, 'Category image updated');
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  sendResponse(res, 200, null, 'Category deleted');
});
