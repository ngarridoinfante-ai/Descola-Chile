"use client";
import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFILE } from "@/lib/mock-data";
import { calculateTargets, calculateTDEE } from "@/lib/fitness/calorie-calc";
import type { Goal, Level, ActivityLevel } from "@/types/fit40.types";
import { User, Target, Activity, Check } from "lucide-react";

type Step = 1 | 2 | 3;

const GOALS: { value: Goal; label: string; desc: string }[] = [
  { value: "cut", label: "Definición", desc: "Bajar grasa manteniendo músculo" },
  { value: "recomp", label: "Recomposición", desc: "Bajar grasa y ganar músculo simultáneo" },
  { value: "lean_bulk", label: "Volumen limpio", desc: "Ganar músculo con mínima grasa" },
];

const LEVELS: { value: Level; label: string }[] = [
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
];

const ACTIVITIES: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: "sedentary", label: "Sedentario", desc: "Trabajo de oficina, sin ejercicio" },
  { value: "light", label: "Ligero", desc: "Ejercicio 1-3 días/semana" },
  { value: "moderate", label: "Moderado", desc: "Ejercicio 3-5 días/semana" },
  { value: "active", label: "Activo", desc: "Ejercicio 6-7 días/semana" },
  { value: "very_active", label: "Muy activo", desc: "Trabajo físico + entrenamiento" },
];

const TRAINING_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function ProfilePage() {
  const [step, setStep] = useState<Step>(1);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(MOCK_PROFILE);

  function update<K extends keyof typeof profile>(key: K, value: typeof profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function toggleDay(day: number) {
    setProfile((p) => ({
      ...p,
      training_days: p.training_days.includes(day)
        ? p.training_days.filter((d) => d !== day)
        : [...p.training_days, day].sort(),
    }));
  }

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2500);
    // In production: upsert to Supabase
  }

  const targets = calculateTargets(profile, profile.current_weight_kg);
  const tdee = calculateTDEE(profile, profile.current_weight_kg);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 animate-in">
      <TopBar title="Perfil físico" subtitle="Tu información y objetivos" />

      {/* Step nav */}
      <div className="flex gap-2">
        {([1, 2, 3] as Step[]).map((s) => {
          const icons = [User, Target, Activity];
          const labels = ["Personal", "Objetivo", "Entrenamiento"];
          const Icon = icons[s - 1];
          return (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                step === s
                  ? "bg-green/10 border-green/30 text-green"
                  : "bg-card border-border text-text-muted hover:border-border-bright"
              }`}
            >
              <Icon size={13} /> {labels[s - 1]}
            </button>
          );
        })}
      </div>

      {/* Step 1: Datos personales */}
      {step === 1 && (
        <Card>
          <div className="flex flex-col gap-4">
            <Input label="Nombre" value={profile.name} onChange={(e) => update("name", e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Edad" type="number" value={profile.age} onChange={(e) => update("age", Number(e.target.value))} unit="años" />
              <Input label="Altura" type="number" value={profile.height_cm} onChange={(e) => update("height_cm", Number(e.target.value))} unit="cm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Peso inicial" type="number" step="0.1" value={profile.start_weight_kg} onChange={(e) => update("start_weight_kg", Number(e.target.value))} unit="kg" />
              <Input label="Peso actual" type="number" step="0.1" value={profile.current_weight_kg} onChange={(e) => update("current_weight_kg", Number(e.target.value))} unit="kg" />
            </div>
            <Input label="% Grasa aprox." type="number" step="0.5" value={profile.body_fat_pct ?? ""} onChange={(e) => update("body_fat_pct", Number(e.target.value))} unit="%" />
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider block mb-2">Lesiones o limitaciones</label>
              <textarea
                value={profile.injuries}
                onChange={(e) => update("injuries", e.target.value)}
                placeholder="Ej: molestia en hombro, rodilla operada..."
                rows={2}
                className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green/60 focus:ring-1 focus:ring-green/20 transition-colors resize-none text-sm"
              />
            </div>
            <Button fullWidth onClick={() => setStep(2)}>Siguiente →</Button>
          </div>
        </Card>
      )}

      {/* Step 2: Objetivo */}
      {step === 2 && (
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">Objetivo principal</div>
          {GOALS.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => update("goal", value)}
              className={`w-full text-left rounded-2xl border p-4 transition-all ${
                profile.goal === value
                  ? "bg-green/8 border-green/30 glow-green"
                  : "bg-card border-border hover:border-border-bright"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-text-primary">{label}</div>
                {profile.goal === value && <Check size={16} className="text-green" />}
              </div>
              <div className="text-xs text-text-secondary mt-1">{desc}</div>
            </button>
          ))}

          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1 mt-2">Nivel de experiencia</div>
          <div className="flex gap-2">
            {LEVELS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => update("level", value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  profile.level === value
                    ? "bg-blue-info/10 border-blue-info/30 text-blue-info"
                    : "bg-card border-border text-text-muted hover:border-border-bright"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1 mt-2">Actividad diaria</div>
          {ACTIVITIES.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => update("activity_level", value)}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                profile.activity_level === value
                  ? "bg-blue-info/8 border-blue-info/30"
                  : "bg-card border-border hover:border-border-bright"
              }`}
            >
              <div className={`text-sm font-medium ${profile.activity_level === value ? "text-blue-info" : "text-text-primary"}`}>{label}</div>
              <div className="text-xs text-text-muted">{desc}</div>
            </button>
          ))}

          <div className="flex gap-2 mt-2">
            <Button variant="secondary" fullWidth onClick={() => setStep(1)}>← Atrás</Button>
            <Button fullWidth onClick={() => setStep(3)}>Siguiente →</Button>
          </div>
        </div>
      )}

      {/* Step 3: Entrenamiento + resumen */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <Card>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Días disponibles para entrenar
            </div>
            <div className="flex gap-2 flex-wrap">
              {TRAINING_DAYS.map((d, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all ${
                    profile.training_days.includes(i)
                      ? "bg-green/10 border-green/30 text-green"
                      : "bg-elevated border-border text-text-muted hover:border-border-bright"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-text-secondary">
              {profile.training_days.length} días seleccionados
            </div>
          </Card>

          {/* Calculated targets */}
          <Card glow="green">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Tus objetivos calculados
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "TDEE", value: `${Math.round(tdee)} kcal`, sub: "Mantenimiento" },
                { label: "Objetivo", value: `${targets.calories} kcal`, sub: profile.goal === "cut" ? "Déficit" : profile.goal === "lean_bulk" ? "Superávit" : "Mantención" },
                { label: "Proteína", value: `${targets.protein_g}g`, sub: `${(targets.protein_g / profile.current_weight_kg).toFixed(1)} g/kg` },
                { label: "Carbos", value: `${targets.carbs_g}g`, sub: "Objetivo diario" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-elevated rounded-xl p-3">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider">{label}</div>
                  <div className="text-lg font-bold text-green tabular mt-1">{value}</div>
                  <div className="text-xs text-text-secondary">{sub}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setStep(2)}>← Atrás</Button>
            <Button fullWidth onClick={save} loading={saving}>
              {saved ? <><Check size={16} /> Guardado</> : "Guardar perfil"}
            </Button>
          </div>
        </div>
      )}

      <div className="h-2" />
    </div>
  );
}
