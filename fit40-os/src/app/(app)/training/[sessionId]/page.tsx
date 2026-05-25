"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { SetLogger } from "@/components/training/SetLogger";
import { ProgressionAlert } from "@/components/training/ProgressionAlert";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MOCK_WORKOUT_PLAN, MOCK_SESSIONS } from "@/lib/mock-data";
import { evaluateProgression } from "@/lib/fitness/progression-logic";
import { muscleGroupLabel, todayISO } from "@/lib/utils/format";
import type { ExerciseLog, SetLog } from "@/types/fit40.types";
import { ChevronLeft, Check, Timer } from "lucide-react";
import Link from "next/link";

function buildInitialExercises(plan: typeof MOCK_WORKOUT_PLAN): ExerciseLog[] {
  return plan.exercises.map((ex) => ({
    id: `el-${ex.id}`,
    session_id: "",
    plan_exercise_id: ex.id,
    name: ex.name,
    muscle_group: ex.muscle_group,
    order_index: ex.order_index,
    progression_flag: null,
    sets: Array.from({ length: ex.sets }, (_, i) => ({
      id: `set-${ex.id}-${i + 1}`,
      exercise_log_id: `el-${ex.id}`,
      set_number: i + 1,
      reps_done: 0,
      weight_kg: 0,
      rpe: 0,
      rest_seconds: 120,
    })),
  }));
}

export default function SessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const plan = MOCK_WORKOUT_PLAN;
  const existingSession = MOCK_SESSIONS.find((s) => s.id === sessionId);

  const [exercises, setExercises] = useState<ExerciseLog[]>(
    existingSession?.exercises ?? buildInitialExercises(plan)
  );
  const [expanded, setExpanded] = useState<string | null>(exercises[0]?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(existingSession?.status === "completed");

  function updateSets(exId: string, sets: SetLog[]) {
    setExercises((prev) => prev.map((ex) => (ex.id === exId ? { ...ex, sets } : ex)));
  }

  function getProgressionForExercise(exId: string) {
    const ex = exercises.find((e) => e.id === exId);
    const planEx = plan.exercises.find((p) => `el-${p.id}` === exId);
    if (!ex || !planEx || !ex.sets.some((s) => s.reps_done > 0)) return null;
    return evaluateProgression(ex, planEx.rep_min, planEx.rep_max);
  }

  async function finishSession() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setDone(true);
    setSaving(false);
    // In production: save to Supabase
  }

  const totalSetsLogged = exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.reps_done > 0).length,
    0
  );

  return (
    <div className="flex flex-col gap-4 px-4 py-4 animate-in">
      <TopBar
        title="Sesión activa"
        subtitle={new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "short" })}
        rightAction={
          <Link
            href="/training"
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft size={16} /> Volver
          </Link>
        }
      />

      {done && (
        <div className="bg-green/10 border border-green/20 rounded-2xl p-4 text-center glow-green">
          <Check size={24} className="text-green mx-auto mb-2" />
          <div className="font-bold text-green">¡Sesión completada!</div>
          <div className="text-sm text-text-secondary mt-1">
            {totalSetsLogged} series registradas
          </div>
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => router.push("/training")}>
            Volver al entrenamiento
          </Button>
        </div>
      )}

      {/* Progress bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">{totalSetsLogged} series registradas</span>
        <div className="flex items-center gap-2">
          <Timer size={12} className="text-text-muted" />
          <span className="text-xs text-text-muted">{plan.name}</span>
        </div>
      </div>

      {/* Exercises */}
      {exercises.map((ex) => {
        const planEx = plan.exercises.find((p) => `el-${p.id}` === ex.id);
        const progression = getProgressionForExercise(ex.id);
        const isExpanded = expanded === ex.id;
        const setsLogged = ex.sets.filter((s) => s.reps_done > 0).length;

        return (
          <Card key={ex.id} padding="none">
            <button
              onClick={() => setExpanded(isExpanded ? null : ex.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-elevated border border-border text-xs font-bold text-text-muted flex-shrink-0 mt-0.5">
                  {ex.order_index}
                </div>
                <div>
                  <div className="font-semibold text-text-primary text-sm">{ex.name}</div>
                  <div className="text-xs text-text-muted">
                    {muscleGroupLabel(ex.muscle_group)} · {planEx ? `${planEx.sets}×${planEx.rep_min}-${planEx.rep_max}` : ""}
                  </div>
                </div>
              </div>
              <Badge variant={setsLogged === ex.sets.length ? "green" : setsLogged > 0 ? "blue" : "neutral"}>
                {setsLogged}/{ex.sets.length}
              </Badge>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 flex flex-col gap-3 border-t border-border pt-3">
                <SetLogger
                  exerciseId={ex.id}
                  sets={ex.sets}
                  repMin={planEx?.rep_min ?? 6}
                  repMax={planEx?.rep_max ?? 12}
                  onChange={(sets) => updateSets(ex.id, sets)}
                />
                {progression && <ProgressionAlert result={progression} />}
              </div>
            )}
          </Card>
        );
      })}

      {!done && (
        <Button fullWidth size="lg" onClick={finishSession} loading={saving}>
          <Check size={18} />
          Finalizar sesión
        </Button>
      )}

      <div className="h-2" />
    </div>
  );
}
