import User from '../../auth/models/userModel.js';
import Admin from '../models/adminModel.js';
import { ApiError } from '../../../utils/ApiError.js';

export const listAdmins = async () => {
  const admins = await Admin.find().populate('user', 'name email role isActive lastLoginAt').populate('invitedBy', 'name email');
  return admins;
};

export const createAdmin = async ({ name, email, password, role, department, permissions }, invitedBy) => {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const user = await User.create({ name, email, password, role, isEmailVerified: true });

  const admin = await Admin.create({
    user: user._id,
    department,
    permissions: permissions || [],
    invitedBy,
  });

  return admin.populate('user', 'name email role');
};

export const updateAdmin = async (id, updates) => {
  const admin = await Admin.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate(
    'user',
    'name email role'
  );
  if (!admin) throw ApiError.notFound('Admin not found');
  return admin;
};

export const removeAdmin = async (id) => {
  const admin = await Admin.findById(id);
  if (!admin) throw ApiError.notFound('Admin not found');

  await User.findByIdAndUpdate(admin.user, { role: 'customer' });
  await admin.deleteOne();
  return admin;
};
