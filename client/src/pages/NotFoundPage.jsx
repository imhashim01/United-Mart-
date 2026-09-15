import { Link } from "react-router-dom";
import { CompassIcon } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import usePageTitle from "../hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Page Not Found");

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="h-14 w-14 rounded-full bg-linen-100 flex items-center justify-center mb-4">
            <CompassIcon size={24} className="text-charcoal-300" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-orchard-900 mb-1.5">Page not found</h1>
          <p className="text-sm text-charcoal-600 mb-5">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <Link to="/" className="h-10 px-5 flex items-center rounded-[var(--radius-md)] bg-orchard-900 text-white text-sm font-semibold">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
