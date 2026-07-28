import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButtons({ productName, url }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const shareText = `Check out ${productName} on United Mart Sukkur`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} — ${shareUrl}`)}`,
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "Twitter / X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Share this product"
        aria-expanded={open}
        className="flex items-center gap-2 h-10 px-4 rounded-[var(--radius-md)] border border-border-strong text-sm font-medium text-charcoal-900 hover:bg-linen-50 transition-colors"
      >
        <Share2 size={16} />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 z-20 w-52 bg-white rounded-[var(--radius-md)] border border-border shadow-[var(--shadow-md)] p-1.5"
          >
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm text-charcoal-900 hover:bg-linen-50 transition-colors"
              >
                <link.icon size={16} className="text-charcoal-600" />
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm text-charcoal-900 hover:bg-linen-50 transition-colors"
            >
              {copied ? (
                <Check size={16} className="text-success-600" />
              ) : (
                <Copy size={16} className="text-charcoal-600" />
              )}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
