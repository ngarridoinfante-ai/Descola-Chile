"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_WORKOUT_PLAN, MOCK_SESSIONS } from "@/lib/mock-data";
import { muscleGroupLabel, todayISO, getDayName } from "@/lib/utils/format";
import { Dumbbell, Play, Calendar } from "lucide-react";

export default function TrainingPage() {
  const router = useRouter();
  const plan = MOCK_WORKOUT_PLAN;
  const todayISO_ = todayISO();
  const todaySession = MOCK_SESSIONS.find((s) => s.session_date === todayISO_);
  const [starting, setStarting] = useState(false);

  function startSession() {
    setStarting(true);
    const sessionId = todaySession?.id ?? `session-${Date.now()}`;
    setTimeout(() => router.push(`/training/${sessionId}`), 300);
  }

  const dayOfWeek = new Date().getDay();
  const isTrainingDay = plan.day_of_week.includes(dayOfWeek);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 animate-in">
      <TopBar
        title="Entrenamiento"
        subtitle={isTrainingDay ? "Día de entrenamiento" : "Día de descanso"}
      />

      {/* Plan info */}
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              Plan activo
            </div>
            <div className="font-bold text-text-primary">{plan.name}</div>
          </div>
          <Badge variant={isTrainingDay ? "green" : "neutral"}>
            {isTrainingDay ? "Hoy toca" : "Descanso"}
          </Badge>
        </div>
        <div className="flex gap-1 flex-wrap mb-4">
          {[0, 1, 2, 3, 4, 5, 6].map((d) => (
            <span
              key={d}
              className={`px-2 py-0.5 rounded-lg text-xs font-medium border ${
                plan.day_of_week.includes(d)
                  ? "bg-green/10 text-green border-green/20"
                  : "bg-elevated text-text-muted border-border"
              }`}
            >
              {getDayName(d)}
            </span>
          ))}
        </div>

        {/* Exercise list */}
        <div className="flex flex-col gap-2">
          {plan.exercises.map((ex) => (
            <div key={ex.id} className="flex items-center justify-between py-2 border-t border-border">
              <div>
                <div className="text-sm font-medium text-text-primary">{ex.name}</div>
                <div className="text-xs text-text-muted">{muscleGroupLabel(ex.muscle_group)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-text-secondary tabular">
                  {ex.sets} × {ex.rep_min}–{ex.rep_max}
                </div>
                <div className="text-xs text-text-muted">series × reps</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      {isTrainingDay ? (
        <Button
          fullWidth
          size="lg"
          onClick={startSession}
          loading={starting}
          disabled={todaySession?.status === "completed"}
        >
          <Play size={18} />
          {todaySession?.status === "completed"
            ? "Sesión completada ✓"
            : todaySession?.status === "in_progress"
            ? "Continuar sesión"
            : "Iniciar sesión de hoy"}
        </Button>
      ) : (
        <div className="text-center py-6">
          <Calendar size={32} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary text-sm">Hoy es día de descanso.</p>
          <p className="text-text-muted text-xs mt-1">El próximo entrenamiento es el {
            (() => {
              const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
              const next = plan.day_of_week.find((d) => d > dayOfWeek) ?? plan.day_of_week[0];
              return days[next];
            })()
          }.</p>
        </div>
      )}

      {/* Recent sessions */}
      {MOCK_SESSIONS.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
            Sesiones recientes
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_SESSIONS.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="bg-card rounded-xl border border-border p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Dumbbell size={14} className="text-text-muted" />
                  <div>
                    <div className="text-sm text-text-primary font-medium">
                      {new Date(s.session_date + "T00:00:00").toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" })}
                    </div>
                    <div className="text-xs text-text-muted">{s.duration_min} min · RPE {s.overall_rpe}</div>
                  </div>
                </div>
                <Badge variant={s.status === "completed" ? "green" : "neutral"}>
                  {s.status === "completed" ? "Completado" : s.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-2" />
    </div>
  );
}
