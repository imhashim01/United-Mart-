import { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CustomerRewardDashboard from '../features/rewards/components/CustomerRewardDashboard';

export default function RewardsPage() {
  useEffect(() => {
    document.title = 'Reward Points - United Mart';
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linen-50">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Reward Points</h1>
            <p className="text-lg text-gray-600 mt-2">
              Earn stars on every purchase and enjoy exclusive discounts, gifts, and member-only offers.
            </p>
          </div>

          <section className="rounded-[var(--radius-lg)] border border-border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Earn Stars on Every Purchase</h2>
            <p className="mt-4 text-sm text-charcoal-700">Shopping at United Mart Sukkur is rewarding!</p>

            <div className="mt-6 space-y-4 text-sm text-charcoal-700">
              <p className="font-semibold">How It Works</p>
              <p>For every:</p>
              <div className="rounded-[var(--radius-md)] border border-border p-4 bg-linen-50">
                <p className="text-lg font-semibold">Rs.100 spent</p>
                <p className="mt-1">⭐ Earn <strong>1 Reward Star</strong></p>
              </div>
              <p>Your stars are automatically added to your account after a successful order.</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--radius-md)] border border-border p-4 bg-gray-50">
                <p className="text-sm font-semibold text-orchard-900">Reward Level</p>
                <p className="mt-2">⭐ 100</p>
                <p>Discount Voucher</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-border p-4 bg-gray-50">
                <p className="text-sm font-semibold text-orchard-900">Reward Level</p>
                <p className="mt-2">⭐ 250</p>
                <p>Grocery Gift Pack</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-border p-4 bg-gray-50">
                <p className="text-sm font-semibold text-orchard-900">Reward Level</p>
                <p className="mt-2">⭐ 500</p>
                <p>Premium Household Gift</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-border p-4 bg-gray-50">
                <p className="text-sm font-semibold text-orchard-900">Reward Level</p>
                <p className="mt-2">⭐ 1000</p>
                <p>Special Gift Hamper</p>
              </div>
            </div>

            <div className="mt-8 text-sm text-charcoal-700 space-y-2">
              <p className="font-semibold">Benefits</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Exclusive Gifts</li>
                <li>Special Discounts</li>
                <li>Member-only Offers</li>
                <li>Birthday Rewards (Future Feature)</li>
                <li>Seasonal Promotions</li>
              </ul>
              <p className="font-semibold">Terms</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stars cannot be exchanged for cash.</li>
                <li>Reward stars expire after 12 months.</li>
                <li>Gifts are subject to availability.</li>
                <li>United Mart reserves the right to modify the program.</li>
              </ul>
            </div>
          </section>

          <CustomerRewardDashboard />
        </div>
      </main>
      <Footer />
    </>
  );
}
