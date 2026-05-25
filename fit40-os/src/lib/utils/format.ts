export function formatWeight(kg: number): string {
  return kg.toFixed(1) + " kg";
}

export function formatKcal(kcal: number): string {
  return Math.round(kcal).toLocaleString("es-CL") + " kcal";
}

export function formatGrams(g: number): string {
  return Math.round(g) + "g";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDayName(dayIndex: number): string {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return days[dayIndex] ?? "";
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function muscleGroupLabel(group: string): string {
  const map: Record<string, string> = {
    chest: "Pecho", back: "Espalda", legs: "Piernas",
    shoulders: "Hombros", arms: "Brazos", core: "Core",
    glutes: "Glúteos", cardio: "Cardio",
  };
  return map[group] ?? group;
}
