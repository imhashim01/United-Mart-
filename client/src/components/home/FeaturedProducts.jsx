import SectionHeader from "../ui/SectionHeader";
import ProductCard from "../ui/ProductCard";
import { getFeaturedProducts } from "../../data/homeData";

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  if (featuredProducts.length === 0) return null;

  // Slower than the brand-logo marquee — product cards carry more to read
  // (name, price, rating) so each one needs more time on screen.
  const duration = Math.max(20, featuredProducts.length * 6);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <SectionHeader
        eyebrow="Handpicked"
        title="Featured Products"
        subtitle="Our team's picks — quality-checked before they're listed."
        viewAllHref="/shop?filter=featured"
      />

      <div
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <div
          className="flex w-max gap-3 md:gap-4 animate-featured-marquee"
          style={{ animationDuration: `${duration}s` }}
        >
          {[...featuredProducts, ...featuredProducts].map((product, i) => (
            <div key={`${product.id}-${i}`} className="shrink-0 w-44 sm:w-52 md:w-60">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes featured-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-featured-marquee {
          animation-name: featured-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-featured-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}