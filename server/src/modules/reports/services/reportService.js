import Order from '../../orders/models/orderModel.js';
import Product from '../../products/models/productModel.js';
import User from '../../auth/models/userModel.js';
import Payment from '../../payments/models/paymentModel.js';

const buildDateFilter = ({ from, to }) => {
  const filter = {};
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  return filter;
};

const dateFormatFor = (groupBy) => {
  if (groupBy === 'year') return '%Y';
  if (groupBy === 'month') return '%Y-%m';
  return '%Y-%m-%d';
};

export const getDashboardSummary = async () => {
  const [totalRevenueAgg, totalOrders, totalCustomers, totalProducts, pendingOrders, lowStockCount] =
    await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ orderStatus: 'pending' }),
      Product.countDocuments({ isActive: true, $expr: { $lte: ['$stock', '$lowStockThreshold'] }, stock: { $gt: 0 } }),
    ]);

  return {
    totalRevenue: totalRevenueAgg[0]?.total || 0,
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    lowStockCount,
  };
};

export const getSalesReport = async (query) => {
  const dateFilter = buildDateFilter(query);
  const format = dateFormatFor(query.groupBy || 'day');

  const sales = await Order.aggregate([
    { $match: { ...dateFilter, paymentStatus: 'paid' } },
    {
      $group: {
        _id: { $dateToString: { format, date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
        discounts: { $sum: '$discountAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return sales.map((row) => ({ period: row._id, revenue: row.revenue, orders: row.orders, discounts: row.discounts }));
};

export const getTopSellingProducts = async ({ limit = 10 } = {}) =>
  Product.find({ isActive: true }).sort('-totalSold').limit(Number(limit)).select('name sku totalSold stock price');

export const getOrderStatusBreakdown = async (query) => {
  const dateFilter = buildDateFilter(query);
  const breakdown = await Order.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ]);
  return breakdown.map((row) => ({ status: row._id, count: row.count }));
};

export const getPaymentMethodBreakdown = async (query) => {
  const dateFilter = buildDateFilter(query);
  const breakdown = await Payment.aggregate([
    { $match: { ...dateFilter, status: 'completed' } },
    { $group: { _id: '$method', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);
  return breakdown.map((row) => ({ method: row._id, total: row.total, count: row.count }));
};

export const getCustomerGrowth = async (query) => {
  const dateFilter = buildDateFilter(query);
  const format = dateFormatFor(query.groupBy || 'month');

  const growth = await User.aggregate([
    { $match: { ...dateFilter, role: 'customer' } },
    { $group: { _id: { $dateToString: { format, date: '$createdAt' } }, newCustomers: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return growth.map((row) => ({ period: row._id, newCustomers: row.newCustomers }));
};

export const getInventoryReport = async () => {
  const [lowStock, outOfStock, totalStockValue] = await Promise.all([
    Product.find({ isActive: true, $expr: { $lte: ['$stock', '$lowStockThreshold'] }, stock: { $gt: 0 } }).select(
      'name sku stock lowStockThreshold'
    ),
    Product.find({ isActive: true, stock: 0 }).select('name sku'),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$stock', '$price'] } } } },
    ]),
  ]);

  return {
    lowStock,
    outOfStock,
    totalStockValue: totalStockValue[0]?.total || 0,
  };
};

export const getTopCustomers = async ({ limit = 10 } = {}) =>
  Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: '$user', totalSpent: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    { $sort: { totalSpent: -1 } },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        name: '$user.name',
        email: '$user.email',
        totalSpent: 1,
        orders: 1,
      },
    },
  ]);
