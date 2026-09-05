import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ProductCard from "../ui/ProductCard";
import { getFeaturedProducts } from "../../data/homeData";

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();
  const scrollerRef = useRef(null);

  if (featuredProducts.length === 0) return null;

  const scrollByAmount = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth ?? 240;
    el.scrollBy({ left: direction * (cardWidth * 3 + 32), behavior: "smooth" });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 mb-2">
        <SectionHeader
          eyebrow="Handpicked"
          title="Featured Products"
          subtitle="Our team's picks — quality-checked before they're listed."
          viewAllHref="/shop?filter=featured"
        />
        <div className="hidden sm:flex items-center gap-2 shrink-0 pb-1">
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            aria-label="Scroll left"
            className="h-9 w-9 flex items-center justify-center rounded-full border border-border-strong hover:bg-linen-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            aria-label="Scroll right"
            className="h-9 w-9 flex items-center justify-center rounded-full border border-border-strong hover:bg-linen-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {featuredProducts.map((product) => (
          <div key={product.id} className="shrink-0 snap-start w-44 sm:w-52 md:w-60">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}