import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Check, Eye } from "lucide-react";
import { useCartStore } from "../../../store/cartStore";
import { formatPrice } from "../../../utils/formatCurrency";

export default function CouponInput() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null); // { type, text }

  const couponCode = useCartStore((s) => s.couponCode);
  const couponDiscount = useCartStore((s) => s.couponDiscount());
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const handleApply = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    const result = applyCoupon(code);
    setMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) setCode("");
  };

  return (
    <div className="border border-border rounded-[var(--radius-md)] bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-charcoal-900 flex items-center gap-1.5">
          <Tag size={15} className="text-mango-500" />
          Coupon Code
        </div>
        <button
          type="button"
          onClick={() => setMessage(null)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal-600 hover:text-orchard-700"
        >
          <Eye size={14} />
          View Available Coupons
        </button>
      </div>

      {couponCode ? (
        <div className="flex items-center justify-between bg-success-100 rounded-[var(--radius-sm)] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Check size={15} className="text-success-600" />
            <span className="text-sm font-semibold text-success-600">{couponCode}</span>
            <span className="text-xs text-success-600">(−{formatPrice(couponDiscount)})</span>
          </div>
          <button
            type="button"
            onClick={() => {
              removeCoupon();
              setMessage({ type: "success", text: "Coupon removed." });
            }}
            aria-label="Remove coupon"
            className="text-success-600 hover:text-danger-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setMessage(null);
            }}
            placeholder="Enter coupon code"
            className="flex-1 h-11 px-3 rounded-[var(--radius-sm)] border border-border-strong text-sm placeholder:text-charcoal-300 focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700"
          />
          <button
            type="submit"
            className="h-11 px-4 rounded-[var(--radius-sm)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors shrink-0"
          >
            Apply
          </button>
        </form>
      )}

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-xs mt-2 ${message.type === "success" ? "text-success-600" : "text-danger-600"}`}
          >
            {message.text}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-xs text-charcoal-600 mt-3">
        Popular codes: <span className="font-medium">FRESH10</span>, <span className="font-medium">SAVE200</span>, <span className="font-medium">MANGO24</span>
      </p>
    </div>
  );
}
