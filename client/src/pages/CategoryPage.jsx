import usePageTitle from "../hooks/usePageTitle";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductGrid from "../features/products/components/ProductGrid";
import { getCategories } from "../data/homeData";
import { fetchProductsByCategory } from "../data/homeSectionsApi";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategories().find((item) => item.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [slug]);

  const { data: categoryProducts = [], isLoading } = useQuery({
    queryKey: ["category-products", category?.id],
    queryFn: () => fetchProductsByCategory(category.id),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });

  usePageTitle(
    category ? `${category.name} — Shop Online` : "Category Not Found",
    category
      ? `Shop fresh ${category.name.toLowerCase()} online in Sukkur & Rohri, delivered same-day before 4 PM by United Mart Sukkur.`
      : undefined
  );

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl text-orchard-900 mb-1.5">
            {category ? category.name : "Category not found"}
          </h1>
          <p className="text-sm text-charcoal-600">
            {category ? (
              isLoading ? (
                "Loading products..."
              ) : (
                <>Browse {categoryProducts.length} products in <strong>{category.name}</strong>.</>
              )
            ) : (
              <>This category does not exist. Please choose a valid category.</>
            )}
          </p>
        </div>

        {category ? (
          isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-[var(--radius-md)] bg-linen-50 animate-pulse" />
              ))}
            </div>
          ) : (
            <ProductGrid products={categoryProducts} columns={4} emptyTitle="No products found" emptyMessage="Try another category or search for products." />
          )
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-border bg-white p-8 text-center">
            <p className="text-sm text-charcoal-600 mb-4">We could not find that category.</p>
            <Link to="/" className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-orchard-900 px-4 py-2 text-sm font-semibold text-white hover:bg-orchard-700">
              Back to Home
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}