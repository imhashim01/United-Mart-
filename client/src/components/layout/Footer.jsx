import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useEffect, useState } from "react";
import { getSettings, getPersistedCategoryObjects } from "../../utils/persistedData";
import { getPersistedSettings } from "../../utils/persistedData";
import { getCategoryObjects } from "../../data/productsData";
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
  const [categoryLinks, setCategoryLinks] = useState(FOOTER_COLUMNS[0].links);

  useEffect(() => {
    setSettings(getPersistedSettings({
  storeName: "United Mart Sukkur",
  supportEmail: "unitedmartsukkur@gmail.com",
  supportPhone: "+92 333 7111954",
  address: "Anaj Bazar, Sukkur, Sindh, Pakistan",
}));

const cats = getCategoryObjects();
if (Array.isArray(cats) && cats.length > 0) {
  setCategoryLinks(
    cats.map((c) => ({ label: c.name, href: `/shop?category=${encodeURIComponent(c.name)}` }))
  );
}
  }, []);

  const storeName = settings?.storeName ?? "United Mart Sukkur";
  const supportEmail = settings?.supportEmail ?? "unitedmartsukkur@gmail.com";
  const supportPhone = settings?.supportPhone ?? "+92 333 7111954";
  const address = settings?.address ?? "Anaj Bazar, Sukkur, Sindh, Pakistan";

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
          {FOOTER_COLUMNS.map((col, idx) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {(idx === 0 ? categoryLinks : col.links).map((link) => (
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
            <img
              src="data:image/png;base64,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"
              alt="WhatsApp"
              className="h-4 w-4"
            />
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
