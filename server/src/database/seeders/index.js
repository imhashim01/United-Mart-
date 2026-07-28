import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../../config/db.js';
import User from '../../modules/auth/models/userModel.js';
import Admin from '../../modules/admin/models/adminModel.js';

const ALL_PERMISSIONS = [
  'manage_products',
  'manage_categories',
  'manage_orders',
  'manage_customers',
  'manage_coupons',
  'manage_rewards',
  'manage_reports',
  'manage_admins',
  'manage_payments',
];

const DEFAULT_ADMIN = {
  name: process.env.DEFAULT_ADMIN_NAME || 'United Mart Admin',
  email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@unitedmartsukkur.pk',
  password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345',
};

const seedDefaultAdmin = async () => {
  const existing = await User.findOne({ email: DEFAULT_ADMIN.email });

  if (existing) {
    console.log(`Default admin already exists (${DEFAULT_ADMIN.email}) — skipping creation.`);
    return existing;
  }

  const user = await User.create({
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email,
    password: DEFAULT_ADMIN.password, // hashed automatically by the User model's pre-save hook
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
  });

  await Admin.create({
    user: user._id,
    department: 'management',
    permissions: ALL_PERMISSIONS,
    isSuperAdmin: true,
  });

  console.log('✅ Default admin account created:');
  console.log(`   Email:    ${DEFAULT_ADMIN.email}`);
  console.log(`   Password: ${DEFAULT_ADMIN.password}`);
  console.log('   ⚠️  Change this password after first login, or set DEFAULT_ADMIN_PASSWORD in .env before seeding.');

  return user;
};

const runSeeders = async () => {
  await connectDB();
  console.log('Seeding database...\n');

  await seedDefaultAdmin();

  console.log('\nSeeding complete.');
  await mongoose.disconnect();
  process.exit(0);
};

runSeeders().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
