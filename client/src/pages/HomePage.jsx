import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroBanner from "../components/home/HeroBanner";
import CategoriesSection from "../components/home/CategoriesSection";
import TodaysDeals from "../components/home/TodaysDeals";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BestSellers from "../components/home/BestSellers";
import BrandsSection from "../components/home/BrandsSection";
import RewardPointsBanner from "../components/home/RewardPointsBanner";
import DeliveryInfo from "../components/home/DeliveryInfo";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import { getCategoryObjects } from "../data/productsData";
import { fetchProductsByCategory } from "../data/homeSectionsApi";

export default function HomePage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Proactively warms every category's product list in the background,
    // a couple seconds after the homepage itself has had a chance to
    // render — so a category page can load instantly the moment someone
    // taps it, even with zero hover/touch lead time (which isn't reliable
    // on mobile, especially on a slow connection). Deliberately delayed
    // and fire-and-forget so it doesn't compete with the homepage's own
    // images/data for bandwidth on first load.
    const timer = setTimeout(() => {
      const categories = getCategoryObjects();
      categories.forEach((category) => {
        queryClient.prefetchQuery({
          queryKey: ["category-products", category.id],
          queryFn: () => fetchProductsByCategory(category.id),
          staleTime: 5 * 60 * 1000,
        });
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <HeroBanner />
        <CategoriesSection />
        <TodaysDeals />
        <FeaturedProducts />
        <BestSellers />
        <BrandsSection />
        <RewardPointsBanner />
        <DeliveryInfo />
        <Testimonials />
        <Newsletter />
      </motion.main>

      <Footer />
    </div>
  );
}