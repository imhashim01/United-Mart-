import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import { ApiError } from '../../../utils/ApiError.js';
import * as brandService from '../services/brandService.js';

export const listBrands = asyncHandler(async (req, res) => {
  const { brands, meta } = await brandService.listBrands(req.query);
  sendResponse(res, 200, brands, 'Brands fetched', meta);
});

export const getBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.getBrandById(req.params.id);
  sendResponse(res, 200, brand, 'Brand fetched');
});

export const createBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.createBrand(req.body);
  sendResponse(res, 201, brand, 'Brand created');
});

export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.updateBrand(req.params.id, req.body);
  sendResponse(res, 200, brand, 'Brand updated');
});

export const uploadBrandLogo = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('A logo image is required');
  const brand = await brandService.updateBrandLogo(req.params.id, req.file.buffer);
  sendResponse(res, 200, brand, 'Brand logo updated');
});

export const deleteBrand = asyncHandler(async (req, res) => {
  await brandService.deleteBrand(req.params.id);
  sendResponse(res, 200, null, 'Brand deleted');
});
