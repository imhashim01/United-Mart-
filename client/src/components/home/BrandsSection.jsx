import { Link } from "react-router-dom";
import SectionHeader from "../ui/SectionHeader";
import { getBrands } from "../../data/homeData";

export default function BrandsSection() {
  const brands = getBrands();

  if (brands.length === 0) return null;

  // Speed scales with how many brands there are, so each logo gets roughly
  // the same amount of time on screen whether there are 6 brands or 60.
  const duration = Math.max(15, brands.length * 4);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <SectionHeader eyebrow="Trusted Brands" title="Shop by Brand" />

      <div
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className="flex w-max gap-3 md:gap-4 animate-brand-marquee"
          style={{ animationDuration: `${duration}s` }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <Link
              key={`${brand.id}-${i}`}
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="shrink-0 w-32 md:w-40"
            >
              <div className="flex items-center justify-center h-20 md:h-24 bg-white rounded-[var(--radius-lg)] border border-border hover:border-orchard-700 hover:-translate-y-0.5 transition-all duration-300 p-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-8 max-w-[80%] object-contain"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes brand-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-brand-marquee {
          animation-name: brand-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-brand-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}