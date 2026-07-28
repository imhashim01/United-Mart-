import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBasket, Truck, ShieldCheck, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Badge from "../components/ui/Badge";
import Rating from "../components/ui/Rating";
import WishlistButton from "../components/ui/WishlistButton";
import QuantitySelector from "../components/ui/QuantitySelector";
import ProductGallery from "../features/products/components/ProductGallery";
import ShareButtons from "../features/products/components/ShareButtons";
import RelatedProducts from "../features/products/components/RelatedProducts";
import ProductReviews from "../features/reviews/components/ProductReviews";
import { getProductById, getRelatedProducts, slugify } from "../data/productsData";
import { formatPrice } from "../utils/formatCurrency";
import { useCartStore } from "../store/cartStore";
import { fadeUp } from "../animations/variants";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = useMemo(() => getProductById(id), [id]);
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQty = useCartStore((s) => s.updateQty);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariantId(product.variants[0].id);
    } else {
      setSelectedVariantId(null);
    }
  }, [id]);

  useEffect(() => {
    if (!product?.variants?.length) {
      setSelectedVariantId(null);
      return;
    }

    const defaultVariant = product.variants.find((variant) => variant.isDefault) ?? product.variants[0];
    const currentVariantExists = product.variants.some((variant) => variant.id === selectedVariantId);
    if (!currentVariantExists) {
      setSelectedVariantId(defaultVariant.id);
    }
  }, [product, selectedVariantId]);

  if (!product) return <Navigate to="/" replace />;

  const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId) ?? null;
  const galleryImages = useMemo(() => {
    const images = selectedVariant?.images?.length ? selectedVariant.images : product.images;
    return Array.isArray(images)
      ? images
          .map((img) => (typeof img === "string" ? img : img.imageUrl || img.url || img.thumbnailUrl))
          .filter(Boolean)
      : [];
  }, [product.images, selectedVariant]);
  const displayPrice = selectedVariant
    ? selectedVariant.discountPrice != null
      ? selectedVariant.discountPrice
      : selectedVariant.price
    : product.discountPrice != null
    ? product.discountPrice
    : product.price;
  const displayUnit = selectedVariant?.unit ?? product.unit;
  const stockCount = selectedVariant?.stock ?? product.stockCount;
  const outOfStock = stockCount <= 0;
  const cartItem = items.find((i) => i.id === (selectedVariant ? `${product.id}:${selectedVariant.id}` : product.id));
  const related = getRelatedProducts(product);

  const handleAddToCart = () => {
    addItem(product, qty, selectedVariant?.id);
    toast.success(`${qty} × ${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-charcoal-600 mb-6 flex-wrap">
          <Link to="/" className="hover:text-orchard-700 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/category/${product.categorySlug ?? slugify(product.category)}`} className="hover:text-orchard-700 transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-charcoal-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <ProductGallery images={galleryImages} productName={product.name} />
          </motion.div>

          {/* Info panel */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-600 mb-2">
              {product.brand} · {product.category}
            </p>
            <h1 className="font-display text-3xl md:text-[34px] leading-tight text-orchard-900 mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <Rating value={product.rating} reviews={product.reviewCount} size={16} />
              {product.badge && <Badge variant="accent">{product.badge}</Badge>}
              {outOfStock ? (
                <Badge variant="danger">Out of Stock</Badge>
              ) : stockCount <= 10 ? (
                <Badge variant="warning">Only {stockCount} left</Badge>
              ) : (
                <Badge variant="success">In Stock</Badge>
              )}
            </div>

            {product.variants?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-600 mb-3">
                  Select variant
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === selectedVariantId;
                    const variantPrice = variant.discountPrice != null ? variant.discountPrice : variant.price;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`rounded-[var(--radius-md)] border px-3 py-3 text-left transition-colors ${
                          isSelected ? 'border-orchard-900 bg-orchard-50 shadow-sm' : 'border-border bg-white hover:border-orchard-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-charcoal-900">
                            {variant.name || variant.sku}
                          </span>
                          <span className="text-sm text-charcoal-600">{formatPrice(variantPrice)}</span>
                        </div>
                        <p className="text-xs text-charcoal-500 mt-1">
                          {variant.unit} · {variant.stock} available
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-bold text-charcoal-900 tabular-nums">
                {formatPrice(displayPrice)}
              </span>
              {selectedVariant ? (
                selectedVariant.discountPrice != null && selectedVariant.price > selectedVariant.discountPrice ? (
                  <span className="text-lg text-charcoal-300 line-through tabular-nums">
                    {formatPrice(selectedVariant.price)}
                  </span>
                ) : null
              ) : (
                product.originalPrice && (
                  <span className="text-lg text-charcoal-300 line-through tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )
              )}
            </div>
            <p className="text-sm text-charcoal-600 mb-6">{displayUnit}</p>

            <p className="text-sm text-charcoal-900 leading-relaxed mb-6 max-w-lg">
              {product.description}
            </p>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 mb-4">
              {cartItem ? (
                <QuantitySelector
                  value={cartItem.qty}
                  onChange={(next) => updateQty(cartItem.id, next)}
                  max={stockCount ?? 99}
                  size="lg"
                  variant="outline"
                />
              ) : (
                <QuantitySelector
                  value={qty}
                  onChange={setQty}
                  max={stockCount ?? 99}
                  size="lg"
                  variant="outline"
                />
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="flex-1 h-12 flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-orchard-900 text-white font-semibold hover:bg-orchard-700 transition-colors disabled:bg-charcoal-300 disabled:cursor-not-allowed"
              >
                <ShoppingBasket size={18} />
                {outOfStock ? "Out of Stock" : cartItem ? "Update Cart" : "Add to Cart"}
              </button>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <WishlistButton
                productId={product.id}
                productName={product.name}
                size={18}
                className="h-11 w-11 border border-border-strong bg-white"
              />
              <ShareButtons productName={product.name} />
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border">
              <div className="flex items-center gap-2.5 text-sm text-charcoal-600">
                <Truck size={18} className="text-orchard-700 shrink-0" />
                Same-day delivery before 4 PM
              </div>
              <div className="flex items-center gap-2.5 text-sm text-charcoal-600">
                <ShieldCheck size={18} className="text-orchard-700 shrink-0" />
                Freshness guaranteed
              </div>
            </div>
          </motion.div>
        </div>

        <ProductReviews product={product} />
        <RelatedProducts products={related} />
      </main>

      <Footer />
    </div>
  );
}
