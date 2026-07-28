import logo from "../../../../assets/images/logo.png";
import { formatPrice, formatDate } from "../../../../utils/formatCurrency";

export default function InvoiceDocument({ order }) {
  return (
    <div className="bg-white text-charcoal-900 p-8 md:p-10 print:p-0 max-w-3xl mx-auto" id="invoice-document">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b-2 border-orchard-900 mb-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="United Mart Sukkur" className="h-12 w-12" />
          <div>
            <p className="font-display text-lg font-semibold text-orchard-900">United Mart Sukkur</p>
            <p className="text-xs text-charcoal-600">Station Road, Sukkur, Sindh, Pakistan</p>
            <p className="text-xs text-charcoal-600">support@unitedmartsukkur.pk · +92 300 1234567</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-orchard-900 tracking-wide">INVOICE</p>
          <p className="text-sm text-charcoal-600">{order.id}</p>
          <p className="text-xs text-charcoal-600">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Bill to / order info */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-600 mb-2">Bill To</p>
          <p className="text-sm font-semibold text-charcoal-900">{order.customer.name}</p>
          <p className="text-sm text-charcoal-600">{order.customer.phone}</p>
          <p className="text-sm text-charcoal-600">{order.customer.email}</p>
          <p className="text-sm text-charcoal-600">
            {order.address.line1}, {order.address.area}, {order.address.city}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-600 mb-2">Order Details</p>
          <p className="text-sm text-charcoal-600">Status: <span className="font-medium text-charcoal-900">{order.status}</span></p>
          <p className="text-sm text-charcoal-600">Payment: <span className="font-medium text-charcoal-900">{order.paymentMethod}</span></p>
          <p className="text-sm text-charcoal-600">Items: <span className="font-medium text-charcoal-900">{order.items.length}</span></p>
        </div>
      </div>

      {/* Items table */}
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="bg-linen-50 text-left">
            <th className="px-3 py-2.5 font-semibold text-charcoal-900 text-xs uppercase tracking-wide">Item</th>
            <th className="px-3 py-2.5 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Qty</th>
            <th className="px-3 py-2.5 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Price</th>
            <th className="px-3 py-2.5 font-semibold text-charcoal-900 text-xs uppercase tracking-wide text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i} className="border-b border-border">
              <td className="px-3 py-3 text-charcoal-900">{item.name}</td>
              <td className="px-3 py-3 text-right tabular-nums text-charcoal-600">{item.qty}</td>
              <td className="px-3 py-3 text-right tabular-nums text-charcoal-600">{formatPrice(item.price)}</td>
              <td className="px-3 py-3 text-right tabular-nums font-medium text-charcoal-900">
                {formatPrice(item.price * item.qty)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-charcoal-600">
            <span>Subtotal</span>
            <span className="tabular-nums text-charcoal-900">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-charcoal-600">
            <span>Delivery</span>
            <span className="tabular-nums text-charcoal-900">
              {order.delivery === 0 ? "Free" : formatPrice(order.delivery)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success-600">
              <span>Discount</span>
              <span className="tabular-nums">-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2.5 mt-1 border-t-2 border-orchard-900">
            <span className="font-bold text-orchard-900">Total</span>
            <span className="font-bold text-orchard-900 tabular-nums text-base">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border text-center">
        <p className="text-xs text-charcoal-600">Thank you for shopping with United Mart Sukkur.</p>
        <p className="text-xs text-charcoal-600">This is a system-generated invoice and does not require a signature.</p>
      </div>
    </div>
  );
}
