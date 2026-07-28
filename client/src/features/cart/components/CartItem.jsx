import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import QuantitySelector from "../../../components/ui/QuantitySelector";
import { formatPrice } from "../../../utils/formatCurrency";
import { useCartStore } from "../../../store/cartStore";

export default function CartItem({ item, compact = false }) {
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 py-4 border-b border-border last:border-0"
    >
      <Link to={`/product/${item.id}`} className="shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className={compact ? "h-14 w-14 rounded-[var(--radius-sm)] object-cover" : "h-20 w-20 rounded-[var(--radius-md)] object-cover"}
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.productId ?? item.id}`}>
          <p className="text-sm font-semibold text-charcoal-900 truncate hover:text-orchard-700 transition-colors">
            {item.name}
          </p>
        </Link>
        {item.variantName ? (
          <p className="text-xs text-charcoal-600 mb-1">
            {item.variantName} {item.variantSku ? `· ${item.variantSku}` : ''}
          </p>
        ) : null}
        <p className="text-xs text-charcoal-600 mb-2">{item.unit}</p>

        <div className="flex items-center justify-between gap-2">
          <QuantitySelector
            value={item.qty}
            onChange={(qty) => updateQty(item.id, qty)}
            max={item.stock ?? 99}
            size="sm"
            variant="outline"
          />
          <span className="text-sm font-bold text-charcoal-900 tabular-nums">
            {formatPrice(item.price * item.qty)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeItem(item.id)}
        aria-label={`Remove ${item.name} from cart`}
        className="self-start p-1.5 text-charcoal-300 hover:text-danger-600 transition-colors shrink-0"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}
