import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

export default function StatCard({ label, value, changePct, icon: Icon, prefix = "" }) {
  const isPositive = changePct >= 0;

  return (
    <div className="bg-white border border-border rounded-[var(--radius-lg)] p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-charcoal-600">{label}</p>
        {Icon && (
          <div className="h-9 w-9 rounded-[var(--radius-sm)] bg-linen-50 flex items-center justify-center">
            <Icon size={16} className="text-orchard-700" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-charcoal-900 tabular-nums mb-1.5">
        {prefix}
        {value}
      </p>
      <div
        className={clsx(
          "flex items-center gap-1 text-xs font-semibold",
          isPositive ? "text-success-600" : "text-danger-600"
        )}
      >
        {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {Math.abs(changePct)}%
        <span className="text-charcoal-600 font-normal ml-1">vs last period</span>
      </div>
    </div>
  );
}
