import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

function getPageList(current, total) {
  const pages = [];
  const windowSize = 1;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - windowSize && i <= current + windowSize)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pages = getPageList(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
      <p className="text-sm text-charcoal-600">
        Showing <span className="font-medium text-charcoal-900">{start}–{end}</span> of{" "}
        <span className="font-medium text-charcoal-900">{totalItems}</span> products
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="h-9 w-9 flex items-center justify-center rounded-[var(--radius-sm)] border border-border-strong text-charcoal-900 hover:bg-linen-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-9 text-center text-charcoal-300 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={clsx(
                "h-9 w-9 flex items-center justify-center rounded-[var(--radius-sm)] text-sm font-medium transition-colors",
                p === currentPage
                  ? "bg-orchard-900 text-white"
                  : "border border-border-strong text-charcoal-900 hover:bg-linen-50"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="h-9 w-9 flex items-center justify-center rounded-[var(--radius-sm)] border border-border-strong text-charcoal-900 hover:bg-linen-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
