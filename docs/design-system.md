# United Mart Sukkur — Design System

**Direction:** Premium grocery retail. The feel sits between Whole Foods' natural warmth, Amazon Fresh's density and clarity, Carrefour's structured merchandising, and Apple's restraint in spacing and motion.

**Signature idea:** Sukkur sits in Sindh — mango country. Instead of the generic "clay/terracotta on cream" look, the palette is anchored in a **deep orchard green + ripe mango gold** pairing: green reads as fresh/trustworthy/grocery, gold reads as premium and is a genuine regional cue (Sindhri mangoes), not a decorative accent picked at random. This pairing is the thing that makes the storefront recognizably *this* store and not a generic template.

---

## 1. Color Palette

### Core palette (6 named tokens)

| Token | Hex | Role |
|---|---|---|
| `--color-orchard-900` | `#173A2E` | Primary brand color — header, nav, primary buttons, footer |
| `--color-orchard-700` | `#255745` | Hover/active states of primary, secondary text on light |
| `--color-mango-500` | `#E8A33D` | Signature accent — CTAs, price highlights, badges, active nav underline |
| `--color-mango-100` | `#FBEBD2` | Soft accent backgrounds (promo banners, highlight chips) |
| `--color-linen-50` | `#F7F5EF` | App background (warm off-white, not the AI-default cream) |
| `--color-charcoal-900` | `#1E211F` | Primary text |

### Extended functional colors

| Token | Hex | Role |
|---|---|---|
| `--color-white` | `#FFFFFF` | Cards, surfaces, input backgrounds |
| `--color-charcoal-600` | `#5A5F5B` | Secondary/muted text |
| `--color-charcoal-300` | `#A8ACA8` | Placeholder text, disabled text |
| `--color-border` | `#E4E1D8` | Default border, dividers |
| `--color-border-strong` | `#CFCBBD` | Input borders, table borders |
| `--color-success-600` | `#2F8556` | In-stock, order confirmed, success toast |
| `--color-success-100` | `#E3F3E9` | Success badge background |
| `--color-warning-600` | `#C97A1E` | Low stock, pending status |
| `--color-warning-100` | `#FBEDDA` | Warning badge background |
| `--color-danger-600` | `#C4392C` | Out of stock, errors, delete actions |
| `--color-danger-100` | `#FBE4E1` | Error badge background, form field error bg |
| `--color-info-600` | `#2A6FA8` | Informational states, tracking updates |
| `--color-info-100` | `#E3EEF7` | Info badge background |

### Usage rules
- **Orchard green** is the "voice of authority" — never used for destructive actions.
- **Mango gold** is reserved for moments that should draw the eye: sale price, "Add to Cart," featured badges, star ratings. If everything is gold, nothing is — cap it to one gold element per card/component.
- Dark mode is **not** designed for the storefront (grocery browsing benefits from bright, appetizing imagery); the **admin dashboard** may later get an optional dark surface using `--color-charcoal-900` as base — flag if you want that designed separately.

---

## 2. Typography

Two-face pairing: a display serif with real character for headlines/branding (premium, editorial, evokes Whole Foods/Apple-style confidence), paired with a clean grotesk for UI and body so the interface itself stays fast and legible.

| Role | Typeface | Fallback stack |
|---|---|---|
| Display / Headlines | **Fraunces** (variable, use optical size + soft weight) | `"Fraunces", Georgia, serif` |
| UI / Body | **Inter** | `"Inter", -apple-system, "Segoe UI", sans-serif` |
| Numerals / Data / Prices | **Inter** with `font-variant-numeric: tabular-nums` | same as body |

Fraunces is used **only** for: hero headlines, section titles ("Fresh This Week," "Fruits & Vegetables"), and the logotype. Never for buttons, labels, or body copy — that keeps it feeling intentional, not decorative.

### Type scale

| Token | Size / Line-height | Weight | Face | Usage |
|---|---|---|---|---|
| `--text-display-xl` | 56px / 60px | 500 | Fraunces | Homepage hero |
| `--text-display-lg` | 40px / 46px | 500 | Fraunces | Section headers |
| `--text-display-md` | 28px / 34px | 500 | Fraunces | Page titles (Shop, Checkout) |
| `--text-heading-lg` | 22px / 28px | 600 | Inter | Card group headers, modal titles |
| `--text-heading-md` | 18px / 24px | 600 | Inter | Product card title, admin section titles |
| `--text-body-lg` | 16px / 24px | 400 | Inter | Primary body text |
| `--text-body-md` | 14px / 20px | 400 | Inter | Secondary text, form labels |
| `--text-body-sm` | 13px / 18px | 400 | Inter | Meta text, timestamps |
| `--text-caption` | 12px / 16px | 500 | Inter | Badges, table headers (uppercase, +0.04em tracking) |
| `--text-price-lg` | 24px / 28px | 700 | Inter | Product detail price |
| `--text-price-md` | 16px / 20px | 700 | Inter | Product card price |

