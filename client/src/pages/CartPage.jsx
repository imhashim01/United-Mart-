import { Link, useNavigate } from "react-router-dom";
import { ShoppingBasket, ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CartItem from "../features/cart/components/CartItem";
import OrderSummary from "../features/cart/components/OrderSummary";
import DeliveryEstimate from "../features/checkout/components/DeliveryEstimate";
import CouponInput from "../features/checkout/components/CouponInput";
import RewardPointsRedeem from "../features/checkout/components/RewardPointsRedeem";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../features/auth/hooks/useAuth";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  // Checkout itself is public (guests can complete it), but the normal
  // cart-to-checkout flow still offers login first — matching how it
  // worked before guest checkout existed. Signing in returns here via
  // AuthForm reading this same location.state.from.
  const handleCheckoutClick = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orchard-700">Your Cart</p>
            <h1 className="font-display text-2xl md:text-3xl text-orchard-900">Cart</h1>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-orchard-700 hover:text-orchard-900">
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linen-50">
              <ShoppingBasket size={28} className="text-charcoal-300" />
            </div>
            <h2 className="text-xl font-semibold text-charcoal-900">Your cart is empty</h2>
            <p className="mt-2 text-sm text-charcoal-600">Add fresh groceries to get started.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-orchard-900 px-5 text-sm font-semibold text-white hover:bg-orchard-700"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} compact={false} />
              ))}
            </div>

            <div className="space-y-4">
              <DeliveryEstimate />
              <CouponInput />
              <RewardPointsRedeem />
              <OrderSummary />
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-orchard-900 text-sm font-semibold text-white hover:bg-orchard-700"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
