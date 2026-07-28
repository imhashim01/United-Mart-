import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeader from "../ui/SectionHeader";
import { getCategories } from "../../data/homeData";
import { staggerContainer, fadeUp, viewportOnce } from "../../animations/variants";

export default function CategoriesSection() {
  const categories = getCategories();

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <SectionHeader
        eyebrow="Browse"
        title="Shop by Category"
        subtitle="Everything you need, organized the way you actually shop."
        viewAllHref="/shop"
      />

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4"
      >
        {categories.map((cat) => (
          <motion.div key={cat.id} variants={fadeUp}>
            <Link
              to={`/category/${cat.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-square rounded-[var(--radius-lg)] overflow-hidden bg-linen-50 border border-border mb-2.5">
                <motion.img
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-semibold text-charcoal-900 group-hover:text-orchard-700 transition-colors leading-tight">
                {cat.name}
              </p>
              <p className="text-xs text-charcoal-600 mt-0.5">{cat.itemCount} items</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
