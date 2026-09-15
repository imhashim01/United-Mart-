import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CategoryPage from "./pages/CategoryPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import FloatingCartBar from "./components/layout/FloatingCartBar";
import WhatsAppButton from "./components/layout/WhatsAppButton";

// Everything below this line is NOT needed for a first-time shopper's
// very first paint — it loads on demand, the moment someone actually
// navigates there, instead of every visitor downloading the entire
// admin panel (charts, PDF generation, 15+ admin pages) up front.
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const RewardsPage = lazy(() => import("./pages/RewardsPage"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PublicOrdersPage = lazy(() => import("./pages/OrdersPage"));
const PublicOrderDetailsPage = lazy(() => import("./pages/PublicOrderDetailsPage"));

const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/OrdersPage"));
const AdminOrderDetailsPage = lazy(() => import("./pages/admin/OrderDetailsPage"));
const ProductsPage = lazy(() => import("./pages/admin/ProductsPage"));
const TodaysDealsPage = lazy(() => import("./pages/admin/TodaysDealsPage"));
const CategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const BrandsPage = lazy(() => import("./pages/admin/BrandsPage"));
const CustomersPage = lazy(() => import("./pages/admin/CustomersPage"));
const InventoryPage = lazy(() => import("./pages/admin/InventoryPage"));
const CouponsPage = lazy(() => import("./pages/admin/CouponsPage"));
const RewardProgramPage = lazy(() => import("./pages/admin/RewardProgramPage"));
const PaymentsPage = lazy(() => import("./pages/admin/PaymentsPage"));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage"));
const InvoicesPage = lazy(() => import("./pages/admin/InvoicesPage"));
const AdminsPage = lazy(() => import("./pages/admin/AdminsPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("config", "G-X2T226PX3Z", {
        page_path: location.pathname + location.search,
      });
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [location]);

  return null;
}

function RouteLoadingFallback() {
  return (
    <div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, border: "3px solid #E4E1D8", borderTopColor: "#173A2E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnalyticsTracker />
      <Suspense fallback={<RouteLoadingFallback />}>
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <FloatingCartBar />
      <WhatsAppButton />
    </BrowserRouter>
  );
}