import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpDown, Check } from "lucide-react";
import clsx from "clsx";

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "discount-desc", label: "Biggest Discount" },
  { value: "newest", label: "Newest First" },
];

export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 h-10 px-3.5 rounded-[var(--radius-md)] border border-border-strong text-sm font-medium text-charcoal-900 bg-white hover:bg-linen-50 transition-colors"
      >
        <ArrowUpDown size={14} className="text-charcoal-600" />
        <span className="hidden sm:inline text-charcoal-600">Sort:</span>
        {current.label}
        <ChevronDown size={14} className={clsx("transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 z-20 w-56 bg-white rounded-[var(--radius-md)] border border-border shadow-[var(--shadow-md)] p-1.5"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] text-sm text-charcoal-900 hover:bg-linen-50 transition-colors"
              >
                {option.label}
                {value === option.value && <Check size={15} className="text-orchard-900" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
