import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, X, TrendingUp, ArrowUpRight } from "lucide-react";
import { getProducts } from "../../../data/productsData";
import { useSearchStore } from "../../../store/searchStore";
import { formatPrice } from "../../../utils/formatCurrency";

const TRENDING = ["Sindhri Mangoes", "Basmati Rice", "Fresh Eggs", "Olive Oil"];

export default function SearchBar({ variant = "desktop", onNavigate }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const history = useSearchStore((s) => s.history);
  const addToHistory = useSearchStore((s) => s.addToHistory);
  const removeFromHistory = useSearchStore((s) => s.removeFromHistory);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return getProducts()
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    addToHistory(trimmed);
    setOpen(false);
    onNavigate?.();
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const showDropdown = open && (suggestions.length > 0 || (!query.trim() && (history.length > 0 || true)));

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search for fresh produce, dairy, snacks..."
          className={`w-full ${variant === "desktop" ? "h-11" : "h-10"} pl-11 pr-9 rounded-full bg-linen-50 border border-transparent text-sm placeholder:text-charcoal-300 focus:bg-white focus:border-orchard-700 focus:outline-none focus:ring-[3px] focus:ring-orchard-900/10 transition-all`}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-600"
          >
            <X size={16} />
          </button>
        )}
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 z-30 bg-white rounded-[var(--radius-md)] border border-border shadow-[var(--shadow-md)] overflow-hidden max-h-[70vh] overflow-y-auto"
          >
            {/* Live suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-600 px-2 py-1.5">
                  Products
                </p>
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                      navigate(`/product/${p.id}`);
                    }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-[var(--radius-sm)] hover:bg-linen-50 transition-colors text-left"
                  >
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-[var(--radius-sm)] object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal-900 truncate">{p.name}</p>
                      <p className="text-xs text-charcoal-600">{p.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-charcoal-900 tabular-nums shrink-0">
                      {formatPrice(p.price)}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => runSearch(query)}
                  className="w-full flex items-center justify-between px-2 py-2.5 mt-1 rounded-[var(--radius-sm)] text-sm font-semibold text-orchard-900 hover:bg-linen-50 transition-colors"
                >
                  See all results for &quot;{query}&quot;
                  <ArrowUpRight size={15} />
                </button>
              </div>
            )}

            {/* No query yet: history + trending */}
            {!query.trim() && (
              <div className="p-2">
                {history.length > 0 && (
                  <>
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                        Recent Searches
                      </p>
                    </div>
                    {history.map((term) => (
                      <div
                        key={term}
                        className="group flex items-center gap-2.5 px-2 py-2 rounded-[var(--radius-sm)] hover:bg-linen-50 transition-colors"
                      >
                        <Clock size={14} className="text-charcoal-300 shrink-0" />
                        <button
                          type="button"
                          onClick={() => runSearch(term)}
                          className="flex-1 text-left text-sm text-charcoal-900 truncate"
                        >
                          {term}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromHistory(term)}
                          aria-label={`Remove ${term} from history`}
                          className="opacity-0 group-hover:opacity-100 text-charcoal-300 hover:text-danger-600 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </>
                )}

                <p className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-600 px-2 py-1.5 mt-1">
                  Trending
                </p>
                {TRENDING.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => runSearch(term)}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-[var(--radius-sm)] hover:bg-linen-50 transition-colors text-left"
                  >
                    <TrendingUp size={14} className="text-mango-500 shrink-0" />
                    <span className="text-sm text-charcoal-900">{term}</span>
                  </button>
                ))}
              </div>
            )}

            {query.trim() && suggestions.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-sm text-charcoal-600">No products match &quot;{query}&quot;</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