**Rule:** table headers, badges, and nav labels use `--text-caption` in **uppercase with letter-spacing 0.04em** — this is the one place letterspacing is allowed; body text never uses it.

---

## 3. Spacing System

8px base unit, with a 4px half-step for tight UI (badges, icon gaps).

| Token | Value |
|---|---|
| `--space-0-5` | 4px |
| `--space-1` | 8px |
| `--space-2` | 16px |
| `--space-3` | 24px |
| `--space-4` | 32px |
| `--space-5` | 40px |
| `--space-6` | 48px |
| `--space-8` | 64px |
| `--space-10` | 80px |
| `--space-12` | 96px |

**Layout rules:**
- Card internal padding: `--space-2` (mobile) → `--space-3` (desktop)
- Section vertical rhythm (storefront): `--space-8` between major sections, `--space-4` between a section header and its content
- Admin dashboard density is tighter: cards use `--space-2`, table rows use `--space-1` vertical padding — data density matters more than air in admin

---

## 4. Border Radius

Soft, produce-crate-friendly rounding — never fully sharp (feels cold/industrial), never pill-everything (feels like a mobile game).

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Inputs, badges, small buttons, table cells |
| `--radius-md` | 10px | Buttons (default), dropdowns, toast |
| `--radius-lg` | 16px | Cards, modals |
| `--radius-xl` | 24px | Hero panels, promo banners |
| `--radius-full` | 999px | Avatar, pill filters, quantity stepper |

---

## 5. Buttons

### Variants

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| Primary | `--color-orchard-900` | white | none | Add to Cart, Place Order, Save |
| Primary (accent) | `--color-mango-500` | `--color-charcoal-900` | none | Single hero CTA only (e.g. "Shop Fresh Deals") — max one per screen |
| Secondary | white | `--color-orchard-900` | 1px `--color-orchard-900` | Cancel, secondary actions |
| Ghost | transparent | `--color-orchard-900` | none | Tertiary actions, "View all," table row actions |
| Destructive | white | `--color-danger-600` | 1px `--color-danger-600` | Remove from cart, delete product (admin) |
| Destructive (filled) | `--color-danger-600` | white | none | Confirm-delete inside modal only |

### Sizing

| Size | Height | Padding-x | Text |
|---|---|---|---|
| `sm` | 32px | 12px | `--text-body-sm`, weight 600 |
| `md` (default) | 40px | 16px | `--text-body-md`, weight 600 |
| `lg` | 48px | 24px | `--text-body-lg`, weight 600 |

### States
- **Hover:** darken background 8% (primary) or fill ghost/secondary with `--color-linen-50`
- **Active/pressed:** darken 14%, scale `0.98` (120ms ease-out)
- **Disabled:** background `--color-charcoal-300`, text white, no hover/active response, cursor `not-allowed`
- **Loading:** replace label with a 16px spinner (see §12), button stays same width (reserve width to prevent layout shift), disabled interaction

### Icon buttons
- Square, `--radius-md`, 40x40 default (touch-target safe), transparent background with `--color-charcoal-600` icon, hover fills `--color-linen-50`

---

## 6. Cards

### Product Card (storefront)
- Container: white surface, `--radius-lg`, 1px `--color-border`, shadow `--shadow-xs` at rest
- Image area: 1:1 ratio, `--radius-md` on top corners only, `object-fit: cover`
- Content padding: `--space-2`
- Structure top→bottom: category eyebrow (`--text-caption`, `--color-charcoal-600`) → product name (`--text-heading-md`, 2-line clamp) → price row (`--text-price-md` + optional strikethrough original price in `--color-charcoal-300`) → Add-to-Cart button (full width, `sm` size) or quantity stepper if already in cart
- Hover: shadow raises to `--shadow-sm`, translateY(-2px), 150ms ease-out — image gets a subtle 1.03 scale inside its clipped container (400ms ease-out, feels alive without gimmick)
- Discount badge: top-left of image, `--color-mango-500` background, `--color-charcoal-900` text, `--radius-sm`, e.g. "-20%"
- Wishlist icon: top-right of image, circular white chip with subtle shadow, heart icon toggles fill on click

### Category Card
- Larger format, `--radius-lg`, image bleeds full-bleed with a gradient scrim (`linear-gradient(to top, rgba(23,58,46,0.55), transparent 60%)`) so white label text sits legibly at the bottom

### Admin Stat Card (dashboard)
- White surface, `--radius-lg`, `--shadow-xs`, padding `--space-3`
- Structure: label (`--text-body-sm`, muted) → big number (`--text-display-md`, Inter not Fraunces — admin stays utilitarian) → delta chip (green/red arrow + %, `--text-caption`)

