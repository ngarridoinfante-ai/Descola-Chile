import type { DailyLog, WeeklyAverage, WeightStatus } from "@/types/fit40.types";

export function calcWeeklyAverage(logs: DailyLog[]): number | null {
  if (!logs || logs.length === 0) return null;
  const last7 = logs.slice(-7);
  const sum = last7.reduce((acc, l) => acc + l.weight_kg, 0);
  return sum / last7.length;
}

export function buildWeeklyAverages(logs: DailyLog[]): WeeklyAverage[] {
  if (!logs || logs.length === 0) return [];

  const sorted = [...logs].sort((a, b) => a.log_date.localeCompare(b.log_date));
  const weeks: Record<string, DailyLog[]> = {};

  for (const log of sorted) {
    const d = new Date(log.log_date + "T00:00:00");
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    const key = monday.toISOString().split("T")[0];
    if (!weeks[key]) weeks[key] = [];
    weeks[key].push(log);
  }

  return Object.entries(weeks).map(([week_start, weekLogs]) => ({
    week_start,
    avg_weight: weekLogs.reduce((s, l) => s + l.weight_kg, 0) / weekLogs.length,
    avg_calories: 0,
    avg_protein: 0,
  }));
}

export function getWeightStatus(
  currentWeekAvg: number | null,
  previousWeekAvg: number | null,
  goal: string
): WeightStatus {
  if (currentWeekAvg === null || previousWeekAvg === null) return "dropping_well";

  const pctChange = ((currentWeekAvg - previousWeekAvg) / previousWeekAvg) * 100;

  if (goal === "cut") {
    if (pctChange > 0.1) return "gaining";
    if (Math.abs(pctChange) < 0.2) return "stalled";
    if (pctChange < -1.0) return "dropping_fast";
    return "dropping_well";
  }

  if (goal === "lean_bulk") {
    if (pctChange > 0.5) return "gaining";
    if (pctChange < -0.1) return "dropping_fast";
    return "dropping_well";
  }

  // recomp
  if (Math.abs(pctChange) < 0.3) return "dropping_well";
  if (pctChange > 0.5) return "gaining";
  return "stalled";
}

export interface StatusDisplay {
  label: string;
  sublabel: string;
  color: "green" | "orange" | "red" | "blue";
  recommendation?: string;
}

export function getStatusDisplay(status: WeightStatus, goal: string): StatusDisplay {
  switch (status) {
    case "dropping_well":
      return {
        label: "Bajando bien",
        sublabel: "Progreso en rango óptimo",
        color: "green",
      };
    case "stalled":
      return {
        label: "Estancado",
        sublabel: "Sin cambio en 2 semanas",
        color: "orange",
        recommendation: "Reduce 150 kcal o agrega 20 min de cardio",
      };
    case "dropping_fast":
      return {
        label: "Bajando muy rápido",
        sublabel: "> 1% del peso por semana",
        color: "red",
        recommendation: "Sube 150-250 kcal para proteger músculo",
      };
    case "gaining":
      return {
        label: goal === "lean_bulk" ? "Subiendo" : "Subiendo de peso",
        sublabel: goal === "lean_bulk" ? "En rango de volumen" : "Revisa calorías",
        color: goal === "lean_bulk" ? "green" : "red",
      };
  }
}
