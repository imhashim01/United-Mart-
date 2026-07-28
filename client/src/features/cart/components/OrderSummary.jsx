import { useCartStore } from "../../../store/cartStore";
import { formatPrice, formatDate } from "../../../utils/formatCurrency";

const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  jazzcash: "JazzCash",
  easypaisa: "EasyPaisa",
  bank: "Bank Transfer",
};

const getEstimatedDeliveryDate = () => {
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
};

export default function OrderSummary({ showTitle = true, paymentMethod = "cod" }) {
  const subtotal = useCartStore((s) => s.subtotal());
  const couponDiscount = useCartStore((s) => s.couponDiscount());
  const couponCode = useCartStore((s) => s.couponCode);
  const rewardPointsDiscount = useCartStore((s) => s.rewardPointsDiscount());
  const rewardPointsToRedeem = useCartStore((s) => s.rewardPointsToRedeem);
  const deliveryCharge = useCartStore((s) => s.deliveryCharge());
  const total = useCartStore((s) => s.total());
  const estimatedDeliveryDate = getEstimatedDeliveryDate();

  return (
    <div className="border border-border rounded-[var(--radius-md)] bg-white p-5 shadow-sm">
      {showTitle && <p className="text-sm font-semibold text-charcoal-900 mb-4">Order Summary</p>}

      <div className="flex flex-col gap-3 text-sm">
        <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />

        {couponDiscount > 0 && (
          <SummaryRow
            label={`Coupon (${couponCode})`}
            value={`−${formatPrice(couponDiscount)}`}
            valueClass="text-success-600"
          />
        )}

        {rewardPointsToRedeem > 0 && (
          <SummaryRow
            label={`Reward Points (${rewardPointsToRedeem} pts)`}
            value={`−${formatPrice(rewardPointsDiscount)}`}
            valueClass="text-success-600"
          />
        )}

        <SummaryRow
          label="Delivery Charges"
          value={deliveryCharge === 0 ? "Free" : formatPrice(deliveryCharge)}
        />

        <SummaryRow
          label="Estimated Delivery"
          value={formatDate(estimatedDeliveryDate)}
        />

        <SummaryRow
          label="Payment Method"
          value={PAYMENT_LABELS[paymentMethod] || PAYMENT_LABELS.cod}
        />

        <div className="pt-4 mt-2 border-t border-border">
          <div className="flex items-center justify-between text-base font-semibold text-charcoal-900">
            <span>Grand Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, valueClass = "text-charcoal-900" }) {
  return (
    <div className="flex items-center justify-between text-charcoal-600">
      <span>{label}</span>
      <span className={`tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}
