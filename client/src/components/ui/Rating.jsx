import { Star } from "lucide-react";

export default function Rating({ value = 0, reviews, size = 14, showCount = true }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={size} className="fill-mango-500 text-mango-500" />
      <span className="text-sm font-semibold text-charcoal-900 tabular-nums">
        {value.toFixed(1)}
      </span>
      {showCount && reviews != null && (
        <span className="text-xs text-charcoal-600">({reviews})</span>
      )}
    </div>
  );
}
