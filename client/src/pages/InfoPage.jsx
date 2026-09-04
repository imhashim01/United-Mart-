import usePageTitle from "../hooks/usePageTitle";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircleMore } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import logo from "../assets/images/logo.png";

const deliveryInfoContent = (
  <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed">
    <p>United Mart Sukkur offers fast and reliable grocery delivery across Sukkur and nearby areas.</p>


    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Delivery Areas</h2>
      <ul className="mt-2 list-disc list-inside space-y-1">
        <li>Sukkur City</li>
        <li>Rohri</li>
        <li>Nearby Areas (where applicable)</li>
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Business Hours</h2>
      <p className="mt-2">10:00 AM – 10:00 PM</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Delivery Schedule</h2>
      <div className="mt-2 space-y-2">
        <p><strong>Before 4:00 PM (Saturday–Wednesday):</strong> Same Day Delivery</p>
        <p><strong>After 4:00 PM:</strong> Next Day Delivery</p>
        <p><strong>Thursday after 4:00 PM:</strong> Saturday Delivery</p>
        <p><strong>Friday:</strong> Saturday Delivery</p>
      </div>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Minimum Order</h2>
      <p className="mt-2">Rs. 1,000</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Free Delivery</h2>
      <p className="mt-2">Orders above Rs. 5,000</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Delivery Charges</h2>
      <p className="mt-2">Calculated based on customer location.</p>
    </div>
  </div>
);

const returnsContent = (
  <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed">
    <p>Customer satisfaction is our priority.</p>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Eligible Returns</h2>
      <p className="mt-2">Products can be returned if they are:</p>
      <ul className="mt-2 list-disc list-inside space-y-1">
        <li>Damaged</li>
        <li>Expired</li>
        <li>Incorrect Item</li>
        <li>Defective</li>
      </ul>
      <p className="mt-2">Return requests must be made on the <strong>same day</strong> as delivery.</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Non-returnable Items</h2>
      <ul className="mt-2 list-disc list-inside space-y-1">
        <li>Opened products</li>
        <li>Fresh produce after acceptance</li>
        <li>Used items</li>
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Refund Process</h2>
      <ul className="mt-2 list-disc list-inside space-y-1">
        <li>Cash Orders → Within 2–3 Hours</li>
        <li>JazzCash / Easypaisa / Bank Transfer → Within 24 Hours</li>
      </ul>
    </div>
  </div>
);

const faqsContent = (
  <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed">
    <div>
      <h2 className="text-base font-semibold text-orchard-900">Do you provide home delivery?</h2>
      <p className="mt-2">Yes, we deliver throughout Sukkur and nearby areas.</p>
    </div>

    <div>
      <h2 className="text-base font-semibold text-orchard-900">What is the minimum order?</h2>
      <p className="mt-2">Rs. 1,000</p>
    </div>

    <div>
      <h2 className="text-base font-semibold text-orchard-900">When is delivery free?</h2>
      <p className="mt-2">On orders above Rs. 5,000.</p>
    </div>

    <div>
      <h2 className="text-base font-semibold text-orchard-900">Which payment methods are accepted?</h2>
      <p className="mt-2">Cash on Delivery, JazzCash, Easypaisa, Bank Transfer.</p>
    </div>

    <div>
      <h2 className="text-base font-semibold text-orchard-900">How can I track my order?</h2>
      <p className="mt-2">Go to the <strong>Track Order</strong> page and enter your Order ID and Phone Number.</p>
    </div>

    <div>
      <h2 className="text-base font-semibold text-orchard-900">Can I return damaged products?</h2>
      <p className="mt-2">Yes, on the same day of delivery.</p>
    </div>

    <div>
      <h2 className="text-base font-semibold text-orchard-900">How do Reward Stars work?</h2>
      <p className="mt-2">Earn <strong>1 Star for every Rs.100 spent</strong>. Collect stars and redeem exciting gifts.</p>
    </div>

    <div>
      <h2 className="text-base font-semibold text-orchard-900">What are your business hours?</h2>
      <p className="mt-2">10:00 AM – 10:00 PM</p>
    </div>
  </div>
);

const aboutContent = (
  <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed">
    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Your Trusted Grocery Shopping Destination</h2>
      <p className="mt-2">
        Welcome to <strong>United Mart Sukkur</strong>, your one-stop destination for fresh groceries, household essentials, beverages, personal care products, bakery items, and much more.
      </p>
      <p className="mt-2">
        Our mission is to make grocery shopping simple, affordable, and convenient by providing quality products at competitive prices with reliable home delivery.
      </p>
      <p className="mt-2">
        Whether you&apos;re shopping for daily essentials or monthly groceries, we are committed to delivering the best shopping experience right to your doorstep.
      </p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Why Choose Us?</h2>
      <ul className="mt-2 list-disc list-inside space-y-2">
        <li>🥛 Dairy & Bakery Products</li>
        <li>🛒 Thousands of Grocery Items</li>
        <li>🚚 Fast Home Delivery</li>
        <li>💰 Affordable Prices</li>
        <li>⭐ Reward Points on Every Purchase</li>
        <li>❤️ Friendly Customer Support</li>
        <li>🔒 Safe & Secure Online Shopping</li>
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Our Mission</h2>
      <p className="mt-2">
        To provide every family in Sukkur with quality groceries, excellent service, and a seamless online shopping experience.
      </p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Our Vision</h2>
      <p className="mt-2">
        To become the most trusted and preferred online grocery store in Sukkur and surrounding areas.
      </p>
    </div>
  </div>
);

