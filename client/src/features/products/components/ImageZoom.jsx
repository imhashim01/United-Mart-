import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";

export default function ImageZoom({ src, alt, zoomLevel = 2.2 }) {
  const [isZooming, setIsZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full overflow-hidden rounded-[var(--radius-lg)] bg-linen-50 cursor-zoom-in select-none"
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{
          scale: isZooming ? zoomLevel : 1,
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        draggable={false}
      />

      <AnimatePresence>
        {!isZooming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-[var(--shadow-xs)] pointer-events-none"
          >
            <ZoomIn size={16} className="text-charcoal-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
