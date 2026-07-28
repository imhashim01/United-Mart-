import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import ImageZoom from "./ImageZoom";

export default function ProductGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const normalizedImages = images
    .map((image) => (typeof image === "string" ? image : image.imageUrl || image.url || image.thumbnailUrl))
    .filter(Boolean);

  if (normalizedImages.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-square">
        <AnimatePresence mode="wait">
          <motion.div
            key={normalizedImages[activeIndex] ?? activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <ImageZoom src={normalizedImages[activeIndex]} alt={`${productName} — image ${activeIndex + 1}`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={clsx(
                "relative shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-[var(--radius-md)] overflow-hidden border-2 transition-colors",
                activeIndex === i ? "border-orchard-900" : "border-transparent hover:border-border-strong"
              )}
            >
              <img src={typeof img === "string" ? img : img.imageUrl || img.url || img.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
