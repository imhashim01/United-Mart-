import { Facebook, Instagram, MessageCircleMore, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useEffect, useState } from "react";
import { getPersistedSettings } from "../../utils/persistedData";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Fruits & Vegetables", href: "/category/fruits-vegetables" },
      { label: "Dairy & Eggs", href: "/category/dairy-eggs" },
      { label: "Bakery", href: "/category/bakery" },
      { label: "Today's Deals", href: "/deals" },
      { label: "Best Sellers", href: "/best-sellers" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Track Order", href: "/orders" },
      { label: "Delivery Information", href: "/delivery-info" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About United Mart", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Reward Points Program", href: "/rewards" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    setSettings(getPersistedSettings({
      storeName: "United Mart Sukkur",
      supportEmail: "unitedmartsukkur@gmail.com",
      supportPhone: "+92 333 7111954",
      address: "Anaj Bazar, Sukkur, Sindh, Pakistan",
    }));
  }, []);

  const storeName = settings?.storeName ?? "United Mart Sukkur";
  const supportEmail = settings?.supportEmail ?? "support@unitedmartsukkur.pk";
  const supportPhone = settings?.supportPhone ?? "+92 300 1234567";
  const address = settings?.address ?? "Station Road, Sukkur, Sindh, Pakistan";

  return (
    <footer className="bg-orchard-900 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-6">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="United Mart Sukkur" className="h-10 w-10" />
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold text-white">{storeName}</p>
                <p className="text-[11px] tracking-wide text-white/60 -mt-0.5">SUKKUR</p>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs mb-5">
              Fresh groceries, sourced daily and delivered across Sukkur &amp; Rohri —
              premium quality, honest prices.
            </p>
            <div className="space-y-2.5 text-sm text-white/70">
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-mango-500 shrink-0" />
                <span>{address}</span>
              </div>
              <a href={`tel:${supportPhone.replace(/\s+/g, "")}`} className="flex items-center gap-2.5 hover:text-mango-500 transition-colors">
                <Phone size={16} className="text-mango-500 shrink-0" />
                <span>{supportPhone}</span>
              </a>
              <a href={`mailto:${supportEmail}`} className="flex items-center gap-2.5 hover:text-mango-500 transition-colors">
                <Mail size={16} className="text-mango-500 shrink-0" />
                <span>{supportEmail}</span>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/70 hover:text-mango-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Socials */}
        <div className="flex items-center gap-3 mt-10">
          <a
            href="https://www.facebook.com/profile.php?id=61592145730289"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit United Mart on Facebook"
            className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-mango-500 hover:text-charcoal-900 transition-colors"
          >
            <Facebook size={16} />
          </a>
          <a
            href="https://www.instagram.com/unitedmartsukkur/"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit United Mart on Instagram"
            className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-mango-500 hover:text-charcoal-900 transition-colors"
          >
            <Instagram size={16} />
          </a>
          <a
            href="https://wa.me/923337111954"
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with United Mart on WhatsApp"
            className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-mango-500 hover:text-charcoal-900 transition-colors"
          >
            <MessageCircleMore size={16} />
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} United Mart Sukkur. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {["EasyPaisa", "JazzCash", "Bank Transfer", "COD"].map((method) => (
              <span
                key={method}
                className="text-[11px] font-medium px-2.5 py-1 rounded bg-white/10 text-white/70"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
