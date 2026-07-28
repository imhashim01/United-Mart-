import { Check, X } from "lucide-react";
import clsx from "clsx";
import { formatDate } from "../../../../utils/formatCurrency";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit" });
}

export default function OrderTimeline({ timeline }) {
  return (
    <div className="flex flex-col">
      {timeline.map((entry, i) => {
        const isLast = i === timeline.length - 1;
        const isCancelled = entry.status === "Cancelled";
        return (
          <div key={`${entry.status}-${entry.timestamp}`} className="flex gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={clsx(
                  "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                  isCancelled ? "bg-danger-600" : "bg-orchard-900"
                )}
              >
                {isCancelled ? <X size={13} className="text-white" /> : <Check size={13} className="text-white" />}
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-border my-1" />}
            </div>
            <div className={clsx("pb-6", isLast && "pb-0")}>
              <p className="text-sm font-semibold text-charcoal-900">{entry.status}</p>
              <p className="text-xs text-charcoal-600 mb-1">
                {formatDate(entry.timestamp)} at {formatTime(entry.timestamp)}
              </p>
              <p className="text-sm text-charcoal-600">{entry.note}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
