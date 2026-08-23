import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RewardsPage from "./pages/RewardsPage";
import InfoPage from "./pages/InfoPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import FloatingCartBar from "./components/layout/FloatingCartBar";
import WhatsAppButton from "./components/layout/WhatsAppButton";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

// Admin pages
import DashboardPage from "./pages/admin/DashboardPage";
import AdminOrdersPage from "./pages/admin/OrdersPage";
import AdminOrderDetailsPage from "./pages/admin/OrderDetailsPage";
import ProductsPage from "./pages/admin/ProductsPage";
import TodaysDealsPage from "./pages/admin/TodaysDealsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import PublicOrdersPage from "./pages/OrdersPage";
import PublicOrderDetailsPage from "./pages/PublicOrderDetailsPage";
import BrandsPage from "./pages/admin/BrandsPage";
import CustomersPage from "./pages/admin/CustomersPage";
import InventoryPage from "./pages/admin/InventoryPage";
import CouponsPage from "./pages/admin/CouponsPage";
import RewardProgramPage from "./pages/admin/RewardProgramPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import InvoicesPage from "./pages/admin/InvoicesPage";
import AdminsPage from "./pages/admin/AdminsPage";
import SettingsPage from "./pages/admin/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token?" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token?" element={<VerifyEmailPage />} />
        <Route path="/about" element={<InfoPage pageKey="about" title="About United Mart" description="United Mart Sukkur brings fresh groceries, pantry staples, and everyday essentials straight to your doorstep with reliable delivery, competitive prices, and a seamless shopping experience." eyebrow="About Us" />} />
        <Route path="/contact" element={<InfoPage pageKey="contact" title="Contact United Mart" description="We are always here to help. Reach out by phone, WhatsApp, or email and we’ll respond quickly." eyebrow="Contact Us" />} />
        <Route path="/delivery-info" element={<InfoPage pageKey="delivery" title="Delivery Information" description="United Mart Sukkur offers fast and reliable grocery delivery across Sukkur and nearby areas." eyebrow="Delivery Information" />} />
        <Route path="/returns" element={<InfoPage pageKey="returns" title="Returns & Refunds" description="Customer satisfaction is our priority. Learn how returns and refunds work at United Mart Sukkur." eyebrow="Returns & Refunds" />} />
        <Route path="/faqs" element={<InfoPage pageKey="faqs" title="FAQs" description="Frequently asked questions about delivery, orders, returns, and rewards." eyebrow="FAQs" />} />
        <Route path="/privacy" element={<InfoPage pageKey="privacy" title="Privacy Policy" description="We protect your personal information and use it only to provide a secure, reliable shopping experience for our customers." eyebrow="Privacy" />} />
        <Route path="/terms" element={<InfoPage pageKey="terms" title="Terms of Service" description="By shopping with United Mart, you agree to our service terms and our commitment to transparent pricing, honest delivery, and customer satisfaction." eyebrow="Terms" />} />
        <Route path="/careers" element={<InfoPage title="Careers" description="We are always looking for passionate team members who want to help build a better grocery shopping experience in Sukkur." eyebrow="Join Our Team" />} />
        <Route path="/deals" element={<ShopPage />} />
        <Route path="/best-sellers" element={<InfoPage title="Best Sellers" description="These are the community favorites shoppers keep coming back for across Sukkur and Rohri." eyebrow="Popular Picks" />} />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <RewardsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <PublicOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <PublicOrderDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard — accessible to 'manager' and 'admin' roles */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="manager">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="manager">
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute requiredRole="manager">
              <AdminOrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="manager">
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/todays-deals"
          element={
            <ProtectedRoute requiredRole="manager">
              <TodaysDealsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requiredRole="manager">
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/brands"
          element={
            <ProtectedRoute requiredRole="manager">
              <BrandsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute requiredRole="manager">
              <CustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute requiredRole="manager">
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/coupons"
          element={
            <ProtectedRoute requiredRole="manager">
              <CouponsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rewards"
          element={
            <ProtectedRoute requiredRole="manager">
              <RewardProgramPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute requiredRole="manager">
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute requiredRole="manager">
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/invoices"
          element={
            <ProtectedRoute requiredRole="manager">
              <InvoicesPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-only (not accessible to 'manager') */}
        <Route
          path="/admin/admins"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <FloatingCartBar />
      <WhatsAppButton />
    </BrowserRouter>
  );
}
