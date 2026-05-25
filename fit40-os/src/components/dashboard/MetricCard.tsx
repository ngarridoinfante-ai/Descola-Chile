import { cn } from "@/lib/utils/cn";

type Color = "green" | "orange" | "blue" | "neutral";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: Color;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "flat";
}

const colorStyles: Record<Color, { value: string; sub: string; dot: string }> = {
  green: { value: "text-green tabular", sub: "text-green-dim", dot: "bg-green" },
  orange: { value: "text-orange tabular", sub: "text-orange", dot: "bg-orange" },
  blue: { value: "text-blue-info tabular", sub: "text-blue-info", dot: "bg-blue-info" },
  neutral: { value: "text-text-primary tabular", sub: "text-text-secondary", dot: "bg-text-muted" },
};

export function MetricCard({ label, value, sub, color = "neutral", icon, trend }: MetricCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border p-4 flex flex-col gap-1",
        color === "green" && "glow-green border-green/15",
        color === "orange" && "glow-orange border-orange/15"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className={cn("opacity-60", styles.sub)}>{icon}</span>}
      </div>
      <div className="flex items-end gap-1.5">
        <span className={cn("text-2xl font-bold leading-none mt-1", styles.value)}>
          {value}
        </span>
        {trend && (
          <span className={cn("text-sm pb-0.5", trend === "up" ? "text-red-alert" : trend === "down" ? "text-green" : "text-text-muted")}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      {sub && (
        <span className={cn("text-xs mt-0.5", styles.sub)}>{sub}</span>
      )}
    </div>
  );
}
