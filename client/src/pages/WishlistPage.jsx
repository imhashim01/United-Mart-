import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductGrid from "../features/products/components/ProductGrid";
import { useWishlistStore } from "../store/wishlistStore";
import { getProducts } from "../data/productsData";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  window.scrollTo({ top: 0, behavior: "instant" });
  const wishlistedProducts = getProducts().filter((p) => ids.includes(p.id));

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <h1 className="font-display text-2xl md:text-3xl text-orchard-900 mb-1.5">Your Wishlist</h1>
        <p className="text-sm text-charcoal-600 mb-6">{wishlistedProducts.length} saved items</p>

        {wishlistedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border rounded-[var(--radius-lg)]">
            <div className="h-14 w-14 rounded-full bg-linen-50 flex items-center justify-center mb-4">
              <Heart size={24} className="text-charcoal-300" />
            </div>
            <h3 className="text-base font-semibold text-charcoal-900 mb-1">No items saved yet</h3>
            <p className="text-sm text-charcoal-600 mb-5">Tap the heart icon on any product to save it here.</p>
            <Link to="/shop" className="h-10 px-5 flex items-center rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold">
              Browse Products
            </Link>
          </div>
        ) : (
          <ProductGrid products={wishlistedProducts} columns={4} animate={false} />
        )}
      </main>
      <Footer />
    </div>
  );
}
