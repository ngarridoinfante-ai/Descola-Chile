import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("skeleton rounded-xl", className)} />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
