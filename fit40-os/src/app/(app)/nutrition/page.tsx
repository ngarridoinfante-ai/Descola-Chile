"use client";
import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MacroProgressBar } from "@/components/nutrition/MacroProgressBar";
import { TextArea } from "@/components/ui/Input";
import { MOCK_PROFILE, MOCK_NUTRITION_LOGS } from "@/lib/mock-data";
import { calculateTargets } from "@/lib/fitness/calorie-calc";
import { todayISO } from "@/lib/utils/format";
import { Sparkles, UtensilsCrossed, AlertCircle } from "lucide-react";

interface MacroResult {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  calories: number;
  notes: string;
}

export default function NutritionPage() {
  const profile = MOCK_PROFILE;
  const targets = calculateTargets(profile, profile.current_weight_kg);
  const todayISO_ = todayISO();

  const existing = MOCK_NUTRITION_LOGS.find((n) => n.log_date === todayISO_);
  const [foodText, setFoodText] = useState(existing?.food_text ?? "");
  const [macros, setMacros] = useState<MacroResult | null>(
    existing ? { protein_g: existing.protein_g, carbs_g: existing.carbs_g, fat_g: existing.fat_g, calories: existing.calories, notes: existing.ai_notes ?? "" } : null
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    if (!foodText.trim() || foodText.trim().length < 10) {
      setError("Escribe qué comiste con más detalle.");
      return;
    }
    setError("");
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food_text: foodText, user_weight_kg: profile.current_weight_kg }),
      });
      if (!res.ok) throw new Error("Error al analizar");
      const data = await res.json();
      setMacros(data);
    } catch {
      setError("No se pudo analizar. Verifica la API key o intenta más tarde.");
    } finally {
      setAnalyzing(false);
    }
  }

  const recent = MOCK_NUTRITION_LOGS.filter((n) => n.log_date !== todayISO_).slice(0, 3);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 animate-in">
      <TopBar
        title="Nutrición"
        subtitle={new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
      />

      {/* Targets summary */}
      <Card>
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Objetivos de hoy
        </div>
        <div className="grid grid-cols-4 gap-2 text-center mb-4">
          {[
            { label: "Proteína", value: targets.protein_g, color: "text-green", unit: "g" },
            { label: "Carbs", value: targets.carbs_g, color: "text-blue-info", unit: "g" },
            { label: "Grasas", value: targets.fat_g, color: "text-orange", unit: "g" },
            { label: "Calorías", value: targets.calories, color: "text-text-primary", unit: "kcal" },
          ].map(({ label, value, color, unit }) => (
            <div key={label} className="bg-elevated rounded-xl p-2">
              <div className={`text-sm font-bold tabular ${color}`}>{value}</div>
              <div className="text-[10px] text-text-muted">{label}</div>
            </div>
          ))}
        </div>

        {macros && (
          <div className="flex flex-col gap-3">
            <MacroProgressBar label="Proteína" current={macros.protein_g} target={targets.protein_g} color="bg-green" />
            <MacroProgressBar label="Carbohidratos" current={macros.carbs_g} target={targets.carbs_g} color="bg-blue-info" />
            <MacroProgressBar label="Grasas" current={macros.fat_g} target={targets.fat_g} color="bg-orange" />
            <MacroProgressBar label="Calorías" current={macros.calories} target={targets.calories} unit=" kcal" color="bg-text-secondary" />
          </div>
        )}
      </Card>

      {/* Food logger */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <UtensilsCrossed size={14} className="text-text-secondary" />
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            ¿Qué comiste hoy?
          </div>
        </div>
        <TextArea
          value={foodText}
          onChange={(e) => setFoodText(e.target.value)}
          placeholder="Ej: 3 huevos revueltos, 200g pechuga de pollo, arroz integral 150g, 1 scoop whey, yogurt proteico..."
          rows={4}
          error={error}
        />
        <Button
          fullWidth
          onClick={analyze}
          loading={analyzing}
          className="mt-3"
        >
          <Sparkles size={16} />
          Analizar con IA
        </Button>
      </Card>

      {/* AI result */}
      {macros && (
        <Card glow="green">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Estimación de macros
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { label: "Proteína", value: `${Math.round(macros.protein_g)}g`, color: "text-green" },
              { label: "Carbohidratos", value: `${Math.round(macros.carbs_g)}g`, color: "text-blue-info" },
              { label: "Grasas", value: `${Math.round(macros.fat_g)}g`, color: "text-orange" },
              { label: "Calorías", value: `${Math.round(macros.calories)} kcal`, color: "text-text-primary" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-elevated rounded-xl p-3">
                <div className={`text-xl font-bold tabular ${color}`}>{value}</div>
                <div className="text-xs text-text-muted mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          {macros.notes && (
            <div className="flex items-start gap-2 bg-elevated rounded-xl p-3">
              <AlertCircle size={13} className="text-text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary leading-relaxed">{macros.notes}</p>
            </div>
          )}
        </Card>
      )}

      {/* Recent days */}
      {recent.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
            Días anteriores
          </div>
          <div className="flex flex-col gap-2">
            {recent.map((n) => (
              <div key={n.id} className="bg-card rounded-xl border border-border p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-secondary">
                    {new Date(n.log_date + "T00:00:00").toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <span className="text-xs font-bold tabular text-text-primary">{Math.round(n.calories)} kcal</span>
                </div>
                <div className="flex gap-3 text-xs text-text-muted tabular">
                  <span><span className="text-green font-semibold">{Math.round(n.protein_g)}g</span> prot</span>
                  <span><span className="text-blue-info font-semibold">{Math.round(n.carbs_g)}g</span> carbs</span>
                  <span><span className="text-orange font-semibold">{Math.round(n.fat_g)}g</span> grasas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-2" />
    </div>
  );
}
