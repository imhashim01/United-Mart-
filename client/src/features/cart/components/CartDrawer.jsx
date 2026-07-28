import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBasket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import DeliveryEstimate from "../../checkout/components/DeliveryEstimate";
import { useCartStore } from "../../../store/cartStore";

export default function CartDrawer({ open, onClose }) {
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal-900/40 z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-[var(--shadow-lg)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-charcoal-900">
                Your Cart {itemCount > 0 && <span className="text-charcoal-600 font-normal">({itemCount})</span>}
              </h2>
              <button onClick={onClose} aria-label="Close cart" className="p-1.5 hover:bg-linen-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="h-16 w-16 rounded-full bg-linen-50 flex items-center justify-center mb-4">
                  <ShoppingBasket size={28} className="text-charcoal-300" />
                </div>
                <h3 className="text-base font-semibold text-charcoal-900 mb-1.5">Your cart is empty</h3>
                <p className="text-sm text-charcoal-600 mb-5">Add some fresh groceries to get started.</p>
                <button
                  onClick={onClose}
                  className="h-10 px-5 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} compact />
                    ))}
                  </AnimatePresence>
                </div>

                <div className="shrink-0 border-t border-border p-5 flex flex-col gap-3">
                  <DeliveryEstimate />
                  <OrderSummary />
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-orchard-900 text-white font-semibold hover:bg-orchard-700 transition-colors"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
