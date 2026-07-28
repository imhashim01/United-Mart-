import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import ProductCard from "../ui/ProductCard";
import { getBestSellers } from "../../data/homeData";
import { staggerContainer, fadeUp, viewportOnce } from "../../animations/variants";

export default function BestSellers() {
  const bestSellers = getBestSellers();

  return (
    <section className="bg-orchard-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex items-end justify-between gap-4 mb-6"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-mango-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
              <TrendingUp size={14} />
              Trending Now
            </div>
            <h2 className="font-display text-2xl md:text-[32px] leading-tight text-white">
              Best Sellers This Week
            </h2>
            <p className="text-white/60 text-sm mt-1.5">
              What Sukkur is actually adding to cart, ranked live.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4"
        >
          {bestSellers.map((product) => (
            <motion.div key={product.id} variants={fadeUp}>
              <ProductCard product={product} rank={product.rank} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
