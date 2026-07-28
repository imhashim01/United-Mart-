import clsx from "clsx";

const VARIANTS = {
  success: "bg-success-100 text-success-600",
  warning: "bg-warning-100 text-warning-600",
  danger: "bg-danger-100 text-danger-600",
  info: "bg-info-100 text-info-600",
  accent: "bg-mango-100 text-[#8A5A12]",
  neutral: "bg-linen-50 text-charcoal-600",
};

export default function Badge({ children, variant = "neutral", className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
