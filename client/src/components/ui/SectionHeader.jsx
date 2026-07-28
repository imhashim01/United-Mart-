import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp, viewportOnce } from "../../animations/variants";

export default function SectionHeader({ eyebrow, title, subtitle, viewAllHref, viewAllLabel = "View All" }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="flex items-end justify-between gap-4 mb-6"
    >
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wide text-mango-500 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl md:text-[32px] leading-tight text-orchard-900">
          {title}
        </h2>
        {subtitle && <p className="text-charcoal-600 text-sm mt-1.5">{subtitle}</p>}
      </div>

      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-orchard-900 hover:text-mango-500 transition-colors group"
        >
          {viewAllLabel}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </motion.div>
  );
}
