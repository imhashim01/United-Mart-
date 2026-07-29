import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBasket, User, MapPin, Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useMemo } from "react";
import SearchBar from "../../features/search/components/SearchBar";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuthStore } from "../../features/auth/hooks/useAuth";
import RoleBadge from "../auth/RoleBadge";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Deals", href: "/shop?filter=deals" },
  { label: "Categories", href: "/shop" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const navigate = useNavigate();
  const { user, token, clearAuth } = useAuthStore();
  const displayName = useMemo(() => user?.name || user?.email || "Account", [user]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      {/* Top strip */}
      <div className="hidden md:flex items-center justify-center gap-2 bg-orchard-900 text-white text-xs py-1.5 px-4">
        <MapPin size={13} />
        <span>Delivering fresh to Sukkur &amp; Rohri — same-day before 4 PM</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={logo} alt="United Mart Sukkur" className="h-10 w-10 md:h-11 md:w-11" />
            <div className="hidden sm:block leading-tight">
              <p className="font-display text-lg font-semibold text-orchard-900">United Mart</p>
              <p className="text-[11px] tracking-wide text-charcoal-600 -mt-0.5">SUKKUR</p>
            </div>
          </Link>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <SearchBar variant="desktop" />
          </div>

          {/* Nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-6 shrink-0">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-charcoal-900 hover:text-orchard-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-linen-50 transition-colors"
            >
              <Heart size={20} className="text-charcoal-900" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full bg-mango-500 text-charcoal-900 text-[10px] font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {token && user ? (
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-linen-50 px-2.5 py-1.5">
                <RoleBadge role={user.role} />
                <span className="text-sm font-medium text-charcoal-900">{displayName}</span>
                <button onClick={() => { clearAuth(); navigate('/'); }} aria-label="Logout" className="rounded-full p-1 hover:bg-white">
                  <LogOut size={16} className="text-charcoal-700" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  aria-label="Account"
                  className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-linen-50 transition-colors"
                >
                  <User size={20} className="text-charcoal-900" />
                </Link>
                <Link
                  to="/login"
                  aria-label="Account"
                  className="flex sm:hidden h-10 w-10 items-center justify-center rounded-full hover:bg-linen-50 transition-colors"
                >
                  <User size={20} className="text-charcoal-900" />
                </Link>
              </>
            )}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-linen-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <ShoppingBasket size={20} className="text-charcoal-900" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.35 }}
                  className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full bg-mango-500 text-charcoal-900 text-[10px] font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full hover:bg-linen-50 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <SearchBar variant="mobile" />
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="lg:hidden border-t border-border bg-white overflow-hidden"
        >
          <div className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-charcoal-900 border-b border-border last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.nav>
      )}

    </header>
  );
}
