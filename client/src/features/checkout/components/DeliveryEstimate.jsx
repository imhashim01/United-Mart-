import { Truck, Clock, ShieldCheck, CalendarDays, AlertTriangle } from "lucide-react";
import { useCartStore } from "../../../store/cartStore";
import { formatPrice, formatDate } from "../../../utils/formatCurrency";

function getEstimatedDeliveryDate() {
  const date = new Date();
  const hour = date.getHours();
  const weekday = date.getDay();

  if (weekday === 4 && hour >= 16) {
    date.setDate(date.getDate() + 2);
  } else if (weekday === 5) {
    date.setDate(date.getDate() + 1);
  } else if (hour >= 16) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

export default function DeliveryEstimate() {
  const subtotal = useCartStore((s) => s.subtotal());
  const deliveryCharge = useCartStore((s) => s.deliveryCharge());
  const freeDeliveryProgress = useCartStore((s) => s.freeDeliveryProgress());
  const minimumOrderAmount = useCartStore((s) => s.minimumOrderAmount());
  const meetsMinimumOrder = useCartStore((s) => s.meetsMinimumOrder());

  const estimatedDate = getEstimatedDeliveryDate();
  const isToday = estimatedDate.toDateString() === new Date().toDateString();

  return (
    <div className="border border-border rounded-[var(--radius-md)] bg-white shadow-sm p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-charcoal-900">Delivery Information</p>
          <p className="text-xs text-charcoal-600">Fast, reliable grocery delivery in Sukkur and nearby areas.</p>
        </div>
        <ShieldCheck size={20} className="text-orchard-700" />
      </div>

      {!meetsMinimumOrder && subtotal > 0 && (
        <div className="mb-4 flex items-start gap-2 rounded-[var(--radius-sm)] border border-danger-600/30 bg-danger-100 px-3 py-2.5 text-sm text-danger-600">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>
            Add <strong>{formatPrice(minimumOrderAmount - subtotal)}</strong> more to reach the {formatPrice(minimumOrderAmount)} minimum order.
          </span>
        </div>
      )}

      <div className="grid gap-4 text-sm text-charcoal-600">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-orchard-700" />
          <span>Orders placed before 4:00 PM are delivered same day.</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-orchard-700" />
          <span>
            Estimated delivery: <strong className="text-charcoal-900">{isToday ? "Today" : formatDate(estimatedDate)}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-orchard-700" />
          <span>
            Delivery charge: <strong className="text-charcoal-900">{deliveryCharge === 0 ? "Free" : formatPrice(deliveryCharge)}</strong>
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-[var(--radius-md)] bg-linen-50 p-4 text-sm text-charcoal-600 space-y-2">
        <p className="font-semibold text-charcoal-900">Delivery policy</p>
        <p>• Same-day delivery for orders before 4:00 PM (Saturday–Wednesday).</p>
        <p>• Orders placed after 4:00 PM are delivered next day.</p>
        <p>• Thursday orders are delivered on Saturday.</p>
        <p>• Friday orders are delivered on Saturday.</p>
      </div>

      <div className="mt-4 grid gap-3 text-sm">
        <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-white border border-border p-3">
          <span>Minimum order</span>
          <strong>{formatPrice(minimumOrderAmount)}</strong>
        </div>
        <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-white border border-border p-3">
          <span>Free delivery threshold</span>
          <strong>{formatPrice(freeDeliveryProgress.threshold)}</strong>
        </div>
      </div>

      {!freeDeliveryProgress.reached && freeDeliveryProgress.remaining > 0 && (
        <div className="mt-4">
          <div className="h-2 rounded-full bg-linen-50 overflow-hidden mb-2">
            <div
              className="h-full bg-mango-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, ((freeDeliveryProgress.threshold - freeDeliveryProgress.remaining) / freeDeliveryProgress.threshold) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-charcoal-600">
            Add <strong className="text-orchard-900">{formatPrice(freeDeliveryProgress.remaining)}</strong> more for free delivery.
          </p>
        </div>
      )}
    </div>
  );
}