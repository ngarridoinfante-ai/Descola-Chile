"use client";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, ReferenceLine,
} from "recharts";
import { MOCK_WEIGHT_LOGS, MOCK_NUTRITION_LOGS, MOCK_SESSIONS, MOCK_PROFILE } from "@/lib/mock-data";
import { buildWeeklyAverages } from "@/lib/fitness/weight-trends";
import { calculateTargets } from "@/lib/fitness/calorie-calc";
import { formatShortDate } from "@/lib/utils/format";

const CHART_COLORS = {
  green: "#00FF87",
  orange: "#FF6B35",
  blue: "#3D8EFF",
  muted: "#4A4A5A",
  grid: "#2A2A38",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-border rounded-xl px-3 py-2 text-xs">
      <div className="text-text-muted mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }} className="font-bold tabular">
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
        </div>
      ))}
    </div>
  );
}

export default function ProgressPage() {
  const profile = MOCK_PROFILE;
  const targets = calculateTargets(profile, profile.current_weight_kg);

  const weightData = MOCK_WEIGHT_LOGS.map((l) => ({
    date: formatShortDate(l.log_date),
    peso: l.weight_kg,
  }));

  const weeklyAvgs = buildWeeklyAverages(MOCK_WEIGHT_LOGS);
  const weeklyData = weeklyAvgs.map((w) => ({
    date: formatShortDate(w.week_start),
    promedio: parseFloat(w.avg_weight.toFixed(2)),
  }));

  const nutritionData = MOCK_NUTRITION_LOGS.map((n) => ({
    date: formatShortDate(n.log_date),
    prot: Math.round(n.protein_g),
    carbs: Math.round(n.carbs_g),
    kcal: Math.round(n.calories),
  }));

  const strengthData = MOCK_SESSIONS.flatMap((s) =>
    s.exercises
      .filter((ex) => ex.name === "Press Banca" && ex.sets.length > 0)
      .map((ex) => ({
        date: formatShortDate(s.session_date),
        peso: Math.max(...ex.sets.map((st) => st.weight_kg)),
        reps: ex.sets[0]?.reps_done ?? 0,
      }))
  );

  const weeksTotal = 12;
  const sessionsCompleted = MOCK_SESSIONS.filter((s) => s.status === "completed").length;
  const adherence = Math.round((sessionsCompleted / (weeksTotal * profile.training_days.length)) * 100);

  const stats = [
    { label: "Peso inicial", value: `${profile.start_weight_kg} kg` },
    { label: "Peso actual", value: `${profile.current_weight_kg} kg` },
    { label: "Pérdida total", value: `-${(profile.start_weight_kg - profile.current_weight_kg).toFixed(1)} kg`, color: "text-green" },
    { label: "Adherencia", value: `${adherence}%`, color: adherence >= 80 ? "text-green" : "text-orange" },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 py-4 animate-in">
      <TopBar title="Progreso" subtitle="Tu evolución en el tiempo" />

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-4">
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">{label}</div>
            <div className={`text-xl font-bold tabular ${color ?? "text-text-primary"}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Daily weight chart */}
      <Card>
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
          Peso diario (kg)
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={weightData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis dataKey="date" tick={{ fill: CHART_COLORS.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 10 }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="peso"
              name="Peso"
              stroke={CHART_COLORS.green}
              strokeWidth={2}
              dot={{ fill: CHART_COLORS.green, r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: CHART_COLORS.green }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Weekly average chart */}
      {weeklyData.length > 1 && (
        <Card>
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
            Promedio semanal (kg)
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={weeklyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="date" tick={{ fill: CHART_COLORS.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 10 }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="promedio"
                name="Promedio"
                stroke={CHART_COLORS.blue}
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ fill: CHART_COLORS.blue, r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Protein chart */}
      {nutritionData.length > 0 && (
        <Card>
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
            Proteína diaria (g)
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={nutritionData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: CHART_COLORS.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={targets.protein_g} stroke={CHART_COLORS.green} strokeDasharray="4 2" />
              <Bar dataKey="prot" name="Proteína" fill={CHART_COLORS.green} opacity={0.7} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-6 h-0.5 bg-green" style={{ borderTop: "2px dashed #00FF87" }} />
            <span className="text-[10px] text-text-muted">Objetivo: {targets.protein_g}g</span>
          </div>
        </Card>
      )}

      {/* Strength chart */}
      {strengthData.length > 0 && (
        <Card>
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
            Fuerza — Press Banca (kg)
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={strengthData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="date" tick={{ fill: CHART_COLORS.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 10 }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="peso"
                name="Carga (kg)"
                stroke={CHART_COLORS.orange}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.orange, r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Adherence */}
      <Card>
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Adherencia semanal
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2A2A38" strokeWidth="3.8" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={adherence >= 80 ? CHART_COLORS.green : CHART_COLORS.orange}
                strokeWidth="3.8"
                strokeDasharray={`${adherence} ${100 - adherence}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold tabular ${adherence >= 80 ? "text-green" : "text-orange"}`}>
                {adherence}%
              </span>
            </div>
          </div>
          <div>
            <div className="font-semibold text-text-primary">
              {sessionsCompleted} sesiones completadas
            </div>
            <div className="text-sm text-text-secondary mt-0.5">
              {profile.training_days.length} días / semana planificados
            </div>
            <div className={`text-xs mt-2 font-medium ${adherence >= 80 ? "text-green" : "text-orange"}`}>
              {adherence >= 80 ? "Excelente consistencia" : "Mejora la consistencia para mejores resultados"}
            </div>
          </div>
        </div>
      </Card>

      <div className="h-2" />
    </div>
  );
}
