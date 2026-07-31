import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { CheckCircle2, ChevronRight, ShoppingBasket } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CartItem from "../features/cart/components/CartItem";
import OrderSummary from "../features/cart/components/OrderSummary";
import CouponInput from "../features/checkout/components/CouponInput";
import RewardPointsRedeem from "../features/checkout/components/RewardPointsRedeem";
import AddressManager from "../features/checkout/components/AddressManager";
import PaymentMethodSelector from "../features/checkout/components/PaymentMethodSelector";
import DeliveryEstimate from "../features/checkout/components/DeliveryEstimate";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../features/auth/hooks/useAuth";
import * as ordersApi from "../features/admin/orders/api/ordersApi";
import { formatPrice } from "../utils/formatCurrency";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const deliveryCharge = useCartStore((s) => s.deliveryCharge());
  const total = useCartStore((s) => s.total());
  const clearCart = useCartStore((s) => s.clearCart);
  const couponCode = useCartStore((s) => s.couponCode);
  const user = useAuthStore((s) => s.user);
  const rewardPointsToRedeem = useCartStore((s) => s.rewardPointsToRedeem);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({ mode: "onBlur" });
  const { handleSubmit, setError, clearErrors } = methods;

  if (items.length === 0 && !orderPlaced) {
    return <Navigate to="/shop" replace />;
  }

  const onSubmit = async () => {
    if (!selectedAddressId || !selectedAddress) {
      setError("address", {
        type: "manual",
        message: "Please select or add a delivery address to complete checkout.",
      });
      return;
    }

    clearErrors("address");
    setSubmitting(true);

    try {
      const payload = {
        items: items.map((item) => ({
    productId: item.productId,
    ...(item.variantId ? { variantId: item.variantId } : {}),
    ...(rewardPointsToRedeem > 0 ? { pointsToRedeem: rewardPointsToRedeem } : {}),
    quantity: item.qty,
  })),
        shippingAddress: {
          label: selectedAddress.label || "home",
          line1: selectedAddress.line1 || "",
          line2: selectedAddress.line2 || "",
          city: selectedAddress.city || "Sukkur",
          state: selectedAddress.area || "",
          postalCode: selectedAddress.postalCode || "",
          country: selectedAddress.country || "Pakistan",
          phone: selectedAddress.phone || user?.phone || "",
        },
        billingAddress: {
          label: selectedAddress.label || "home",
          line1: selectedAddress.line1 || "",
          line2: selectedAddress.line2 || "",
          city: selectedAddress.city || "Sukkur",
          state: selectedAddress.area || "",
          postalCode: selectedAddress.postalCode || "",
          country: selectedAddress.country || "Pakistan",
          phone: selectedAddress.phone || user?.phone || "",
        },
        paymentMethod,
        ...(couponCode ? { couponCode } : {}),
        ...(orderNotes ? { customerNote: orderNotes } : {}),
      };

      const { data } = await ordersApi.createOrder(payload);
      const createdOrder = data.data;
      const newOrderId = createdOrder?.id || createdOrder?.orderNumber || createdOrder?._id || `UMS-${Math.floor(100000 + Math.random() * 900000)}`;

      setOrderId(newOrderId);
      setOrderPlaced(true);
      clearCart();
      toast.success("Order placed successfully");
    } catch (error) {
      console.error("Failed to place order:", error?.response || error.message);
      toast.error(error?.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-linen-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white border border-border rounded-[var(--radius-lg)] p-8 text-center"
          >
            <div className="h-16 w-16 mx-auto rounded-full bg-success-100 flex items-center justify-center mb-5">
              <CheckCircle2 size={30} className="text-success-600" />
            </div>
            <h1 className="font-display text-2xl text-orchard-900 mb-2">Order Confirmed!</h1>
            <p className="text-sm text-charcoal-600 mb-1">
              Order <span className="font-semibold text-charcoal-900">{orderId}</span> has been placed.
            </p>
            <p className="text-sm text-charcoal-600 mb-6">
              You&apos;ll receive updates via SMS as your order is prepared and delivered.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/"
                className="h-11 flex items-center justify-center rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold hover:bg-orchard-700 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/orders"
                className="h-11 flex items-center justify-center rounded-[var(--radius-md)] border border-border-strong text-sm font-semibold text-charcoal-900 hover:bg-linen-50 transition-colors"
              >
                Track Order
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-charcoal-600 mb-6">
          <Link to="/" className="hover:text-orchard-700 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-orchard-700 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-charcoal-900 font-medium">Checkout</span>
        </nav>

        <h1 className="font-display text-2xl md:text-3xl text-orchard-900 mb-6">Checkout</h1>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Left: address + payment */}
            <div className="flex flex-col gap-5">
              <AddressManager selectedId={selectedAddressId} onSelect={setSelectedAddressId} onAddressChange={setSelectedAddress} />
              <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
              <div className="border border-border rounded-[var(--radius-md)] p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-charcoal-900">Order Notes</p>
                  <span className="text-xs text-charcoal-600">Optional</span>
                </div>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Please call before delivery. Leave at the gate. Don't ring the bell."
                  className="w-full min-h-[120px] resize-none rounded-[var(--radius-sm)] border border-border-strong bg-linen-50 px-3 py-3 text-sm text-charcoal-900 focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10"
                />
              </div>
              <CouponInput />
              <RewardPointsRedeem />
            </div>

            {/* Right: cart items + summary + place order */}
            <div className="flex flex-col gap-5">
              <div className="border border-border rounded-[var(--radius-md)] p-4">
                <p className="text-sm font-semibold text-charcoal-900 mb-1 flex items-center gap-1.5">
                  <ShoppingBasket size={15} />
                  Order Items ({items.length})
                </p>
                <div className="max-h-72 overflow-y-auto">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} compact />
                  ))}
                </div>
              </div>

              <DeliveryEstimate />
              <OrderSummary paymentMethod={paymentMethod} />

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-[var(--radius-md)] bg-orchard-900 text-white font-semibold hover:bg-orchard-700 transition-colors disabled:opacity-60"
              >
                {submitting ? "Placing Order..." : `Place Order — ${formatPrice(total)}`}
              </button>
              <p className="text-xs text-charcoal-600 text-center">
                By placing this order you agree to our{" "}
                <Link to="/terms" className="underline hover:text-orchard-700">Terms of Service</Link>.
              </p>
            </div>
          </form>
        </FormProvider>
      </main>

      <Footer />
    </div>
  );
}
