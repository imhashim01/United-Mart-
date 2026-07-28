import { Plus, Minus } from "lucide-react";
import clsx from "clsx";

const SIZES = {
  sm: { height: "h-8", button: "h-6 w-6", text: "text-sm", icon: 12 },
  md: { height: "h-9", button: "h-7 w-7", text: "text-sm", icon: 14 },
  lg: { height: "h-12", button: "h-9 w-9", text: "text-base", icon: 16 },
};

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  variant = "filled", // 'filled' (dark pill) | 'outline' (light, for cart rows)
  className,
}) {
  const s = SIZES[size];

  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={clsx(
        s.height,
        "flex items-center justify-between rounded-full px-1",
        variant === "filled"
          ? "bg-orchard-900 text-white"
          : "bg-white border border-border-strong text-charcoal-900",
        className
      )}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={clsx(
          s.button,
          "flex items-center justify-center rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
          variant === "filled" ? "hover:bg-orchard-700" : "hover:bg-linen-50"
        )}
      >
        <Minus size={s.icon} />
      </button>
      <span className={clsx(s.text, "font-semibold tabular-nums w-6 text-center")}>
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={clsx(
          s.button,
          "flex items-center justify-center rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
          variant === "filled" ? "hover:bg-orchard-700" : "hover:bg-linen-50"
        )}
      >
        <Plus size={s.icon} />
      </button>
    </div>
  );
}
