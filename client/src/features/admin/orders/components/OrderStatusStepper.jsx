import { Check, X, Clock } from "lucide-react";
import clsx from "clsx";
import { ORDER_STATUS_FLOW } from "../../../../data/adminData";

export default function OrderStatusStepper({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-3 bg-danger-100 rounded-[var(--radius-md)] px-4 py-3.5">
        <div className="h-9 w-9 rounded-full bg-danger-600 flex items-center justify-center shrink-0">
          <X size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-danger-600">Order Cancelled</p>
          <p className="text-xs text-danger-600/80">This order will not proceed further</p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <div className="flex items-start">
      {ORDER_STATUS_FLOW.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isLast = i === ORDER_STATUS_FLOW.length - 1;

        return (
          <div key={step} className={clsx("flex items-center", !isLast && "flex-1")}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={clsx(
                  "h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  isComplete
                    ? "bg-orchard-900 text-white"
                    : isCurrent
                    ? "bg-mango-500 text-charcoal-900"
                    : "bg-linen-50 text-charcoal-300 border border-border"
                )}
              >
                {isComplete ? <Check size={16} /> : isCurrent ? <Clock size={16} /> : <span className="text-xs font-semibold">{i + 1}</span>}
              </div>
              <span
                className={clsx(
                  "text-[11px] font-medium text-center max-w-[72px] leading-tight",
                  isComplete || isCurrent ? "text-charcoal-900" : "text-charcoal-300"
                )}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div
                className={clsx(
                  "flex-1 h-0.5 mx-1 -mt-5",
                  isComplete ? "bg-orchard-900" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
