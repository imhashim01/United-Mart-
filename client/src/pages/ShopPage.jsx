import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductGrid from "../features/products/components/ProductGrid";
import FilterSidebar from "../features/search/components/FilterSidebar";
import SortDropdown from "../features/search/components/SortDropdown";
import Pagination from "../features/search/components/Pagination";
import { getProducts, priceRange } from "../data/productsData";

const PAGE_SIZE = 12;

const defaultFilters = {
  categories: [],
  brands: [],
  priceMin: priceRange.min,
  priceMax: priceRange.max,
  inStockOnly: false,
  discountedOnly: false,
};

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const filterParam = searchParams.get("filter") ?? "";
  const brandParam = searchParams.get("brand") ?? "";
  const categoryParam = searchParams.get("category") ?? "";

  const [filters, setFilters] = useState({
    ...defaultFilters,
    brands: brandParam ? [brandParam] : [],
    categories: categoryParam ? [categoryParam] : [],
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentProducts = getProducts();

  const productCounts = useMemo(() => {
    const byCategory = {};
    const byBrand = {};
    currentProducts.forEach((p) => {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
      byBrand[p.brand] = (byBrand[p.brand] ?? 0) + 1;
    });
    return { byCategory, byBrand };
  }, [currentProducts.length]);

  const getEffectivePrice = (product) => {
    const defaultVariant = product.variants?.length
      ? product.variants.find((variant) => variant.isDefault) ?? product.variants[0]
      : null;
    if (defaultVariant) return defaultVariant.discountPrice != null ? defaultVariant.discountPrice : defaultVariant.price;
    return product.discountPrice != null ? product.discountPrice : product.price;
  };

  const isProductInStock = (product) => {
    if (product.variants?.length) {
      return product.variants.some((variant) => variant.stock > 0);
    }
    return product.inStock;
  };

  const isProductDiscounted = (product) => {
    if (product.variants?.length) {
      return product.variants.some((variant) => variant.discountPrice != null && variant.discountPrice < variant.price);
    }
    return product.discount > 0 || product.discountPrice != null;
  };

  const matchesQuery = (product, q) => {
    const lower = q.toLowerCase();
    if (product.name.toLowerCase().includes(lower) || product.category.toLowerCase().includes(lower) || product.brand.toLowerCase().includes(lower)) {
      return true;
    }
    return product.variants?.some((variant) =>
      variant.name?.toLowerCase().includes(lower) ||
      variant.sku?.toLowerCase().includes(lower)
    );
  };

  const filtered = useMemo(() => {
    let list = [...currentProducts];

    if (query.trim()) {
      list = list.filter((p) => matchesQuery(p, query));
    }

    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.brands.length > 0) {
      list = list.filter((p) => filters.brands.includes(p.brand));
    }
    list = list.filter((p) => {
      const price = getEffectivePrice(p);
      return price >= filters.priceMin && price <= filters.priceMax;
    });
    if (filters.inStockOnly) list = list.filter((p) => isProductInStock(p));
    const showDeals = filterParam === "deals" || filters.discountedOnly;
    if (showDeals) list = list.filter((p) => isProductDiscounted(p));

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case "price-desc":
        list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case "rating-desc":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "discount-desc":
        list.sort((a, b) => b.discount - a.discount);
        break;
      case "newest":
        list.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        break;
    }

    return list;
  }, [query, filters, sortBy, filterParam]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (filterParam === "deals") {
      setPage(1);
    }
  }, [filterParam]);

  useEffect(() => {
    if (brandParam) {
      setFilters((prev) => ({ ...prev, brands: [brandParam] }));
      setPage(1);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [brandParam]);

  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, categories: [categoryParam] }));
      setPage(1);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [categoryParam]);

  const handleFilterChange = (next) => {
    setFilters(next);
    setPage(1);
  };

  const handleSortChange = (next) => {
    setSortBy(next);
    setPage(1);
  };

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.discountedOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl text-orchard-900 mb-1.5">
            {filterParam === "deals"
              ? "Today’s Deals"
              : categoryParam
              ? `Shop ${categoryParam}`
              : brandParam
              ? `Shop ${brandParam}`
              : query
              ? `Results for "${query}"`
              : "Shop All Products"}
          </h1>
          <p className="text-sm text-charcoal-600">{filtered.length} products found</p>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onChange={handleFilterChange} productCounts={productCounts} />
          </div>

          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 h-10 px-3.5 rounded-[var(--radius-md)] border border-border-strong text-sm font-medium text-charcoal-900"
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="h-5 w-5 flex items-center justify-center rounded-full bg-mango-500 text-charcoal-900 text-[11px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <div className="ml-auto">
                <SortDropdown value={sortBy} onChange={handleSortChange} />
              </div>
            </div>

            <ProductGrid products={paginated} columns={4} animate={false} />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
            />
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-charcoal-900/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden overflow-y-auto p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-charcoal-900">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar filters={filters} onChange={handleFilterChange} productCounts={productCounts} />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full h-11 mt-4 rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold"
              >
                Show {filtered.length} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
