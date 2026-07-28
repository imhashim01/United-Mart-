import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Package, CheckCircle2, XCircle, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { getAdminOrders } from "../../data/adminData";

const ICONS = {
  Pending: Bell,
  Confirmed: CheckCircle2,
  Packing: Package,
  "Out for Delivery": Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
};

// Build a small feed from the most recently updated orders' latest timeline entry
function buildNotifications() {
  return getAdminOrders()
    .map((o) => ({
      id: o.id,
      status: o.status,
      customer: o.customer.name,
      timestamp: o.timeline[o.timeline.length - 1]?.timestamp ?? o.createdAt,
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifications] = useState(buildNotifications);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-linen-50 transition-colors"
      >
        <Bell size={19} className="text-charcoal-900" />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-600" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-[var(--radius-md)] border border-border shadow-[var(--shadow-md)] overflow-hidden z-30"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-charcoal-900">Recent Order Activity</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = ICONS[n.status] ?? Bell;
                return (
                  <Link
                    key={n.id}
                    to={`/admin/orders/${n.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-linen-50 transition-colors border-b border-border last:border-0"
                  >
                    <div
                      className={clsx(
                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                        n.status === "Cancelled" ? "bg-danger-100 text-danger-600" : "bg-success-100 text-success-600"
                      )}
                    >
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal-900">
                        Order <span className="font-semibold">{n.id}</span> is now{" "}
                        <span className="font-semibold">{n.status}</span>
                      </p>
                      <p className="text-xs text-charcoal-600">{n.customer} · {timeAgo(n.timestamp)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
