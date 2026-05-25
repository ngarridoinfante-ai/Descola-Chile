import type { ExerciseLog, ProgressionFlag, SetLog } from "@/types/fit40.types";

export interface ProgressionResult {
  flag: ProgressionFlag;
  message: string;
  next_weight?: number;
}

export function evaluateProgression(
  exercise: ExerciseLog,
  rep_min: number,
  rep_max: number
): ProgressionResult {
  const sets = exercise.sets;
  if (!sets || sets.length === 0) return { flag: null, message: "" };

  const allReachedMax = sets.every((s) => s.reps_done >= rep_max);
  const allReachedMin = sets.every((s) => s.reps_done >= rep_min);
  const twoOrMoreBelowMin = sets.filter((s) => s.reps_done < rep_min).length >= 2;
  const avgRPE = sets.reduce((sum, s) => sum + s.rpe, 0) / sets.length;
  const currentWeight = sets[0]?.weight_kg ?? 0;

  if (allReachedMax && avgRPE <= 8) {
    const increment = currentWeight >= 80 ? 2.5 : 1.25;
    return {
      flag: "increase",
      message: `Completaste ${rep_max} reps en todas las series. Sube a ${(currentWeight + increment).toFixed(2).replace(".00", "")} kg la próxima sesión.`,
      next_weight: currentWeight + increment,
    };
  }

  if (twoOrMoreBelowMin || (avgRPE >= 9.5 && !allReachedMin)) {
    return {
      flag: "decrease",
      message: avgRPE >= 9.5
        ? "RPE muy alto. Baja la carga o reduce volumen en la próxima sesión."
        : "No alcanzaste el rango mínimo en 2+ series. Mantén o baja carga.",
    };
  }

  if (allReachedMin) {
    return {
      flag: "maintain",
      message: "Buen trabajo. Mantén la misma carga y busca completar más reps.",
    };
  }

  return {
    flag: "maintain",
    message: "Sigue trabajando en este peso hasta dominar el rango completo.",
  };
}

export function shouldDeload(recentRPEs: number[]): boolean {
  if (recentRPEs.length < 3) return false;
  const last3 = recentRPEs.slice(-3);
  return last3.every((r) => r >= 8.5);
}

export function getProgressionBadgeColor(flag: ProgressionFlag): string {
  if (flag === "increase") return "text-green";
  if (flag === "decrease") return "text-orange";
  return "text-text-secondary";
}
