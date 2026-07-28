import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, LogOut, ChevronDown, UserCircle } from "lucide-react";
import toast from "react-hot-toast";
import NotificationsBell from "./NotificationsBell";
import { useAuthStore } from "../../features/auth/hooks/useAuth";
import RoleBadge from "../auth/RoleBadge";
import logo from "../../assets/images/logo.png";

export default function AdminTopbar({ onMenuClick, title }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-border print:hidden">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-linen-50"
          >
            <Menu size={20} />
          </button>
          <img src={logo} alt="United Mart Sukkur" className="h-8 w-8 rounded-[var(--radius-sm)] object-cover" />
          <h1 className="text-base md:text-lg font-semibold text-charcoal-900 truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center relative">
            <Search size={15} className="absolute left-3 text-charcoal-300" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-56 pl-9 pr-3 rounded-[var(--radius-sm)] bg-linen-50 border border-transparent text-sm focus:outline-none focus:bg-white focus:border-orchard-700 focus:ring-[3px] focus:ring-orchard-900/10 transition-all"
            />
          </div>
          <NotificationsBell />

          {/* Profile menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-full hover:bg-linen-50 transition-colors"
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="h-8 w-8 rounded-full object-cover border border-border" />
              ) : (
                <span className="h-8 w-8 rounded-full bg-orchard-900 text-white text-xs font-semibold flex items-center justify-center">
                  {user?.name?.charAt(0)?.toUpperCase() ?? <UserCircle size={18} />}
                </span>
              )}
              <ChevronDown size={14} className="hidden sm:block text-charcoal-600" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-60 bg-white rounded-[var(--radius-md)] border border-border shadow-[var(--shadow-md)] overflow-hidden z-30"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-charcoal-900 truncate">{user?.name ?? "Admin"}</p>
                    <p className="text-xs text-charcoal-600 truncate mb-1.5">{user?.email}</p>
                    {user?.role && <RoleBadge role={user.role} />}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-danger-600 hover:bg-danger-100 transition-colors"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
