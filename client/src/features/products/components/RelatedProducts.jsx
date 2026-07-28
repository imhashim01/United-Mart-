import ProductGrid from "../../products/components/ProductGrid";
import SectionHeader from "../../../components/ui/SectionHeader";

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="border-t border-border pt-8 mt-8">
      <SectionHeader eyebrow="You Might Also Like" title="Related Products" />
      <ProductGrid products={products} columns={4} />
    </section>
  );
}
