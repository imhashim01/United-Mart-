# United Mart Sukkur

Production-grade Grocery Store E-commerce + Admin Management System.
MERN stack: React 19, Vite, Tailwind CSS v4, Express, MongoDB, JWT, Cloudinary.

## What's in this package

```
united-mart-sukkur/
├── client/                          # React 19 + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # ✅ BUILT — Button, Badge, Rating, ProductCard,
│   │   │   │                        #    ProductCardSkeleton, QuantitySelector,
│   │   │   │                        #    WishlistButton, SectionHeader
│   │   │   ├── layout/              # ✅ BUILT — Header (search + cart drawer wired), Footer
│   │   │   ├── home/                # ✅ BUILT — all 9 homepage sections
│   │   │   └── feedback/            # scaffold only
│   │   ├── features/
│   │   │   ├── products/            # ✅ BUILT — ProductGrid, ProductGallery, ImageZoom,
│   │   │   │                        #    ShareButtons, RelatedProducts
│   │   │   ├── reviews/             # ✅ BUILT — ProductReviews (breakdown + form)
│   │   │   ├── search/              # ✅ BUILT — SearchBar (live + autosuggest + history),
│   │   │   │                        #    FilterSidebar, SortDropdown, Pagination
│   │   │   ├── cart/                # ✅ BUILT — CartDrawer, CartItem, OrderSummary
│   │   │   ├── checkout/            # ✅ BUILT — AddressManager, PaymentMethodSelector,
│   │   │   │                        #    CouponInput, RewardPointsRedeem, DeliveryEstimate
│   │   │   ├── wishlist/            # scaffold only (page lives in pages/, uses wishlistStore)
│   │   │   └── auth, categories, orders, admin/*   # scaffold only
│   │   ├── pages/                   # ✅ BUILT — HomePage, ShopPage, ProductDetailsPage,
│   │   │                            #    CheckoutPage, WishlistPage
│   │   ├── store/                   # ✅ BUILT — cartStore, wishlistStore, searchStore
│   │   │                            #    (Zustand, persisted to localStorage)
│   │   ├── data/                    # ✅ BUILT — homeData.js, productsData.js (16 products,
│   │   │                            #    reviews, related products, full catalog)
│   │   ├── animations/              # ✅ BUILT — Framer Motion variants
│   │   ├── styles/                  # ✅ BUILT — Tailwind v4 design tokens
│   │   ├── utils/                   # ✅ BUILT — formatCurrency (price/date formatting)
│   │   ├── assets/images/           # ✅ your uploaded logo lives here
│   │   ├── layouts/, routes/, lib/, hooks/         # scaffold only
│   │   ├── App.jsx, main.jsx        # ✅ BUILT — router, query client, toast notifications
│   ├── package.json                 # ✅ all dependencies listed
│   ├── vite.config.js               # ✅ path aliases + dev proxy configured
│   ├── index.html
│   ├── jsconfig.json, .eslintrc.cjs, .prettierrc
│   └── .env.example
│
├── server/                          # Node.js + Express backend
│   ├── src/
│   │   ├── modules/                 # scaffold only (auth, users, products, categories,
│   │   │                            #   cart, orders, reviews, coupons, wishlist,
│   │   │                            #   inventory, admin, upload)
│   │   ├── config/, middlewares/, utils/, database/, routes/, jobs/, sockets/  # scaffold only
│   ├── tests/                       # scaffold only
│   ├── package.json                 # ✅ all dependencies listed
│   ├── nodemon.json
│   ├── .eslintrc.js, .prettierrc
│   └── .env.example
│
├── docs/
│   └── design-system.md             # ✅ full design system spec (colors, type, spacing,
│                                     #    components, motion, etc.)
├── docker-compose.yml                # optional local MongoDB
├── .gitignore
└── README.md
```

