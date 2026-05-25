import { TrendingUp, Minus, TrendingDown } from "lucide-react";
import type { ProgressionResult } from "@/lib/fitness/progression-logic";

interface ProgressionAlertProps {
  result: ProgressionResult;
}

export function ProgressionAlert({ result }: ProgressionAlertProps) {
  if (!result.flag) return null;

  const config = {
    increase: {
      icon: TrendingUp,
      classes: "bg-green/8 border-green/20 text-green",
    },
    maintain: {
      icon: Minus,
      classes: "bg-blue-info/8 border-blue-info/20 text-blue-info",
    },
    decrease: {
      icon: TrendingDown,
      classes: "bg-orange/8 border-orange/20 text-orange",
    },
  }[result.flag];

  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-3 flex items-start gap-2 ${config.classes}`}>
      <Icon size={14} className="flex-shrink-0 mt-0.5" />
      <p className="text-xs leading-relaxed">{result.message}</p>
    </div>
  );
}
