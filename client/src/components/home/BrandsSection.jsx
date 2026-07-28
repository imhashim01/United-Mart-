import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeader from "../ui/SectionHeader";
import { brands } from "../../data/homeData";
import { staggerContainer, fadeUp, viewportOnce } from "../../animations/variants";

export default function BrandsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <SectionHeader eyebrow="Trusted Brands" title="Shop by Brand" />

      <motion.div
        variants={staggerContainer(0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4"
      >
        {brands.map((brand) => (
          <Link key={brand.id} to={`/shop?brand=${encodeURIComponent(brand.name)}`}>
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="flex items-center justify-center h-20 md:h-24 bg-white rounded-[var(--radius-lg)] border border-border grayscale hover:grayscale-0 transition-all duration-300 p-4"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-8 max-w-[80%] object-contain"
                loading="lazy"
              />
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