**"✅ BUILT"** = real, working code. Everything else is the folder architecture
from our planning phase — empty directories (marked with `.gitkeep`) waiting
for the next features to be built into them, so the project structure is
ready to receive code without any restructuring later.

## Quick start

```bash
# Backend
cd server
npm install
cp .env.example .env    # fill in real values (MongoDB URI, JWT secrets, Cloudinary keys)
npm run dev              # http://localhost:5000

# Frontend (separate terminal)
cd client
npm install
cp .env.example .env
npm run dev               # http://localhost:5173
```

The frontend is fully wired end-to-end on mock data — no backend connection
required to try it. Routes: `/` (home), `/shop` (search/filter/sort/paginate),
`/product/:id` (details, gallery, reviews), `/checkout`, `/wishlist`.

## What actually works right now

- **Add to Cart** from any product card persists across the site (Zustand +
  localStorage) — cart badge in the header updates live.
- **Search**: live autosuggest as you type in the header, search history,
  trending terms; submitting goes to `/shop?q=...` with real filtering.
- **Shop page**: category/brand/price/availability/discount filters, 6-way
  sort, real pagination — all client-side over the 16-product mock catalog.
- **Product Details**: image gallery with hover-zoom, wishlist toggle, share
  menu (WhatsApp/Facebook/Twitter/copy link), quantity selector, reviews with
  rating breakdown and a working review submission form, related products.
- **Checkout**: address form (add/select, validated), 4 payment methods (COD,
  JazzCash, EasyPaisa, Bank Transfer — wallet number validated for the mobile
  wallets), coupon codes (`FRESH10`, `SAVE200`, `MANGO24` are live in the mock
  store), reward points redemption, free-delivery progress bar, estimated
  delivery date, and an order confirmation screen.
- **Wishlist**: persists across sessions, has its own page.

## Build log (what we've done, in order)

1. **Architecture** — clean, feature-sliced folder structure for both client
   and server.
2. **Installation & config** — all dependencies installed, Vite/Tailwind/ESLint/
   Prettier configured, `.env.example` files for both sides. `multer`,
   `nodemailer`, and `react-router-dom` were bumped to patched versions after
   `npm audit` findings (see the note below).
3. **Design system** — full spec in `docs/design-system.md`.
4. **Homepage** — all 11 requested sections, Framer Motion throughout.
5. **Product module** — ProductCard, ProductGrid, ProductGallery + ImageZoom,
   ProductReviews, RelatedProducts, WishlistButton, ShareButtons,
   QuantitySelector, full ProductDetailsPage.
6. **Search module** — SearchBar (live/autosuggest/history), FilterSidebar
   (5 filter types), SortDropdown, Pagination, full ShopPage.
7. **Cart & Checkout module** — CartDrawer, CouponInput, RewardPointsRedeem,
   AddressManager, PaymentMethodSelector (4 methods), OrderSummary,
   DeliveryEstimate, full CheckoutPage with validation and confirmation.

## A note on `npm audit` in `client/`

`npm audit` will flag one **high severity** finding on `react-router`:
`GHSA-qwww-vcr4-c8h2` — "RSC Mode CSRF Bypass Allows Action Execution Before 400 Response."

This is a documented, accepted non-issue for this project: the vulnerability only
affects React Router's **RSC Mode** (React Server Components + server `action`
handlers via `@react-router/dev`). This app uses none of that — only plain
declarative routing (`BrowserRouter`, `Routes`, `Route`, `Link`). Fixing it
"for real" would mean jumping to React Router v8, which drops the
`react-router-dom` package and requires Vite 7+ — real churn for a code path
that doesn't exist here.

If this project later adopts RSC Mode or server actions, revisit this decision.

## Next steps (not yet built)

- Auth pages (Login/Register) + `auth` module wiring
- Backend implementation: Mongoose schemas, controllers, services for each module
  (frontend is currently running entirely on mock data in `data/`)
- Order tracking / order history page
- Admin dashboard pages
- Connect Cloudinary for real product image uploads
