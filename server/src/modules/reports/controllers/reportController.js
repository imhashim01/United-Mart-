import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as reportService from '../services/reportService.js';

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await reportService.getDashboardSummary();
  sendResponse(res, 200, summary, 'Dashboard summary fetched');
});

export const getSalesReport = asyncHandler(async (req, res) => {
  const sales = await reportService.getSalesReport(req.query);
  sendResponse(res, 200, sales, 'Sales report fetched');
});

export const getTopSellingProducts = asyncHandler(async (req, res) => {
  const products = await reportService.getTopSellingProducts(req.query);
  sendResponse(res, 200, products, 'Top selling products fetched');
});

export const getOrderStatusBreakdown = asyncHandler(async (req, res) => {
  const breakdown = await reportService.getOrderStatusBreakdown(req.query);
  sendResponse(res, 200, breakdown, 'Order status breakdown fetched');
});

export const getPaymentMethodBreakdown = asyncHandler(async (req, res) => {
  const breakdown = await reportService.getPaymentMethodBreakdown(req.query);
  sendResponse(res, 200, breakdown, 'Payment method breakdown fetched');
});

export const getCustomerGrowth = asyncHandler(async (req, res) => {
  const growth = await reportService.getCustomerGrowth(req.query);
  sendResponse(res, 200, growth, 'Customer growth fetched');
});

export const getInventoryReport = asyncHandler(async (req, res) => {
  const report = await reportService.getInventoryReport();
  sendResponse(res, 200, report, 'Inventory report fetched');
});

export const getTopCustomers = asyncHandler(async (req, res) => {
  const customers = await reportService.getTopCustomers(req.query);
  sendResponse(res, 200, customers, 'Top customers fetched');
});
