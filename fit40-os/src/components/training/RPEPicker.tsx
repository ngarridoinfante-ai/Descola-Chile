"use client";

interface RPEPickerProps {
  value: number;
  onChange: (v: number) => void;
}

const RPE_LABELS: Record<number, string> = {
  1: "Muy fácil", 2: "Fácil", 3: "Moderado", 4: "Algo difícil",
  5: "Difícil", 6: "Difícil+", 7: "Muy difícil", 8: "Casi al límite",
  9: "Al límite", 10: "Máximo",
};

function rpeColor(rpe: number): string {
  if (rpe <= 4) return "bg-green/20 text-green border-green/30";
  if (rpe <= 6) return "bg-blue-info/20 text-blue-info border-blue-info/30";
  if (rpe <= 8) return "bg-orange/20 text-orange border-orange/30";
  return "bg-red-alert/20 text-red-alert border-red-alert/30";
}

export function RPEPicker({ value, onChange }: RPEPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${
              value === n
                ? rpeColor(n)
                : "bg-elevated border-border text-text-muted hover:border-border-bright"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-xs text-text-secondary">RPE {value} — {RPE_LABELS[value]}</span>
      )}
    </div>
  );
}
