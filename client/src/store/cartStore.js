import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as couponsApi from "../features/checkout/api/couponsApi";
import { trackAddToCart } from "../features/tracking/api/trackingApi";
import { getFbp } from "../utils/fbCookies";
import { useAuthStore } from "../features/auth/hooks/useAuth";
import { getSettings } from "../data/settingsData";

const REWARD_POINT_VALUE = 1; // 1 point = Rs 1 when redeemed
const POINTS_EARNED_PER_100 = 1; // 1 point per Rs 100 spent
const COUPON_REVALIDATE_DELAY_MS = 400;

// The coupon endpoint prices items and looks up their categories itself, so
// only identifiers and quantities are sent.
const toCouponCartItems = (items) =>
  items.map((i) => ({ productId: i.productId, variantId: i.variantId || null, quantity: i.qty }));

// Guards against an older, slower validation response overwriting a newer one.
let couponRequestId = 0;



export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { id, name, image, price, unit, qty, stock }
      couponCode: null,
      appliedCoupon: null, // { discountType, discountValue, maxDiscountAmount, minPurchaseAmount } — set only after the backend validates the code
      couponDiscountAmount: 0, // the backend's discount for the current cart — the only source of the shown discount
      couponMessage: null, // why an applied coupon currently gives no discount (e.g. not enough eligible items)
      rewardPointsAvailable: 0, // hydrated from GET /rewards/me by RewardPointsRedeem.jsx on mount
      rewardPointsToRedeem: 0,

      addItem: (product, qty = 1, variantId = null) => {
        const itemId = variantId ? `${product.id}:${variantId}` : product.id;
        const variant = variantId ? product.variants?.find((v) => v.id === variantId) : null;
        const items = get().items;
        const existing = items.find((i) => i.id === itemId);
        const stock = variant ? variant.stock : product.stockCount ?? 99;
        const price = variant ? variant.discountPrice ?? variant.price : product.price;
        const unit = variant ? variant.unit : product.unit;
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
        const addToCartEventId = `addtocart-${product.id}-${Date.now()}`;
        if (typeof window.fbq === "function") {
        window.fbq(
        "track",
        "AddToCart",
        {
        content_name: product.name,
        content_ids: [product.id],
        content_type: "product",
        value: price,
        currency: "PKR",
      },
      { eventID: addToCartEventId }
  );
}
        // Server-side mirror for Meta Conversions API, deduplicated against
        // the browser event above via the shared event ID. Fire-and-forget —
        // must never affect cart behavior if it fails.
        const authUser = useAuthStore.getState().user;
        trackAddToCart({
          eventId: addToCartEventId,
          productId: product.id,
          productName: product.name,
          price,
          fbp: getFbp(),
          email: authUser?.email,
          phone: authUser?.phone,
          eventSourceUrl: window.location.href,
        }).catch(() => {});
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

      clearCart: () =>
        set({ items: [], couponCode: null, appliedCoupon: null, couponDiscountAmount: 0, couponMessage: null, rewardPointsToRedeem: 0 }),

      // Validates the code against the real backend (real coupons an admin
      // created, real min-spend/expiry/usage-limit rules) instead of a
      // hardcoded local table.
      applyCoupon: async (code) => {
        const trimmed = code.trim().toUpperCase();
        const items = get().items;
        if (items.length === 0) return { success: false, message: "Add items to your cart first." };
        couponRequestId += 1; // drops any in-flight re-validation of an older coupon
        try {
          const { data } = await couponsApi.validateCoupon({ code: trimmed, items: toCouponCartItems(items) });
          const { coupon, discount } = data.data;
          set({
            couponCode: coupon.code,
            appliedCoupon: {
              discountType: coupon.discountType,
              discountValue: coupon.discountValue,
              maxDiscountAmount: coupon.maxDiscountAmount,
              minPurchaseAmount: coupon.minPurchaseAmount,
            },
            couponDiscountAmount: discount,
            couponMessage: null,
          });
          // The cart changed while the request was in flight — re-check it.
          if (get().items !== items) get().revalidateCoupon();
          return { success: true, message: `Coupon applied — you saved Rs ${discount.toLocaleString()}` };
        } catch (error) {
          return {
            success: false,
            message: error?.response?.data?.message || "Invalid coupon code.",
          };
        }
      },

      // Re-checks the applied coupon against the current cart so the shown
      // discount always matches what the backend will charge. The coupon stays
      // applied when it stops qualifying (e.g. an item was removed) — the
      // discount drops to 0 with a message, and comes back if the cart grows.
      revalidateCoupon: async () => {
        const { couponCode, items } = get();
        if (!couponCode) return;
        const requestId = ++couponRequestId;
        if (items.length === 0) {
          set({ couponDiscountAmount: 0, couponMessage: null });
          return;
        }
        try {
          const { data } = await couponsApi.validateCoupon({ code: couponCode, items: toCouponCartItems(items) });
          if (requestId !== couponRequestId || get().couponCode !== couponCode) return;
          set({ couponDiscountAmount: data.data.discount, couponMessage: null });
        } catch (error) {
          if (requestId !== couponRequestId || get().couponCode !== couponCode) return;
          set({
            couponDiscountAmount: 0,
            couponMessage: error?.response?.data?.message || "This coupon no longer applies to your cart.",
          });
        }
      },

      removeCoupon: () => {
        couponRequestId += 1;
        set({ couponCode: null, appliedCoupon: null, couponDiscountAmount: 0, couponMessage: null });
      },

      setRewardPointsAvailable: (points) => set({ rewardPointsAvailable: points }),

      setRewardPointsToRedeem: (points) => {
        const max = Math.min(get().rewardPointsAvailable, Math.floor(get().subtotal() * 0.5));
        set({ rewardPointsToRedeem: Math.max(0, Math.min(points, max)) });
      },

      // ---- Derived values ----
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      // Comes from the backend's validation of the current cart (kept fresh by
      // revalidateCoupon) — excluded categories make a local calculation
      // impossible. The real charge is still recomputed server-side at checkout.
      couponDiscount: () => {
        if (!get().couponCode) return 0;
        return Math.min(get().couponDiscountAmount || 0, get().subtotal());
      },

      rewardPointsDiscount: () => get().rewardPointsToRedeem * REWARD_POINT_VALUE,

      deliveryCharge: () => {
        const subtotal = get().subtotal();
        if (subtotal === 0) return 0;
        return subtotal >= getSettings().freeDeliveryThreshold ? 0 : getSettings().deliveryFlatRate;
      },

      minimumOrderAmount: () => getSettings().minimumOrderAmount,

      meetsMinimumOrder: () => get().subtotal() >= getSettings().minimumOrderAmount,

      total: () => {
        const s = get();
        const raw =
          s.subtotal() - s.couponDiscount() - s.rewardPointsDiscount() + s.deliveryCharge();
        return Math.max(0, raw);
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      pointsToEarn: () => Math.floor(get().subtotal() / 100) * POINTS_EARNED_PER_100,

      freeDeliveryThresholdAmount: () => getSettings().freeDeliveryThreshold,
    }),
    { name: "united-mart-cart" }
  )
);

// Any change to the cart's items re-validates an applied coupon (debounced so
// quick quantity clicks send one request).
let couponRevalidateTimer = null;
const scheduleCouponRevalidation = () => {
  clearTimeout(couponRevalidateTimer);
  couponRevalidateTimer = setTimeout(() => useCartStore.getState().revalidateCoupon(), COUPON_REVALIDATE_DELAY_MS);
};

useCartStore.subscribe((state, prevState) => {
  if (state.couponCode && state.items !== prevState.items) scheduleCouponRevalidation();
});

// A coupon restored from a previous visit may have expired or been edited, or
// was saved before the discount amount was stored — check it once on load.
if (useCartStore.getState().couponCode) scheduleCouponRevalidation();