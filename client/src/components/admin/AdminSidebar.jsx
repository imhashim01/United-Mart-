import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Package, FolderTree, Tag, Users, Boxes,
  Ticket, Award, CreditCard, FileBarChart, Receipt, ShieldCheck, Settings, X,
} from "lucide-react";
import logo from "../../assets/images/logo.png";
import { useAuthStore } from "../../features/auth/hooks/useAuth";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Catalog",
    items: [
      { to: "/admin/products", label: "Products", icon: Package },
      { to: "/admin/todays-deals", label: "Today's Deals", icon: Ticket },
      { to: "/admin/categories", label: "Categories", icon: FolderTree },
      { to: "/admin/brands", label: "Brands", icon: Tag },
      { to: "/admin/inventory", label: "Inventory", icon: Boxes },
    ],
  },
  {
    label: "Sales",
    items: [
      { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { to: "/admin/customers", label: "Customers", icon: Users },
      { to: "/admin/coupons", label: "Coupons", icon: Ticket },
      { to: "/admin/rewards", label: "Reward Program", icon: Award },
      { to: "/admin/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/admin/reports", label: "Reports", icon: FileBarChart },
      { to: "/admin/invoices", label: "Invoices", icon: Receipt },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/admins", label: "Admins", icon: ShieldCheck, adminOnly: true },
      { to: "/admin/settings", label: "Website Settings", icon: Settings, adminOnly: true },
    ],
  },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === "admin";

  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.adminOnly || isAdmin),
  })).filter((section) => section.items.length > 0);

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="United Mart Sukkur" className="h-8 w-8" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">United Mart Sukkur</p>
            <p className="text-[10px] text-white/50">Admin Panel</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white" aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
        {visibleSections.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium mb-0.5 transition-colors ${
                    isActive
                      ? "bg-mango-500 text-charcoal-900"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-orchard-900 print:hidden">{content}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div onClick={onClose} className="fixed inset-0 bg-charcoal-900/50 z-40 lg:hidden" />
          <aside className="fixed top-0 left-0 h-full w-72 bg-orchard-900 z-50 lg:hidden">{content}</aside>
        </>
      )}
    </>
  );
}
