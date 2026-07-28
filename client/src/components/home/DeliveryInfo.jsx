import { motion } from "framer-motion";
import { Truck, ShieldCheck, Wallet, Headphones } from "lucide-react";
import { deliveryInfo } from "../../data/homeData";
import { staggerContainer, fadeUp, viewportOnce } from "../../animations/variants";

const ICONS = { Truck, ShieldCheck, Wallet, Headphones };

export default function DeliveryInfo() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
      >
        {deliveryInfo.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="flex flex-col items-start gap-3 bg-white border border-border rounded-[var(--radius-lg)] p-6"
            >
              <div className="h-12 w-12 rounded-[var(--radius-md)] bg-success-100 flex items-center justify-center">
                <Icon size={22} className="text-orchard-700" />
              </div>
              <h3 className="text-base font-semibold text-charcoal-900">{item.title}</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">{item.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
