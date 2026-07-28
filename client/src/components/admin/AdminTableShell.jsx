import { Inbox } from "lucide-react";

export default function AdminTableShell({ children, isEmpty, emptyMessage = "No records found" }) {
  return (
    <div className="bg-white border border-border rounded-[var(--radius-lg)] overflow-hidden">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="h-12 w-12 rounded-full bg-linen-50 flex items-center justify-center mb-3">
            <Inbox size={22} className="text-charcoal-300" />
          </div>
          <p className="text-sm text-charcoal-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">{children}</div>
      )}
    </div>
  );
}
