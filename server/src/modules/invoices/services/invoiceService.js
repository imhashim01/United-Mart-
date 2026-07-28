import { jsPDF } from 'jspdf';
import Invoice from '../models/invoiceModel.js';
import Order from '../../orders/models/orderModel.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiFeatures, buildPaginationMeta } from '../../../utils/apiFeatures.js';
import { generateInvoiceNumber } from '../../../utils/generateInvoiceNumber.js';
import { uploadBufferToCloudinary } from '../../../config/cloudinary.js';

const buildInvoicePdfBuffer = (invoice, order) => {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text('United Mart Sukkur', 14, y);
  doc.setFontSize(11);
  y += 8;
  doc.text(`Invoice: ${invoice.invoiceNumber}`, 14, y);
  y += 6;
  doc.text(`Order: ${order.orderNumber}`, 14, y);
  y += 6;
  doc.text(`Date: ${new Date(invoice.issuedAt).toLocaleDateString()}`, 14, y);
  y += 10;

  doc.setFontSize(12);
  doc.text('Items', 14, y);
  y += 6;
  doc.setFontSize(10);

  invoice.items.forEach((item) => {
    doc.text(`${item.name}  x${item.quantity}  @ Rs.${item.price}  = Rs.${item.subtotal}`, 14, y);
    y += 6;
  });

  y += 4;
  doc.setFontSize(11);
  doc.text(`Subtotal: Rs.${invoice.subtotal}`, 14, y);
  y += 6;
  doc.text(`Discount: Rs.${invoice.discountAmount}`, 14, y);
  y += 6;
  doc.text(`Tax: Rs.${invoice.taxAmount}`, 14, y);
  y += 6;
  doc.text(`Shipping: Rs.${invoice.shippingFee}`, 14, y);
  y += 6;
  doc.setFontSize(13);
  doc.text(`Total: Rs.${invoice.totalAmount}`, 14, y);

  return Buffer.from(doc.output('arraybuffer'));
};

export const createInvoiceForOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');

  const existing = await Invoice.findOne({ order: orderId });
  if (existing) return existing;

  const invoice = await Invoice.create({
    invoiceNumber: generateInvoiceNumber(),
    order: order._id,
    user: order.user,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    })),
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    taxAmount: order.taxAmount,
    shippingFee: order.shippingFee,
    totalAmount: order.totalAmount,
    billingAddress: order.billingAddress,
    status: order.paymentStatus === 'paid' ? 'paid' : 'unpaid',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  try {
    const pdfBuffer = buildInvoicePdfBuffer(invoice, order);
    const uploadResult = await uploadBufferToCloudinary(pdfBuffer, {
      folder: 'united-mart-sukkur/invoices',
      resourceType: 'raw',
    });
    invoice.pdf = { url: uploadResult.secure_url, publicId: uploadResult.public_id };
    await invoice.save();
  } catch (error) {
    console.error('Invoice PDF generation failed:', error.message);
  }

  return invoice;
};

export const listInvoices = async (queryString, filter = {}) => {
  const total = await Invoice.countDocuments({ ...filter, ...new ApiFeatures(Invoice.find(), queryString).filter().query.getFilter() });
  const features = new ApiFeatures(Invoice.find(filter).populate('order', 'orderNumber').populate('user', 'name email'), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const invoices = await features.query;
  return { invoices, meta: buildPaginationMeta({ ...features.pagination, total }) };
};

export const getMyInvoices = async (userId, queryString) => listInvoices(queryString, { user: userId });

export const getInvoiceById = async (id, { userId, isAdmin } = {}) => {
  const invoice = await Invoice.findById(id).populate('order', 'orderNumber').populate('user', 'name email');
  if (!invoice) throw ApiError.notFound('Invoice not found');
  if (!isAdmin && userId && invoice.user._id.toString() !== userId) {
    throw ApiError.forbidden('You do not have permission to view this invoice');
  }
  return invoice;
};

export const updateInvoiceStatus = async (id, status) => {
  const invoice = await Invoice.findByIdAndUpdate(id, { status }, { new: true });
  if (!invoice) throw ApiError.notFound('Invoice not found');
  return invoice;
};
