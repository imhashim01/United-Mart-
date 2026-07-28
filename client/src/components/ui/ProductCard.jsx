import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Rating from "./Rating";
import WishlistButton from "./WishlistButton";
import QuantitySelector from "./QuantitySelector";
import { cardHover, imageZoom } from "../../animations/variants";
import { formatPrice } from "../../utils/formatCurrency";
import { useCartStore } from "../../store/cartStore";

export default function ProductCard({ product, rank }) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQty = useCartStore((s) => s.updateQty);

  const defaultVariant = product.variants?.length ? product.variants.find((variant) => variant.isDefault) ?? product.variants[0] : null;
  const displayPrice = defaultVariant ? defaultVariant.discountPrice ?? defaultVariant.price : product.price;
  const displayUnit = defaultVariant?.unit ?? product.unit;
  const outOfStock = defaultVariant ? defaultVariant.stock <= 0 : product.inStock === false;
  const cartItem = items.find((i) => i.id === (defaultVariant ? `${product.id}:${defaultVariant.id}` : product.id));
  const qty = cartItem?.qty ?? 0;
  const image = product.images?.[0] ?? product.image;
  const variantDiscount = defaultVariant && defaultVariant.discountPrice != null && defaultVariant.price > defaultVariant.discountPrice
    ? Math.round(((defaultVariant.price - defaultVariant.discountPrice) / defaultVariant.price) * 100)
    : 0;
  const displayDiscount = variantDiscount || product.discount || 0;
  const showBadge = displayDiscount > 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem(product, 1, defaultVariant?.id);
    toast.success(`${product.name} added to cart`, { style: { fontSize: "13px" } });
  };

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardHover}
      className="group relative flex flex-col bg-white rounded-[var(--radius-lg)] border border-border overflow-hidden h-full"
    >
      {/* Image */}
      <Link to={`/product/${product.slug ?? product.id}`} className="relative block aspect-square overflow-hidden bg-linen-50">
        <motion.img
          variants={imageZoom}
          src={image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />

        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-charcoal-900 text-white text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-sm)]">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {showBadge && (
            <span className="bg-mango-500 text-charcoal-900 text-[11px] font-bold px-2 py-1 rounded-[var(--radius-sm)]">
              -{displayDiscount}%
            </span>
          )}
          {!showBadge && product.badge && (
            <span className="bg-orchard-900 text-white text-[11px] font-bold px-2 py-1 rounded-[var(--radius-sm)]">
              {product.badge}
            </span>
          )}
          {rank && (
            <span className="bg-charcoal-900 text-white text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full">
              #{rank}
            </span>
          )}
        </div>

        <WishlistButton
          productId={product.id}
          productName={product.name}
          size={16}
          className="absolute top-2.5 right-2.5 h-8 w-8"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-charcoal-600 mb-1">
          {product.category}
        </p>
        <Link to={`/product/${product.slug ?? product.id}`}>
          <h3 className="text-[15px] font-semibold text-charcoal-900 leading-snug line-clamp-2 mb-1.5 hover:text-orchard-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        <Rating value={product.rating} reviews={product.reviewCount ?? product.reviews} />

        <p className="text-xs text-charcoal-600 mt-1">{displayUnit}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-charcoal-900 tabular-nums">
              {formatPrice(displayPrice)}
            </span>
            {defaultVariant && defaultVariant.discountPrice != null && defaultVariant.price > defaultVariant.discountPrice && (
              <span className="text-xs text-charcoal-300 line-through tabular-nums">
                {formatPrice(defaultVariant.price)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3">
          <AnimatePresence mode="wait" initial={false}>
            {qty === 0 ? (
              <motion.button
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAdd}
                disabled={outOfStock}
                className="w-full h-9 flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors disabled:bg-charcoal-300 disabled:cursor-not-allowed"
              >
                <ShoppingBasket size={15} />
                {outOfStock ? "Unavailable" : "Add to Cart"}
              </motion.button>
            ) : (
              <motion.div
                key="stepper"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <QuantitySelector
                  value={qty}
                  onChange={(next) => updateQty(product.id, next)}
                  max={product.stockCount ?? 99}
                  variant="filled"
                  className="w-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
