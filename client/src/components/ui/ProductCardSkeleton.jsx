export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-[var(--radius-lg)] border border-border overflow-hidden h-full animate-pulse">
      <div className="aspect-square bg-linen-50" />
      <div className="flex flex-col flex-1 p-3 gap-2">
        <div className="h-2.5 w-1/3 bg-linen-50 rounded" />
        <div className="h-4 w-full bg-linen-50 rounded" />
        <div className="h-4 w-2/3 bg-linen-50 rounded" />
        <div className="h-3 w-1/4 bg-linen-50 rounded mt-1" />
        <div className="h-9 w-full bg-linen-50 rounded-[var(--radius-md)] mt-3" />
      </div>
    </div>
  );
}
