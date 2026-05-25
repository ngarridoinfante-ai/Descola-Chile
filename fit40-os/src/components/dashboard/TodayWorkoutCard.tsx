import Link from "next/link";
import { Dumbbell, ChevronRight, CheckCircle2 } from "lucide-react";
import type { WorkoutSession, WorkoutPlan, SetLog } from "@/types/fit40.types";
import { Badge } from "@/components/ui/Badge";

interface TodayWorkoutCardProps {
  session?: WorkoutSession;
  plan?: WorkoutPlan;
}

export function TodayWorkoutCard({ session, plan }: TodayWorkoutCardProps) {
  const isCompleted = session?.status === "completed";
  const isInProgress = session?.status === "in_progress";

  if (!plan && !session) {
    return (
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <Dumbbell size={16} className="text-text-muted" />
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Hoy
          </span>
        </div>
        <p className="text-sm text-text-secondary">Día de descanso. Recupera bien.</p>
      </div>
    );
  }

  const exercises = plan?.exercises ?? session?.exercises ?? [];

  return (
    <Link href={session ? `/training/${session.id}` : "/training"}>
      <div className="bg-card rounded-2xl border border-border p-4 active:scale-[0.98] transition-transform">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Dumbbell size={16} className={isCompleted ? "text-green" : "text-text-secondary"} />
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Entrenamiento de hoy
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isCompleted && <Badge variant="green">Completado</Badge>}
            {isInProgress && <Badge variant="blue">En curso</Badge>}
            {!isCompleted && !isInProgress && <ChevronRight size={16} className="text-text-muted" />}
          </div>
        </div>

        <div className="font-semibold text-text-primary text-sm mb-2">
          {plan?.name ?? "Sesión personalizada"}
        </div>

        <div className="flex flex-col gap-1.5">
          {(exercises as Array<{ id?: string; name: string; sets?: number | SetLog[]; rep_min?: number; rep_max?: number }>).slice(0, 4).map((ex, i) => (
            <div key={ex.id ?? i} className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                {typeof ex.sets === "number"
                  ? `${ex.sets}×${ex.rep_min}-${ex.rep_max}`
                  : `${Array.isArray(ex.sets) ? ex.sets.length : 0} series`}{" "}
                {ex.name}
              </span>
              {isCompleted && <CheckCircle2 size={12} className="text-green opacity-60" />}
            </div>
          ))}
          {exercises.length > 4 && (
            <span className="text-xs text-text-muted">+{exercises.length - 4} más</span>
          )}
        </div>
      </div>
    </Link>
  );
}
