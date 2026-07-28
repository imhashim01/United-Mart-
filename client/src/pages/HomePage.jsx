import { motion } from "framer-motion";
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

export default function HomePage() {
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
