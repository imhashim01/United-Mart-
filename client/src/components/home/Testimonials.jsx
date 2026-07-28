import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import { testimonials } from "../../data/homeData";
import { staggerContainer, fadeUp, viewportOnce } from "../../animations/variants";

export default function Testimonials() {
  return (
    <section className="bg-linen-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <SectionHeader
          eyebrow="Community"
          title="What Sukkur is Saying"
          subtitle="Real feedback from verified United Mart customers."
        />

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={fadeUp}
              className="relative flex flex-col bg-white border border-border rounded-[var(--radius-lg)] p-6"
            >
              <Quote size={28} className="text-mango-100 mb-2" fill="currentColor" />
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? "fill-mango-500 text-mango-500" : "text-border-strong"}
                  />
                ))}
              </div>
              <p className="text-sm text-charcoal-900 leading-relaxed mb-5 flex-1">
                “{t.quote}”
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-charcoal-900">{t.name}</p>
                  <p className="text-xs text-charcoal-600">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
