import { asyncHandler } from '../../../utils/asyncHandler.js';
import { sendResponse } from '../../../utils/apiResponse.js';
import * as invoiceService from '../services/invoiceService.js';

export const listInvoices = asyncHandler(async (req, res) => {
  const { invoices, meta } = await invoiceService.listInvoices(req.query);
  sendResponse(res, 200, invoices, 'Invoices fetched', meta);
});

export const getMyInvoices = asyncHandler(async (req, res) => {
  const { invoices, meta } = await invoiceService.getMyInvoices(req.user.id, req.query);
  sendResponse(res, 200, invoices, 'Your invoices fetched', meta);
});

export const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id, {
    userId: req.user.id,
    isAdmin: ['admin', 'manager'].includes(req.user.role),
  });
  sendResponse(res, 200, invoice, 'Invoice fetched');
});

export const updateInvoiceStatus = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.updateInvoiceStatus(req.params.id, req.body.status);
  sendResponse(res, 200, invoice, 'Invoice status updated');
});
