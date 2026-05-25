interface MacroProgressBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color: string;
}

export function MacroProgressBar({ label, current, target, unit = "g", color }: MacroProgressBarProps) {
  const pct = Math.min(100, (current / target) * 100);
  const isOver = current > target;
  const isDone = pct >= 90;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">{label}</span>
        <span className={`text-xs font-bold tabular ${isOver ? "text-orange" : isDone ? "text-green" : "text-text-secondary"}`}>
          {Math.round(current)}{unit} / {Math.round(target)}{unit}
        </span>
      </div>
      <div className="h-2 bg-elevated rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isOver ? "bg-orange" : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
