import Brand from '../models/brandModel.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiFeatures, buildPaginationMeta } from '../../../utils/apiFeatures.js';
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../../../config/cloudinary.js';

export const listBrands = async (queryString) => {
  const total = await Brand.countDocuments(new ApiFeatures(Brand.find(), queryString).filter().query.getFilter());
  const features = new ApiFeatures(Brand.find(), queryString)
    .filter()
    .search(['name', 'description'])
    .sort()
    .limitFields()
    .paginate();

  const brands = await features.query;
  return { brands, meta: buildPaginationMeta({ ...features.pagination, total }) };
};

export const getBrandById = async (id) => {
  const brand = await Brand.findById(id);
  if (!brand) throw ApiError.notFound('Brand not found');
  return brand;
};

export const createBrand = async (data) => Brand.create(data);

export const updateBrand = async (id, updates) => {
  const brand = await Brand.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!brand) throw ApiError.notFound('Brand not found');
  return brand;
};

export const updateBrandLogo = async (id, fileBuffer) => {
  const brand = await Brand.findById(id);
  if (!brand) throw ApiError.notFound('Brand not found');

  if (brand.logo?.publicId) await deleteFromCloudinary(brand.logo.publicId);

  const result = await uploadBufferToCloudinary(fileBuffer, { folder: 'united-mart-sukkur/brands' });
  brand.logo = { url: result.secure_url, publicId: result.public_id };
  await brand.save();
  return brand;
};

export const deleteBrand = async (id) => {
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) throw ApiError.notFound('Brand not found');
  if (brand.logo?.publicId) await deleteFromCloudinary(brand.logo.publicId);
  return brand;
};
