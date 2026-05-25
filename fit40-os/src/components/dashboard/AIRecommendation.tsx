import { Sparkles } from "lucide-react";

interface AIRecommendationProps {
  recommendation: string;
}

export function AIRecommendation({ recommendation }: AIRecommendationProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green/10 border border-green/20">
          <Sparkles size={14} className="text-green" />
        </div>
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Recomendación del día
        </span>
      </div>
      <p className="text-sm text-text-primary leading-relaxed">{recommendation}</p>
    </div>
  );
}
