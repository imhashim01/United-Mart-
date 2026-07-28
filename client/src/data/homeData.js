// Mock data for homepage development.
// Categories, Featured Products, and Brands are now derived live from the
// same persisted data the admin panel edits (products, categoriesList,
// adminBrands) — so admin changes actually show up here after a reload.

import { getProducts, categoryObjects } from "./productsData";
import { adminBrands } from "./adminData";

const findProduct = (id) => getProducts().find((product) => product.id === id) ?? null;

// Static image/slug lookup for known category names — falls back to a
// generic image + auto-generated slug for any new category an admin adds.
const FALLBACK_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

export const getCategories = () =>
  categoryObjects.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    image: category.image ?? FALLBACK_CATEGORY_IMAGE,
    itemCount: getProducts().filter((p) => p.category === category.name).length,
  }));

export const getTodaysDeals = () =>
  // Prefer admin-marked today's deals; fallback to a few seeded picks
  (getProducts().filter((p) => p.isTodaysDeal) .length > 0
    ? getProducts().filter((p) => p.isTodaysDeal)
    : [
        findProduct("prod-15"),
        findProduct("prod-8"),
        findProduct("prod-9"),
        findProduct("prod-12"),
        findProduct("prod-16"),
        findProduct("prod-14"),
      ].filter(Boolean))
    .map((product) => ({ ...product, endsIn: "6h 20m" }));

export const todaysDeals = getTodaysDeals();

// Live: featured products show badge items first, then newest added items if there are fewer than eight badge products.
export const getFeaturedProducts = () =>
  // Admin-marked featured items first, then fallback to badge/newest
  [
    ...getProducts().filter((p) => p.isFeatured),
    ...getProducts().filter((p) => p.badge && !p.isFeatured),
    ...getProducts().filter((p) => !p.badge && !p.isFeatured),
  ].slice(0, 8);

// Live: top 5 products by rating — self-heals if a hardcoded pick gets deleted
export const getBestSellers = () =>
  // Admin-marked best sellers take precedence, otherwise derive from rating
  (getProducts().filter((p) => p.isBestSeller).length
    ? getProducts().filter((p) => p.isBestSeller)
    : [...getProducts()].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 5))
    .slice(0, 5)
    .map((product, i) => ({ ...product, rank: i + 1 }));

// Live: active brands from the admin-managed brand list
export const brands = adminBrands
  .filter((b) => b.status === "Active")
  .slice(0, 6)
  .map((b) => ({ id: b.id, name: b.name, logo: b.logo }));

export const testimonials = [
  { id: "t-1", name: "Ayesha Raza", role: "Verified Buyer, Sukkur", quote: "The mangoes arrived riper and fresher than what I get at the local market — and same-day delivery actually meant same day.", rating: 5, avatar: "https://i.pravatar.cc/100?img=47" },
  { id: "t-2", name: "Bilal Ahmed", role: "Verified Buyer, Sukkur", quote: "Ordering groceries used to eat up my whole Saturday. United Mart cut it down to ten minutes on my phone.", rating: 5, avatar: "https://i.pravatar.cc/100?img=12" },
  { id: "t-3", name: "Sana Khan", role: "Verified Buyer, Rohri", quote: "Packaging is careful, prices are fair, and their reward points actually add up to real savings every month.", rating: 4, avatar: "https://i.pravatar.cc/100?img=32" },
  { id: "t-4", name: "Farhan Malik", role: "Verified Buyer, Sukkur", quote: "Customer support resolved a delivery mix-up within minutes. That kind of responsiveness is rare for grocery apps here.", rating: 5, avatar: "https://i.pravatar.cc/100?img=51" },
];

export const deliveryInfo = [
  { id: "di-1", icon: "Truck", title: "Same-Day Delivery", description: "Order before 4 PM and get your groceries delivered the same evening, across Sukkur and Rohri." },
  { id: "di-2", icon: "ShieldCheck", title: "Freshness Guarantee", description: "Not happy with the quality? We replace or refund it — no questions asked, within 24 hours." },
  { id: "di-3", icon: "Wallet", title: "Cash or Card", description: "Pay with cash on delivery, card, or your United Mart wallet — whichever is easiest for you." },
  { id: "di-4", icon: "Headphones", title: "Real Human Support", description: "Our support team is on call 8 AM – 11 PM daily, no chatbots pretending to understand your order." },
];