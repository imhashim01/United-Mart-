import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ProductCard from "../ui/ProductCard";
import { getTodaysDeals } from "../../data/homeData";
import { staggerContainer, fadeUp, viewportOnce } from "../../animations/variants";

export default function TodaysDeals() {
    const todaysDeals = getTodaysDeals();
  return (
    <section className="bg-mango-100/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <SectionHeader
            eyebrow="Limited Time"
            title="Today's Deals"
            subtitle="Fresh discounts, refreshed every morning."
            viewAllHref="/deals"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.3 }}
            className="hidden sm:flex items-center gap-2 bg-orchard-900 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 shrink-0"
          >
            <Clock size={15} className="text-mango-500" />
            Ends in 06:20:14
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
        >
          {todaysDeals.map((deal) => (
            <motion.div key={deal.id} variants={fadeUp}>
              <ProductCard product={deal} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
