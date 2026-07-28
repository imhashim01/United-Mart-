import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import clsx from "clsx";
import { categoriesList, brandsList, priceRange } from "../../../data/productsData";
import { formatPrice } from "../../../utils/formatCurrency";

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-sm font-semibold text-charcoal-900"
      >
        {title}
        <ChevronDown size={16} className={clsx("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Checkbox({ checked, onChange, label, count }) {
  return (
    <label className="flex items-center justify-between gap-2 py-1.5 cursor-pointer group">
      <span className="flex items-center gap-2.5">
        <span
          className={clsx(
            "h-4 w-4 rounded flex items-center justify-center border transition-colors shrink-0",
            checked ? "bg-orchard-900 border-orchard-900" : "border-border-strong group-hover:border-charcoal-600"
          )}
        >
          {checked && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5L4 7.5L8.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-sm text-charcoal-900">{label}</span>
      </span>
      {count != null && <span className="text-xs text-charcoal-600 tabular-nums">{count}</span>}
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}

export default function FilterSidebar({ filters, onChange, productCounts }) {
  const toggleArrayValue = (key, value) => {
    const current = filters[key];
    onChange({
      ...filters,
      [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    });
  };

  const resetFilters = () => {
    onChange({
      categories: [],
      brands: [],
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      inStockOnly: false,
      discountedOnly: false,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.inStockOnly ||
    filters.discountedOnly ||
    filters.priceMin > priceRange.min ||
    filters.priceMax < priceRange.max;

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-charcoal-900">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-medium text-orchard-900 hover:text-mango-500 transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Category */}
      <FilterGroup title="Category">
        {categoriesList.map((cat) => (
          <Checkbox
            key={cat}
            label={cat}
            checked={filters.categories.includes(cat)}
            onChange={() => toggleArrayValue("categories", cat)}
            count={productCounts.byCategory[cat] ?? 0}
          />
        ))}
      </FilterGroup>

      {/* Brand */}
      <FilterGroup title="Brand">
        {brandsList.map((brand) => (
          <Checkbox
            key={brand}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={() => toggleArrayValue("brands", brand)}
            count={productCounts.byBrand[brand] ?? 0}
          />
        ))}
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Price Range">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <label className="text-xs text-charcoal-600 mb-1 block">Min</label>
            <input
              type="number"
              value={filters.priceMin}
              min={priceRange.min}
              max={filters.priceMax}
              onChange={(e) => onChange({ ...filters, priceMin: Number(e.target.value) })}
              className="w-full h-9 px-2.5 rounded-[var(--radius-sm)] border border-border-strong text-sm focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700"
            />
          </div>
          <span className="text-charcoal-300 mt-4">–</span>
          <div className="flex-1">
            <label className="text-xs text-charcoal-600 mb-1 block">Max</label>
            <input
              type="number"
              value={filters.priceMax}
              min={filters.priceMin}
              max={priceRange.max}
              onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
              className="w-full h-9 px-2.5 rounded-[var(--radius-sm)] border border-border-strong text-sm focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 focus:border-orchard-700"
            />
          </div>
        </div>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          value={filters.priceMax}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
          className="w-full accent-orchard-900"
        />
        <p className="text-xs text-charcoal-600 mt-1">
          {formatPrice(filters.priceMin)} – {formatPrice(filters.priceMax)}
        </p>
      </FilterGroup>

      {/* Availability */}
      <FilterGroup title="Availability">
        <Checkbox
          label="In Stock Only"
          checked={filters.inStockOnly}
          onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
        />
      </FilterGroup>

      {/* Discount */}
      <FilterGroup title="Discount" defaultOpen={false}>
        <Checkbox
          label="On Sale Only"
          checked={filters.discountedOnly}
          onChange={() => onChange({ ...filters, discountedOnly: !filters.discountedOnly })}
        />
      </FilterGroup>
    </aside>
  );
}
