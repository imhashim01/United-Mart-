import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import ProductCard from "../../../components/ui/ProductCard";
import ProductCardSkeleton from "../../../components/ui/ProductCardSkeleton";
import { staggerContainer, fadeUp, viewportOnce } from "../../../animations/variants";

const COLUMN_CLASSES = {
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

export default function ProductGrid({
  products,
  loading = false,
  columns = 4,
  skeletonCount = 8,
  animate = true,
  emptyTitle = "No products found",
  emptyMessage = "Try adjusting your filters or search terms.",
}) {
  const gridClass = COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[4];

  if (loading) {
    return (
      <div className={`grid ${gridClass} gap-3 md:gap-4`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-border rounded-[var(--radius-lg)]">
        <div className="h-14 w-14 rounded-full bg-linen-50 flex items-center justify-center mb-4">
          <PackageSearch size={26} className="text-charcoal-300" />
        </div>
        <h3 className="text-base font-semibold text-charcoal-900 mb-1">{emptyTitle}</h3>
        <p className="text-sm text-charcoal-600 max-w-xs">{emptyMessage}</p>
      </div>
    );
  }

  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        variants: staggerContainer(0.05),
        initial: "hidden",
        whileInView: "visible",
        viewport: viewportOnce,
      }
    : {};

  return (
    <Wrapper {...wrapperProps} className={`grid ${gridClass} gap-3 md:gap-4`}>
      {products.map((product) =>
        animate ? (
          <motion.div key={product.id} variants={fadeUp}>
            <ProductCard product={product} />
          </motion.div>
        ) : (
          <ProductCard key={product.id} product={product} />
        )
      )}
    </Wrapper>
  );
}