### Order Card
- Left accent bar (4px) colored by status (success/warning/info/danger tokens) — gives instant scanability in a list without needing to read text

---

## 7. Inputs

- Height: 44px (default), `--radius-sm`, 1px `--color-border-strong`, white background
- Padding-x: 14px, text `--text-body-md`
- Placeholder: `--color-charcoal-300`
- **Focus:** border becomes `--color-orchard-700` (2px), plus a soft outer glow `0 0 0 3px rgba(23,58,46,0.12)` — no harsh default blue browser outline
- **Error:** border `--color-danger-600`, background tint `--color-danger-100` at 40% opacity, helper text below in `--color-danger-600` with a small alert icon
- **Success (e.g. validated coupon field):** border `--color-success-600`, small checkmark icon right-aligned inside field
- **Disabled:** background `--color-linen-50`, text `--color-charcoal-300`, border dashed
- Label: `--text-body-md`, weight 600, `--color-charcoal-900`, `--space-0-5` gap above input
- Helper/error text: `--text-body-sm`, `--space-0-5` gap below input

### Special inputs
- **Quantity stepper:** pill container (`--radius-full`), `−` / number / `+`, height 32px, used inline on product cards and cart rows
- **Search bar (header):** height 44px, `--radius-full`, left search icon, right clear icon on type, background `--color-linen-50` at rest → white on focus
- **Select/Dropdown:** same base as input, chevron icon right, opened menu is a white surface with `--radius-md`, `--shadow-md`, 4px offset

---

## 8. Forms

- Field groups stack vertically with `--space-3` gap between fields, `--space-2` between label and helper text pairs
- Related fields (First name / Last name, City / Postal code) sit in a 2-column grid on desktop (`--space-2` gutter), collapse to 1 column under 640px
- Section dividers within long forms (e.g. Checkout: Delivery → Payment → Review) use a `--text-heading-md` heading + 1px `--color-border` rule below, `--space-4` above the section
- Required field indicator: none visible by default — instead mark **optional** fields explicitly with `(optional)` in `--color-charcoal-600` next to the label (reduces visual noise since most grocery form fields are required)
- Inline validation fires on blur, not on every keystroke — avoids the shaky, punishing feel of real-time-error forms
- Submit buttons in multi-step forms (Checkout) are always full-width on mobile, right-aligned fixed-width on desktop, and **sticky to the bottom of the viewport** on the final review step so "Place Order" is always reachable

---

## 9. Badges

Small, pill or soft-rounded chips, `--text-caption` (uppercase, tracked), height 22–24px, padding 4px 10px.

| Type | Background | Text | Example |
|---|---|---|---|
| Success | `--color-success-100` | `--color-success-600` | "In Stock," "Delivered" |
| Warning | `--color-warning-100` | `--color-warning-600` | "Low Stock," "Pending" |
| Danger | `--color-danger-100` | `--color-danger-600` | "Out of Stock," "Cancelled" |
| Info | `--color-info-100` | `--color-info-600` | "Processing," "Out for Delivery" |
| Accent | `--color-mango-100` | `#8A5A12` (darkened mango for AA contrast) | "New," "Best Seller," "-20%" |
| Neutral | `--color-linen-50` | `--color-charcoal-600` | category tags, filter chips |

Radius: `--radius-full` for status badges (rounded = "state"), `--radius-sm` for filter/category chips (squared = "selectable object") — this distinction is intentional so users subconsciously read pills as read-only status and rounded-rects as things they can click/remove.

---

## 10. Tables (Admin)

- Header row: `--color-linen-50` background, `--text-caption` uppercase labels, `--color-charcoal-600`, sticky on scroll
- Row height: 56px default, 44px in "compact" density toggle (offer this in admin product/order tables — they get long)
- Row divider: 1px `--color-border` (no vertical column dividers — horizontal-only keeps it calm)
- Row hover: `--color-linen-50` background, cursor pointer if row is clickable
- Zebra striping: **not used** — relies on hover + dividers instead, reads as more premium/less spreadsheet-like
- Selected row (bulk actions): background `--color-mango-100` at 30% opacity, checkbox in first column
- Status column: always rendered as a badge (§9), never plain text
- Actions column: right-aligned, ghost icon buttons (edit pencil, delete trash), delete always requires confirm modal
- Empty state: centered illustration-style icon + `--text-heading-md` message + one action button, `--space-6` vertical padding
- Pagination: bottom-right, "Showing 1–20 of 214" text (`--text-body-sm`, muted) + prev/next + page number chips

---

## 11. Shadows

Warm, low-contrast shadows (never pure black) so the UI stays light rather than heavy — shadow color is tinted from `--color-charcoal-900`.

