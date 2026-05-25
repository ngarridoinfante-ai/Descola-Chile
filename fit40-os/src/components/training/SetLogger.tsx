"use client";
import { useState } from "react";
import type { SetLog } from "@/types/fit40.types";
import { RPEPicker } from "./RPEPicker";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

interface SetLoggerProps {
  exerciseId: string;
  sets: SetLog[];
  repMin: number;
  repMax: number;
  onChange: (sets: SetLog[]) => void;
}

function emptySet(exerciseId: string, setNumber: number, prevWeight?: number): SetLog {
  return {
    id: `set-${Date.now()}-${setNumber}`,
    exercise_log_id: exerciseId,
    set_number: setNumber,
    reps_done: 0,
    weight_kg: prevWeight ?? 0,
    rpe: 0,
    rest_seconds: 120,
  };
}

export function SetLogger({ exerciseId, sets, repMin, repMax, onChange }: SetLoggerProps) {
  const [activeRPESet, setActiveRPESet] = useState<string | null>(null);

  function updateSet(id: string, field: keyof SetLog, value: number) {
    onChange(sets.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function addSet() {
    const last = sets[sets.length - 1];
    onChange([...sets, emptySet(exerciseId, sets.length + 1, last?.weight_kg)]);
  }

  function removeSet(id: string) {
    onChange(sets.filter((s) => s.id !== id));
  }

  function repColor(reps: number): string {
    if (reps === 0) return "text-text-muted";
    if (reps >= repMax) return "text-green";
    if (reps >= repMin) return "text-blue-info";
    return "text-orange";
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="grid grid-cols-[32px_1fr_1fr_48px_28px] gap-2 px-1">
        {["#", "Reps", "Peso (kg)", "RPE", ""].map((h, i) => (
          <span key={i} className="text-[10px] font-semibold text-text-muted uppercase tracking-wider text-center">
            {h}
          </span>
        ))}
      </div>

      {sets.map((set) => (
        <div key={set.id} className="flex flex-col gap-1">
          <div className="grid grid-cols-[32px_1fr_1fr_48px_28px] gap-2 items-center bg-elevated rounded-xl px-2 py-2">
            <span className="text-xs font-bold text-text-muted text-center">{set.set_number}</span>

            <input
              type="number"
              value={set.reps_done || ""}
              onChange={(e) => updateSet(set.id, "reps_done", Number(e.target.value))}
              placeholder={`${repMin}-${repMax}`}
              min="1" max="50"
              className={`w-full bg-transparent border-b border-border text-center text-sm font-bold focus:outline-none focus:border-green/60 transition-colors py-0.5 tabular ${repColor(set.reps_done)}`}
            />

            <input
              type="number"
              value={set.weight_kg || ""}
              onChange={(e) => updateSet(set.id, "weight_kg", Number(e.target.value))}
              placeholder="0"
              min="0" max="500" step="0.5"
              className="w-full bg-transparent border-b border-border text-center text-sm font-bold text-text-primary focus:outline-none focus:border-green/60 transition-colors py-0.5 tabular"
            />

            <button
              onClick={() => setActiveRPESet(activeRPESet === set.id ? null : set.id)}
              className={`text-xs font-bold rounded-lg h-7 border transition-colors ${
                set.rpe > 0
                  ? set.rpe >= 9 ? "bg-red-alert/20 text-red-alert border-red-alert/30"
                    : set.rpe >= 7 ? "bg-orange/20 text-orange border-orange/30"
                    : "bg-green/20 text-green border-green/30"
                  : "bg-elevated border-border text-text-muted"
              }`}
            >
              {set.rpe > 0 ? set.rpe : "RPE"}
            </button>

            <button
              onClick={() => removeSet(set.id)}
              className="flex items-center justify-center text-text-muted hover:text-red-alert transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>

          {activeRPESet === set.id && (
            <div className="bg-elevated rounded-xl p-3">
              <RPEPicker
                value={set.rpe}
                onChange={(v) => { updateSet(set.id, "rpe", v); setActiveRPESet(null); }}
              />
            </div>
          )}
        </div>
      ))}

      <Button variant="ghost" size="sm" onClick={addSet} className="self-start gap-1.5">
        <Plus size={14} /> Agregar serie
      </Button>
    </div>
  );
}
