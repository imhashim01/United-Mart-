import { create } from "zustand";
import { persist } from "zustand/middleware";

// Mock coupon table — replace with a real /api/v1/coupons/validate call later.
const COUPONS = {
  FRESH10: { type: "percent", value: 10, minSpend: 1000, label: "10% off" },
  SAVE200: { type: "flat", value: 200, minSpend: 1500, label: "Rs 200 off" },
  MANGO24: { type: "percent", value: 24, minSpend: 2000, label: "24% off (seasonal)" },
};

const DELIVERY_FLAT_RATE = 150;
const FREE_DELIVERY_THRESHOLD = 3000;
const REWARD_POINT_VALUE = 1; // 1 point = Rs 1 when redeemed
const POINTS_EARNED_PER_100 = 1; // 1 point per Rs 100 spent

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { id, name, image, price, unit, qty, stock }
      couponCode: null,
      rewardPointsAvailable: 640, // mock user balance — replace with account data
      rewardPointsToRedeem: 0,

      addItem: (product, qty = 1, variantId = null) => {
        const itemId = variantId ? `${product.id}:${variantId}` : product.id;
        const variant = variantId ? product.variants?.find((v) => v.id === variantId) : null;
        const items = get().items;
        const existing = items.find((i) => i.id === itemId);
        const stock = variant ? variant.stock : product.stockCount ?? 99;
        const price = variant ? variant.discountPrice ?? variant.price : product.price;
        const unit = variant ? variant.unit : product.unit;
        // Choose image: prefer variant primary image, then first variant image, then product images
        const resolveImageFromImageObj = (img) => (typeof img === 'string' ? img : img.imageUrl || img.url || img.thumbnailUrl || '');
        let image = '';
        if (variant) {
          if (Array.isArray(variant.images) && variant.images.length) {
            const primary = variant.images.find((im) => im && (im.isPrimary === true));
            image = primary ? resolveImageFromImageObj(primary) : resolveImageFromImageObj(variant.images[0]);
          }
        }
        if (!image) {
          image = Array.isArray(product.images) && product.images.length ? resolveImageFromImageObj(product.images[0]) : product.image || '';
        }
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === itemId
                ? { ...i, qty: Math.min(i.qty + qty, stock) }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                    id: itemId,
                    productId: product.id,
                    variantId: variantId ?? null,
                    variantName: variant?.name ?? null,
                    variantSku: variant?.sku ?? null,
                    name: product.name,
                    image,
                    price,
                    unit,
                    category: product.category ?? "Other",
                    qty,
                    stock,
                  },
            ],
          });
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, qty: Math.min(qty, i.stock) } : i
          ),
        });
      },

      clearCart: () => set({ items: [], couponCode: null, rewardPointsToRedeem: 0 }),

      applyCoupon: (code) => {
        const upper = code.trim().toUpperCase();
        const coupon = COUPONS[upper];
        const subtotal = get().subtotal();
        if (!coupon) return { success: false, message: "Invalid coupon code." };
        if (subtotal < coupon.minSpend) {
          return {
            success: false,
            message: `Add Rs ${(coupon.minSpend - subtotal).toLocaleString()} more to use this coupon.`,
          };
        }
        set({ couponCode: upper });
        return { success: true, message: `Coupon applied — ${coupon.label}` };
      },

      removeCoupon: () => set({ couponCode: null }),

      setRewardPointsToRedeem: (points) => {
        const max = Math.min(get().rewardPointsAvailable, Math.floor(get().subtotal() * 0.5));
        set({ rewardPointsToRedeem: Math.max(0, Math.min(points, max)) });
      },

      // ---- Derived values ----
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      couponDiscount: () => {
        const code = get().couponCode;
        if (!code || !COUPONS[code]) return 0;
        const coupon = COUPONS[code];
        const subtotal = get().subtotal();
        return coupon.type === "percent"
          ? Math.round(subtotal * (coupon.value / 100))
          : coupon.value;
      },

      rewardPointsDiscount: () => get().rewardPointsToRedeem * REWARD_POINT_VALUE,

      deliveryCharge: () => {
        const subtotal = get().subtotal();
        if (subtotal === 0) return 0;
        return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FLAT_RATE;
      },

      total: () => {
        const s = get();
        const raw =
          s.subtotal() - s.couponDiscount() - s.rewardPointsDiscount() + s.deliveryCharge();
        return Math.max(0, raw);
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      pointsToEarn: () => Math.floor(get().subtotal() / 100) * POINTS_EARNED_PER_100,

      freeDeliveryProgress: () => {
        const subtotal = get().subtotal();
        return {
          remaining: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
          reached: subtotal >= FREE_DELIVERY_THRESHOLD,
          threshold: FREE_DELIVERY_THRESHOLD,
        };
      },
    }),
    { name: "united-mart-cart" }
  )
);

export { COUPONS, FREE_DELIVERY_THRESHOLD, DELIVERY_FLAT_RATE };
