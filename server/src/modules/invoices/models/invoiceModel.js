import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [invoiceItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    billingAddress: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ['paid', 'unpaid', 'overdue', 'void'], default: 'unpaid' },
    dueDate: { type: Date },
    issuedAt: { type: Date, default: Date.now },
    pdf: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ user: 1, createdAt: -1 });

export const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