const privacyContent = (
  <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed">
    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Privacy Policy</h2>
      <p className="mt-2">Your privacy is important to us.</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Information We Collect</h2>
      <p className="mt-2">We may collect:</p>
      <ul className="mt-2 list-disc list-inside space-y-1">
        <li>Name</li>
        <li>Phone Number</li>
        <li>Email Address</li>
        <li>Delivery Address</li>
        <li>Order History</li>
        <li>Payment Method</li>
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Why We Collect Information</h2>
      <ul className="mt-2 list-disc list-inside space-y-1">
        <li>Process your orders</li>
        <li>Deliver groceries</li>
        <li>Contact you regarding your order</li>
        <li>Improve customer service</li>
        <li>Send promotions (if you opt in)</li>
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Information Security</h2>
      <p className="mt-2">We use appropriate security measures to protect your personal information.</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Third Parties</h2>
      <p className="mt-2">We never sell your personal information. Information is shared only with trusted delivery partners or when required by law.</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Cookies</h2>
      <p className="mt-2">Our website may use cookies to improve your browsing experience.</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Changes</h2>
      <p className="mt-2">We may update this Privacy Policy from time to time.</p>
    </div>
  </div>
);

const termsContent = (
  <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed">
    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Terms & Conditions</h2>
      <p className="mt-2">Welcome to United Mart Sukkur. By using our website, you agree to the following terms.</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Orders</h2>
      <ul className="mt-2 list-disc list-inside space-y-1">
        <li>All orders are subject to product availability.</li>
        <li>Prices may change without prior notice.</li>
        <li>We reserve the right to cancel suspicious or fraudulent orders.</li>
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Delivery</h2>
      <ul className="mt-2 list-disc list-inside space-y-1">
        <li>Delivery times are estimates.</li>
        <li>Delays may occur due to weather, traffic, or public holidays.</li>
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Payments</h2>
      <p className="mt-2">We accept:</p>
      <ul className="mt-2 list-disc list-inside space-y-1">
        <li>Cash on Delivery</li>
        <li>JazzCash</li>
        <li>Easypaisa</li>
        <li>Bank Transfer</li>
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Product Information</h2>
      <p className="mt-2">We strive to provide accurate product descriptions. Actual packaging may differ from images shown.</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Returns</h2>
      <p className="mt-2">Returns are accepted only for:</p>
      <ul className="mt-2 list-disc list-inside space-y-1">
        <li>Damaged products</li>
        <li>Expired products</li>
        <li>Incorrect items</li>
        <li>Defective products</li>
      </ul>
      <p className="mt-2">Requests must be made on the day of delivery.</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Reward Program</h2>
      <p className="mt-2">Reward stars have no cash value. United Mart reserves the right to update or discontinue the reward program at any time.</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Limitation of Liability</h2>
      <p className="mt-2">United Mart Sukkur shall not be liable for indirect or incidental damages arising from the use of our website or services.</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Contact</h2>
      <p className="mt-2">If you have any questions regarding these Terms, please contact us.</p>
      <p className="mt-2">📧 unitedmartsukkur@gmail.com</p>
      <p className="mt-2">📞 0333-7111954</p>
    </div>
  </div>
);

const contactContent = (
  <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed">
    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Store Address</h2>
      <p className="mt-2">Anaj Bazar<br />Sukkur, Sindh<br />Pakistan</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Phone</h2>
      <p className="mt-2">📞 0333-7111954</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">WhatsApp</h2>
      <p className="mt-2">📱 0333-7111954</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">JazzCash</h2>
      <p className="mt-2">0314-2175028</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Easypaisa</h2>
      <p className="mt-2">0314-2175028</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Email</h2>
      <p className="mt-2">unitedmartsukkur@gmail.com</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Business Hours</h2>
      <p className="mt-2">10:00 AM – 10:00 PM<br />Every Day</p>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-orchard-900">Follow Us</h2>
      <p className="mt-2">Facebook, Instagram, TikTok</p>
    </div>

    <div className="rounded-[var(--radius-lg)] border border-border p-4 bg-linen-50">
      <h2 className="text-lg font-semibold text-orchard-900">Contact Form</h2>
      <p className="mt-2">Full Name, Email, Phone Number, Subject, Message</p>
      <p className="mt-2 font-medium">Send Message</p>
    </div>
  </div>
);

export default function InfoPage({
  title,
  description,
  eyebrow = "Information",
  pageKey,
  ctaLabel = "Browse Products",
  ctaHref = "/shop",
}) {
  usePageTitle(title, description);

  const pageContent = {
    about: aboutContent,
    delivery: deliveryInfoContent,
    returns: returnsContent,
    faqs: faqsContent,
    contact: contactContent,
    privacy: privacyContent,
    terms: termsContent,
  };

  return (
    <div className="min-h-screen bg-linen-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16 md:px-6">
        <div className="w-full max-w-3xl rounded-[var(--radius-lg)] border border-border bg-white p-8 md:p-12 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="United Mart Sukkur" className="h-12 w-12 rounded-[var(--radius-sm)] object-cover" />
              <div>
                <p className="font-display text-xl font-semibold text-orchard-900">United Mart</p>
                <p className="text-xs tracking-wide text-charcoal-600">SUKKUR</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orchard-50 px-3 py-1 text-sm font-medium text-orchard-800">
              <MessageCircleMore size={16} />
              {eyebrow}
            </div>
          </div>

          <h1 className="mt-3 font-display text-3xl md:text-4xl text-orchard-900">{title}</h1>
          <p className="mt-4 text-base leading-8 text-charcoal-700">{description}</p>

          <div className="mt-8 space-y-6">
            {pageKey && pageContent[pageKey]}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={ctaHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-orchard-900 px-5 text-sm font-semibold text-white hover:bg-orchard-700"
            >
              {ctaLabel}
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://wa.me/923337111954"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border-strong px-5 text-sm font-semibold text-charcoal-900 hover:bg-linen-50"
            >
              <MessageCircleMore size={16} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
