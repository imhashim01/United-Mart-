import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useWishlistStore } from "../../store/wishlistStore";

export default function WishlistButton({ productId, productName, size = 16, className }) {
  const wishlisted = useWishlistStore((s) => s.isWishlisted(productId));
  const toggle = useWishlistStore((s) => s.toggle);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
    toast(wishlisted ? `Removed from wishlist` : `Added to wishlist`, {
      icon: wishlisted ? "💔" : "❤️",
      style: { fontSize: "13px" },
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={wishlisted ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      aria-pressed={wishlisted}
      className={clsx(
        "flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-[var(--shadow-xs)] hover:scale-105 transition-transform",
        className
      )}
    >
      <motion.span
        key={wishlisted}
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Heart
          size={size}
          className={clsx(
            "transition-colors",
            wishlisted ? "fill-danger-600 text-danger-600" : "text-charcoal-600"
          )}
        />
      </motion.span>
    </button>
  );
}
