import User from '../../auth/models/userModel.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiFeatures, buildPaginationMeta } from '../../../utils/apiFeatures.js';
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../../../config/cloudinary.js';

export const listUsers = async (queryString) => {
  const countQuery = new ApiFeatures(User.find(), queryString).filter().search(['name', 'email']);
  const total = await User.countDocuments(countQuery.query.getFilter());

  const features = new ApiFeatures(User.find(), queryString)
    .filter()
    .search(['name', 'email'])
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;
  return { users, meta: buildPaginationMeta({ ...features.pagination, total }) };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('User not found');
  return user.toSafeObject();
};

export const updateProfile = async (userId, updates) => {
  const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
  if (!user) throw ApiError.notFound('User not found');
  return user.toSafeObject();
};

export const updateAvatar = async (userId, fileBuffer) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (user.avatar?.publicId) await deleteFromCloudinary(user.avatar.publicId);

  const result = await uploadBufferToCloudinary(fileBuffer, { folder: 'united-mart-sukkur/avatars' });
  user.avatar = { url: result.secure_url, publicId: result.public_id };
  await user.save({ validateBeforeSave: false });
  return user.toSafeObject();
};

export const addAddress = async (userId, address) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (address.isDefault) user.addresses.forEach((a) => { a.isDefault = false; });
  if (user.addresses.length === 0) address.isDefault = true;

  user.addresses.push(address);
  await user.save({ validateBeforeSave: false });
  return user.toSafeObject();
};

export const updateAddress = async (userId, addressId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const address = user.addresses.id(addressId);
  if (!address) throw ApiError.notFound('Address not found');

  if (updates.isDefault) user.addresses.forEach((a) => { a.isDefault = false; });
  Object.assign(address, updates);
  await user.save({ validateBeforeSave: false });
  return user.toSafeObject();
};

export const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const address = user.addresses.id(addressId);
  if (!address) throw ApiError.notFound('Address not found');

  address.deleteOne();
  await user.save({ validateBeforeSave: false });
  return user.toSafeObject();
};

export const toggleWishlist = async (userId, productId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const index = user.wishlist.findIndex((id) => id.toString() === productId);
  if (index === -1) user.wishlist.push(productId);
  else user.wishlist.splice(index, 1);

  await user.save({ validateBeforeSave: false });
  return { wishlist: user.wishlist, added: index === -1 };
};

export const getWishlist = async (userId) => {
  const user = await User.findById(userId).populate('wishlist');
  if (!user) throw ApiError.notFound('User not found');
  return user.wishlist;
};

export const setUserActiveStatus = async (userId, isActive) => {
  const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
  if (!user) throw ApiError.notFound('User not found');
  return user.toSafeObject();
};

export const setUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true });
  if (!user) throw ApiError.notFound('User not found');
  return user.toSafeObject();
};
