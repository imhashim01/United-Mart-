import Category from '../models/categoryModel.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiFeatures, buildPaginationMeta } from '../../../utils/apiFeatures.js';
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../../../config/cloudinary.js';

export const listCategories = async (queryString) => {
  const total = await Category.countDocuments(new ApiFeatures(Category.find(), queryString).filter().query.getFilter());
  const features = new ApiFeatures(Category.find().populate('parent', 'name slug'), queryString)
    .filter()
    .search(['name', 'description'])
    .sort()
    .limitFields()
    .paginate();

  const categories = await features.query;
  return { categories, meta: buildPaginationMeta({ ...features.pagination, total }) };
};

export const getCategoryTree = async () => {
  const categories = await Category.find({ isActive: true }).sort('displayOrder name').lean();
  const byId = new Map(categories.map((cat) => [cat._id.toString(), { ...cat, children: [] }]));
  const tree = [];

  byId.forEach((cat) => {
    if (cat.parent && byId.has(cat.parent.toString())) {
      byId.get(cat.parent.toString()).children.push(cat);
    } else {
      tree.push(cat);
    }
  });

  return tree;
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id).populate('parent', 'name slug');
  if (!category) throw ApiError.notFound('Category not found');
  return category;
};

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug, isActive: true });
  if (!category) throw ApiError.notFound('Category not found');
  return category;
};

export const createCategory = async (data) => {
  const category = await Category.create(data);
  return category;
};

export const updateCategory = async (id, updates) => {
  const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!category) throw ApiError.notFound('Category not found');
  return category;
};

export const updateCategoryImage = async (id, fileBuffer) => {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound('Category not found');

  if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);

  const result = await uploadBufferToCloudinary(fileBuffer, { folder: 'united-mart-sukkur/categories' });
  category.image = { url: result.secure_url, publicId: result.public_id };
  await category.save();
  return category;
};

export const deleteCategory = async (id) => {
  const hasChildren = await Category.exists({ parent: id });
  if (hasChildren) throw ApiError.badRequest('Cannot delete a category that has subcategories');

  const category = await Category.findByIdAndDelete(id);
  if (!category) throw ApiError.notFound('Category not found');

  if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
  return category;
};
