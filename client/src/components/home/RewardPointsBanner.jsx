import { motion } from "framer-motion";
import { Gift, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp, viewportOnce } from "../../animations/variants";

export default function RewardPointsBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-mango-500 to-[#D18F27] px-6 py-10 md:px-12 md:py-14"
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5 }}
              className="h-16 w-16 rounded-full bg-white/25 flex items-center justify-center shrink-0"
            >
              <Gift size={30} className="text-charcoal-900" />
            </motion.div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-charcoal-900/70 text-xs font-semibold uppercase tracking-wide mb-1">
                <Sparkles size={13} />
                United Rewards
              </div>
              <h3 className="font-display text-2xl md:text-3xl text-charcoal-900 mb-1.5">
                Earn points on every order
              </h3>
              <p className="text-charcoal-900/70 text-sm md:text-base max-w-md">
                Get 1 point for every Rs 100 spent — redeem for discounts on
                your next basket. No sign-up fees, ever.
              </p>
            </div>
          </div>

          <Link
            to="/rewards"
            className="inline-flex items-center gap-2 bg-charcoal-900 text-white font-semibold px-6 h-12 rounded-[var(--radius-md)] hover:bg-orchard-900 transition-colors shrink-0"
          >
            Join Rewards
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
