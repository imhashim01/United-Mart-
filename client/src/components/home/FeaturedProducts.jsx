import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import ProductCard from "../ui/ProductCard";
import { getFeaturedProducts } from "../../data/homeData";
import { staggerContainer, fadeUp, viewportOnce } from "../../animations/variants";

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <SectionHeader
        eyebrow="Handpicked"
        title="Featured Products"
        subtitle="Our team's picks — quality-checked before they're listed."
        viewAllHref="/shop?filter=featured"
      />

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {featuredProducts.map((product) => (
          <motion.div key={product.id} variants={fadeUp}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
