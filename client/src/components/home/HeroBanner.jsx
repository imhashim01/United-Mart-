import { motion } from "framer-motion";
import { ArrowRight, Truck, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { staggerContainer, fadeUp } from "../../animations/variants";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-orchard-900">
      {/* Decorative background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orchard-900 via-orchard-900/95 to-orchard-900/50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 text-mango-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Leaf size={14} />
            Fresh from Sindh&apos;s orchards, daily
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl md:text-[56px] leading-[1.05] text-white mb-5"
          >
            Groceries that feel
            <span className="text-mango-500"> hand-picked</span>, not warehouse-picked.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-white/75 text-base md:text-lg max-w-md mb-8">
            From Sindhri mangoes to daily dairy — order fresh, order local,
            delivered to your door across Sukkur &amp; Rohri.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-mango-500 text-charcoal-900 font-semibold px-6 h-12 rounded-[var(--radius-md)] hover:brightness-95 transition-all"
            >
              Shop Fresh Deals
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-white font-semibold px-6 h-12 rounded-[var(--radius-md)] border border-white/30 hover:bg-white/10 transition-colors"
            >
              Browse Categories
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-2 mt-8 text-white/70 text-sm">
            <Truck size={16} className="text-mango-500" />
            Order before 4 PM for same-day delivery
          </motion.div>
        </motion.div>

        {/* Floating product image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="hidden md:block relative"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] border-4 border-white/10"
          >
            <img
  src="https://res.cloudinary.com/osb9u3aw/image/upload/v1785751875/ChatGPT_Image_Aug_3_2026_03_09_48_PM_x0gl45.png"
  alt="Assorted grocery essentials — oils, spices, and pantry staples"
  className="w-full h-[420px] object-cover"
/>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="absolute -left-6 bottom-8 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] px-4 py-3 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-success-100 flex items-center justify-center">
              <Leaf size={18} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal-900">100% Fresh</p>
              <p className="text-xs text-charcoal-600">Sourced daily</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
