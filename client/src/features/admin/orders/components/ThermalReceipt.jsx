import { formatPrice, formatDate } from "../../../../utils/formatCurrency";
import { getSettings } from "../../../../data/settingsData";

// Genuine narrow-paper receipt for a physical 80mm thermal printer (72mm
// usable print width) — deliberately NOT a scaled-down version of
// InvoiceDocument. That component is a full-page A4/Letter invoice; forcing
// its two-column layout and table onto an 80mm roll is what made prints
// both unreadable (browser shrinking everything to fit the width) and
// absurdly long (content wrapping across many more narrow lines than
// necessary).
//
// Deliberately sized to 68mm, a bit under the printer's stated 72mm usable
// width: at exactly 72mm, real prints clipped the last character or two off
// every right-aligned value (a driver/print-dialog margin eating into the
// printable area beyond what the @page CSS margin accounts for) — this
// trades a little unused paper for reliably not losing digits off prices.
const Divider = () => <div className="my-1.5 border-t border-dashed border-black" />;

export default function ThermalReceipt({ order }) {
  const settings = getSettings();

  return (
    <div
      id="thermal-receipt"
      className="mx-auto w-[58mm] bg-white text-black font-semibold"
      style={{ fontFamily: "'Courier New', ui-monospace, monospace", fontSize: "11px", lineHeight: 1.4 }}
    >
      <div className="text-center">
        <p className="text-sm font-bold">{settings.storeName}</p>
        <p>{settings.address}</p>
        <p>{settings.supportPhone}</p>
      </div>

      <Divider />

      <div>
        <p>Order: {order.id}</p>
        <p>Date: {formatDate(order.createdAt)}</p>
        <p>Customer: {order.customer.name}</p>
        <p>Phone: {order.customer.phone}</p>
      </div>

      <Divider />

      <div>
        {order.items.map((item, i) => (
          <div key={i} className="mb-1">
            <p className="truncate">{item.name}</p>
            <div className="flex justify-between">
              <span>{item.qty} x {formatPrice(item.price)}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      <div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{order.delivery === 0 ? "Free" : formatPrice(order.delivery)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatPrice(order.discount)}</span>
          </div>
        )}
      </div>

      <Divider />

      <div className="flex justify-between text-sm font-bold">
        <span>TOTAL</span>
        <span>{formatPrice(order.total)}</span>
      </div>

      <Divider />

      <div className="text-center">
        <p>Payment: {order.paymentMethod}</p>
        <p className="mt-2">Thank you for shopping with us!</p>
      </div>
    </div>
  );
}
