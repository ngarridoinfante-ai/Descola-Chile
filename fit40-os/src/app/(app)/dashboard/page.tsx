"use client";
import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { AIRecommendation } from "@/components/dashboard/AIRecommendation";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { WeightLogger } from "@/components/dashboard/WeightLogger";
import {
  MOCK_PROFILE,
  MOCK_WEIGHT_LOGS,
  MOCK_NUTRITION_LOGS,
  MOCK_WORKOUT_PLAN,
  MOCK_SESSIONS,
  MOCK_AI_RECOMMENDATION,
} from "@/lib/mock-data";
import { calculateTargets, estimateBodyFatPct } from "@/lib/fitness/calorie-calc";
import { calcWeeklyAverage, getWeightStatus } from "@/lib/fitness/weight-trends";
import { formatWeight, todayISO } from "@/lib/utils/format";
import { Scale, Flame, Beef } from "lucide-react";

export default function DashboardPage() {
  const profile = MOCK_PROFILE;
  const logs = MOCK_WEIGHT_LOGS;
  const todayISO_ = todayISO();

  const [todayWeight, setTodayWeight] = useState<number | undefined>(
    logs.find((l) => l.log_date === todayISO_)?.weight_kg
  );

  const currentWeight = todayWeight ?? profile.current_weight_kg;
  const targets = calculateTargets(profile, currentWeight);

  const lastWeekLogs = logs.slice(-14, -7);
  const thisWeekLogs = logs.slice(-7);
  const prevAvg = calcWeeklyAverage(lastWeekLogs);
  const currAvg = calcWeeklyAverage(thisWeekLogs);
  const status = getWeightStatus(currAvg, prevAvg, profile.goal);

  const todayNutrition = MOCK_NUTRITION_LOGS.find((n) => n.log_date === todayISO_);
  const todaySession = MOCK_SESSIONS.find((s) => s.session_date === todayISO_);
  const todayPlan = MOCK_WORKOUT_PLAN;

  const bodyFat = profile.body_fat_pct ?? estimateBodyFatPct(currentWeight, profile.height_cm, profile.age);

  const dayOfWeek = new Date().getDay();
  const isTrainingDay = profile.training_days.includes(dayOfWeek);

  async function handleSaveWeight(weight: number) {
    setTodayWeight(weight);
    // In production: await supabase insert/upsert
  }

  const greeting =
    new Date().getHours() < 12 ? "Buenos días" : new Date().getHours() < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="flex flex-col gap-4 px-4 py-4 animate-in">
      <TopBar
        title={`${greeting}, ${profile.name} 💪`}
        subtitle={new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
      />

      {/* Weight logger */}
      <WeightLogger todayWeight={todayWeight} onSave={handleSaveWeight} />

      {/* Status */}
      <StatusBanner status={status} goal={profile.goal} />

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Peso actual"
          value={formatWeight(currentWeight)}
          sub={currAvg ? `Promedio: ${formatWeight(currAvg)}` : "Sin datos esta semana"}
          color="green"
          icon={<Scale size={14} />}
          trend={currAvg && prevAvg ? (currAvg < prevAvg ? "down" : "up") : undefined}
        />
        <MetricCard
          label="% Grasa est."
          value={`${bodyFat.toFixed(1)}%`}
          sub={`Meta: ${profile.goal === "cut" ? "< 15%" : "Mantener"}`}
          color="neutral"
        />
        <MetricCard
          label="Calorías objetivo"
          value={targets.calories.toLocaleString("es-CL")}
          sub={`kcal / día`}
          color="blue"
          icon={<Flame size={14} />}
        />
        <MetricCard
          label="Proteína objetivo"
          value={`${targets.protein_g}g`}
          sub={`${(targets.protein_g / currentWeight).toFixed(1)} g/kg`}
          color={todayNutrition && todayNutrition.protein_g >= targets.protein_g * 0.9 ? "green" : "neutral"}
          icon={<Beef size={14} />}
        />
      </div>

      {/* Today's macros if logged */}
      {todayNutrition && (
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Nutrición de hoy
            </span>
            <span className="text-xs text-green font-medium">
              {todayNutrition.calories} / {targets.calories} kcal
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Proteína", value: `${Math.round(todayNutrition.protein_g)}g`, target: targets.protein_g, color: "text-green" },
              { label: "Carbs", value: `${Math.round(todayNutrition.carbs_g)}g`, target: targets.carbs_g, color: "text-blue-info" },
              { label: "Grasas", value: `${Math.round(todayNutrition.fat_g)}g`, target: targets.fat_g, color: "text-orange" },
            ].map(({ label, value, target, color }) => (
              <div key={label} className="bg-elevated rounded-xl p-2">
                <div className={`text-base font-bold tabular ${color}`}>{value}</div>
                <div className="text-[10px] text-text-muted mt-0.5">{label}</div>
                <div className="h-1 rounded-full bg-border mt-2">
                  <div
                    className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
                    style={{ width: `${Math.min(100, (parseFloat(value) / target) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout card */}
      {isTrainingDay ? (
        <TodayWorkoutCard session={todaySession} plan={todayPlan} />
      ) : (
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary text-center py-1">
            🛌 Día de descanso — Recupera, come bien y duerme 7-9h
          </p>
        </div>
      )}

      {/* AI Recommendation */}
      <AIRecommendation recommendation={MOCK_AI_RECOMMENDATION} />

      <div className="h-2" />
    </div>
  );
}
