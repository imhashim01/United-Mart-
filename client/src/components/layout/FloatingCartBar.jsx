import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ShoppingBasket } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

const HIDDEN_PREFIXES = ["/cart", "/checkout", "/admin"];

export default function FloatingCartBar() {
  const location = useLocation();
  const itemCount = useCartStore((s) => s.itemCount());

  const isHiddenRoute = HIDDEN_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));
  const visible = !isHiddenRoute && itemCount > 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm sm:max-w-md"
        >
          <Link
            to="/cart"
            className="flex items-center justify-between gap-3 h-14 pl-4 pr-2 rounded-full bg-orchard-900 text-white shadow-lg shadow-orchard-900/30 hover:bg-orchard-700 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <ShoppingBasket size={18} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">View Cart</p>
                <p className="text-xs text-white/70">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <ChevronRight size={18} />
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}