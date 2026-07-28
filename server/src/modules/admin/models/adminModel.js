import mongoose from 'mongoose';

// Extends a User (role=admin/manager) with admin-console-specific metadata.
const adminSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    department: {
      type: String,
      enum: ['management', 'sales', 'inventory', 'support', 'finance'],
      default: 'management',
    },
    permissions: [
      {
        type: String,
        enum: [
          'manage_products',
          'manage_categories',
          'manage_orders',
          'manage_customers',
          'manage_coupons',
          'manage_rewards',
          'manage_reports',
          'manage_admins',
          'manage_payments',
        ],
      },
    ],
    isSuperAdmin: { type: Boolean, default: false },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastActionAt: { type: Date },
  },
  { timestamps: true }
);

export const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
