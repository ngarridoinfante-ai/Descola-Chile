"use client";
import { useState } from "react";
import { Scale, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WeightLoggerProps {
  todayWeight?: number;
  onSave: (weight: number) => Promise<void>;
}

export function WeightLogger({ todayWeight, onSave }: WeightLoggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(todayWeight?.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(!!todayWeight);

  async function handleSave() {
    const w = parseFloat(value);
    if (isNaN(w) || w < 30 || w > 300) return;
    setLoading(true);
    try {
      await onSave(w);
      setSaved(true);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-card rounded-2xl border border-border p-4 flex items-center justify-between active:scale-[0.98] transition-transform text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-elevated border border-border">
            <Scale size={16} className={saved ? "text-green" : "text-text-secondary"} />
          </div>
          <div>
            <div className="text-sm font-medium text-text-primary">
              {saved ? `${value} kg registrado` : "Registrar peso hoy"}
            </div>
            <div className="text-xs text-text-muted">
              {saved ? "Toca para editar" : "Añade tu peso de esta mañana"}
            </div>
          </div>
        </div>
        {saved ? (
          <Check size={16} className="text-green flex-shrink-0" />
        ) : (
          <Plus size={16} className="text-text-muted flex-shrink-0" />
        )}
      </button>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-green/20 p-4 glow-green">
      <div className="flex items-center gap-2 mb-4">
        <Scale size={16} className="text-green" />
        <span className="text-sm font-semibold text-text-primary">Peso de hoy (kg)</span>
      </div>
      <div className="flex gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="88.5"
          step="0.1"
          min="30"
          max="300"
          autoFocus
          className="flex-1 bg-elevated border border-border rounded-xl px-4 h-11 text-text-primary text-lg font-bold tabular focus:outline-none focus:border-green/60 focus:ring-1 focus:ring-green/20 transition-colors"
        />
        <Button onClick={handleSave} loading={loading} size="md">
          Guardar
        </Button>
        <Button variant="ghost" size="md" onClick={() => setIsOpen(false)}>
          ✕
        </Button>
      </div>
    </div>
  );
}