| Token | Value |
|---|---|
| `--shadow-xs` | `0 1px 2px rgba(30,33,31,0.06)` |
| `--shadow-sm` | `0 2px 8px rgba(30,33,31,0.08)` |
| `--shadow-md` | `0 8px 24px rgba(30,33,31,0.10)` |
| `--shadow-lg` | `0 16px 40px rgba(30,33,31,0.14)` |
| `--shadow-focus` | `0 0 0 3px rgba(23,58,46,0.12)` |

Usage: `xs` = resting cards, `sm` = hovered cards / dropdown menus, `md` = modals / popovers, `lg` = the cart drawer / large overlays.

---

## 12. Animations (Framer Motion direction)

Motion is used to reinforce **freshness and responsiveness**, not to decorate. One orchestrated moment (page load), everything else is short and functional.

| Interaction | Motion | Duration / Easing |
|---|---|---|
| Page load (storefront) | Header fades/slides down 8px → hero content fades up in a staggered sequence (headline, then subtext, then CTA, 60ms stagger) | 400ms `ease-out` |
| Route transitions | Cross-fade + 8px slide, outgoing page fades out first at 100ms before incoming starts | 250ms `ease-in-out` |
| Product card hover | Image scale 1.0 → 1.03, card lift -2px, shadow xs→sm | 200–400ms `ease-out` |
| Add to Cart click | Button micro-bounce (scale 0.96 → 1.02 → 1.0) + a small cart-icon badge count "pop" in the header (scale 0 → 1.2 → 1.0) | 350ms spring (stiffness 300, damping 20) |
| Cart drawer open | Slide in from right, backdrop fade | 300ms `ease-out` |
| Modal open | Scale 0.96 → 1.0 + fade, backdrop fade | 200ms `ease-out` |
| Toast notification | Slide up + fade from bottom-right, auto-dismiss progress bar drains | enter 250ms `ease-out`, exit 200ms `ease-in` |
| Accordion / filter expand | Height auto animation via `AnimatePresence` | 250ms `ease-in-out` |
| Number changes (cart total, stepper) | Digit roll/fade rather than instant jump cut | 200ms `ease-out` |
| Skeleton → content swap | Cross-fade, never a hard cut | 200ms `ease-out` |

**Rule:** `prefers-reduced-motion` disables all transform/scale motion site-wide, falling back to opacity-only fades. This is non-negotiable, not optional polish.

---

## 13. Loading Skeletons

Skeletons mirror the exact geometry of the content they replace (never a generic gray box) so layout doesn't shift on load.

- Base color: `--color-linen-50`
- Shimmer: a soft diagonal gradient sweep, `--color-border` at peak, 1.5s linear infinite loop, respects `prefers-reduced-motion` (falls back to static pulse: opacity 0.6 → 1.0 → 0.6, 1.8s ease-in-out)
- **Product card skeleton:** square image block (`--radius-md`) → two text bars (60% and 40% width) → button-shaped bar
- **Table row skeleton:** matches column widths of real rows, 6–8 rows shown while loading
- **Dashboard stat skeleton:** label bar (30% width) → large number bar (50% width) → small delta bar
- Minimum skeleton display time: 300ms even on fast responses, to avoid a jarring flash

---

## 14. Icons

- Library: **Lucide** (already installed) — consistent 1.5–2px stroke weight, rounded caps, matches the soft-but-confident brand feel better than a filled/solid icon set
- Default size: 20px (inline with body text), 16px (inside badges/small buttons), 24px (nav/header level)
- Stroke color inherits `currentColor` — never hardcoded, so icons always match their text/button context automatically
- Cart, wishlist, and search icons in the header get a **filled variant on active/hover** (Lucide's stroke icons paired with a manually filled SVG state) to give tactile feedback
- Category icons (Fruits, Dairy, Bakery, etc.) are the one place a custom, slightly rounded **duotone icon set** (orchard green line + mango gold fill accent) is worth commissioning later — flag this as a "phase 2" polish item, not required for MVP

---

## Summary Token Reference (for quick CSS variable setup later)

```
Colors:      6 core + 12 functional tokens
Typography:  Fraunces (display) + Inter (UI/body/data), 11-step type scale
Spacing:     8px base scale, 10 steps (4px–96px)
Radius:      5 steps (6px–999px)
Shadows:     5 steps, warm-tinted
Motion:      10 named interaction patterns, reduced-motion fallback required
```

This system is intentionally **not** the cream/terracotta or dark+neon-accent look — it's built from the actual subject (fresh grocery, Sindh region, premium retail) so it should read as distinctly *United Mart Sukkur* rather than a generic storefront template.

---

Next logical step: turn this into an actual `tailwind` theme config / CSS `@theme` block (matching the v4 setup from the previous step) so these tokens are wired into the codebase — say the word when you're ready and I'll generate that, still without building any pages.
