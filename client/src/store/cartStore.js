import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as couponsApi from "../features/checkout/api/couponsApi";
import { getSettings } from "../data/settingsData";

const REWARD_POINT_VALUE = 1; // 1 point = Rs 1 when redeemed
const POINTS_EARNED_PER_100 = 1; // 1 point per Rs 100 spent



export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { id, name, image, price, unit, qty, stock }
      couponCode: null,
      appliedCoupon: null, // { discountType, discountValue, maxDiscountAmount, minPurchaseAmount } — set only after the backend validates the code
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

      clearCart: () => set({ items: [], couponCode: null, appliedCoupon: null, rewardPointsToRedeem: 0 }),

      // Validates the code against the real backend (real coupons an admin
      // created, real min-spend/expiry/usage-limit rules) instead of a
      // hardcoded local table.
      applyCoupon: async (code) => {
        const trimmed = code.trim().toUpperCase();
        const subtotal = get().subtotal();
        try {
          const { data } = await couponsApi.validateCoupon({ code: trimmed, subtotal });
          const { coupon, discount } = data.data;
          set({
            couponCode: coupon.code,
            appliedCoupon: {
              discountType: coupon.discountType,
              discountValue: coupon.discountValue,
              maxDiscountAmount: coupon.maxDiscountAmount,
              minPurchaseAmount: coupon.minPurchaseAmount,
            },
          });
          return { success: true, message: `Coupon applied — you saved Rs ${discount.toLocaleString()}` };
        } catch (error) {
          return {
            success: false,
            message: error?.response?.data?.message || "Invalid coupon code.",
          };
        }
      },

      removeCoupon: () => set({ couponCode: null, appliedCoupon: null }),

      setRewardPointsAvailable: (points) => set({ rewardPointsAvailable: points }),

      setRewardPointsToRedeem: (points) => {
        const max = Math.min(get().rewardPointsAvailable, Math.floor(get().subtotal() * 0.5));
        set({ rewardPointsToRedeem: Math.max(0, Math.min(points, max)) });
      },

      // ---- Derived values ----
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      // Mirrors the backend's Coupon.calculateDiscount so the shown amount
      // stays correct if the cart changes after the coupon was applied —
      // the actual charge is still recalculated and re-validated server-side
      // at checkout, this is only for display.
      couponDiscount: () => {
        const coupon = get().appliedCoupon;
        const subtotal = get().subtotal();
        if (!coupon) return 0;
        if (subtotal < coupon.minPurchaseAmount) return 0;
        let discount = coupon.discountType === "percentage"
          ? (subtotal * coupon.discountValue) / 100
          : coupon.discountValue;
        if (coupon.maxDiscountAmount != null) discount = Math.min(discount, coupon.maxDiscountAmount);
        return Math.min(discount, subtotal);
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