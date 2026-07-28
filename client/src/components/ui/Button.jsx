import { motion } from "framer-motion";
import clsx from "clsx";

const VARIANTS = {
  primary: "bg-orchard-900 text-white hover:bg-orchard-700",
  accent: "bg-mango-500 text-charcoal-900 hover:brightness-95",
  secondary: "bg-white text-orchard-900 border border-orchard-900 hover:bg-linen-50",
  ghost: "bg-transparent text-orchard-900 hover:bg-linen-50",
  destructive: "bg-white text-danger-600 border border-danger-600 hover:bg-danger-100",
};

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-[15px]",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  ...props
}) {
  return (
    <motion.button
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold transition-colors duration-150 cursor-pointer",
        "disabled:bg-charcoal-300 disabled:text-white disabled:cursor-not-allowed disabled:border-transparent",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={16} />}
          {children}
          {Icon && iconPosition === "right" && <Icon size={16} />}
        </>
      )}
    </motion.button>
  );
}
