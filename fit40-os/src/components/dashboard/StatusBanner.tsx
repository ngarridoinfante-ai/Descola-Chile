import { cn } from "@/lib/utils/cn";
import type { WeightStatus } from "@/types/fit40.types";
import { getStatusDisplay } from "@/lib/fitness/weight-trends";
import { TrendingDown, Minus, TrendingUp, AlertTriangle } from "lucide-react";

interface StatusBannerProps {
  status: WeightStatus;
  goal: string;
}

const icons: Record<WeightStatus, React.ElementType> = {
  dropping_well: TrendingDown,
  stalled: Minus,
  dropping_fast: AlertTriangle,
  gaining: TrendingUp,
};

const bannerColors: Record<string, string> = {
  green: "bg-green/8 border-green/20 text-green",
  orange: "bg-orange/8 border-orange/20 text-orange",
  red: "bg-red-alert/8 border-red-alert/20 text-red-alert",
  blue: "bg-blue-info/8 border-blue-info/20 text-blue-info",
};

export function StatusBanner({ status, goal }: StatusBannerProps) {
  const display = getStatusDisplay(status, goal);
  const Icon = icons[status];
  const colorClass = bannerColors[display.color];

  return (
    <div className={cn("rounded-2xl border p-4 flex gap-3 items-start", colorClass)}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{display.label}</div>
        <div className="text-xs opacity-75 mt-0.5">{display.sublabel}</div>
        {display.recommendation && (
          <div className="text-xs mt-2 opacity-90 font-medium border-t border-current/20 pt-2">
            → {display.recommendation}
          </div>
        )}
      </div>
    </div>
  );
}
