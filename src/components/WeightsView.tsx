"use client";

import { useState } from "react";
import { Weight } from "lucide-react";

import { BackHeader } from "@/components/BackHeader";
import { weightButtonId } from "@/components/ExerciseItem";
import { WeightDialog } from "@/components/WeightDialog";
import { WEIGHT_GROUPS } from "@/data/workouts";
import { useWorkoutProgress } from "@/hooks/useWorkoutProgress";
import { formatKg, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ExerciseId } from "@/types/workout";

/** Row ids are prefixed so they never clash with plan rows that share an exercise. */
const rowId = (exerciseId: ExerciseId) => `weights/${exerciseId}`;

function LoadingSkeleton() {
  return (
    <div aria-hidden className="animate-pulse space-y-6">
      <div className="h-5 w-48 rounded bg-card" />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 w-20 rounded bg-card" />
          <div className="h-[232px] rounded-2xl bg-card" />
        </div>
      ))}
    </div>
  );
}

export function WeightsView() {
  const { hydrated, weightFor, setWeight } = useWorkoutProgress();
  const [open, setOpen] = useState(false);
  // Kept after closing so the dialog still has content while it animates out.
  const [editing, setEditing] = useState<{
    id: string;
    exerciseId: ExerciseId;
    name: string;
    session: number;
  } | null>(null);

  const anyLogged = WEIGHT_GROUPS.some((group) => group.exercises.some((e) => weightFor(e.id)));

  const edit = (exerciseId: ExerciseId, name: string) => {
    setEditing((prev) => ({ id: rowId(exerciseId), exerciseId, name, session: (prev?.session ?? 0) + 1 }));
    setOpen(true);
  };

  return (
    <>
      <BackHeader title="My weights" />

      <div className="mt-8">
        {!hydrated ? (
          <LoadingSkeleton />
        ) : (
          <div className="animate-rise-in space-y-7">
            {!anyLogged && (
              <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.06] p-4">
                <Weight className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Hold an exercise in a plan, or tap a row here, to log a weight.
                </p>
              </div>
            )}

            {WEIGHT_GROUPS.map((group) => (
              <section key={group.id} aria-labelledby={`group-${group.id}`}>
                <h2
                  id={`group-${group.id}`}
                  className="mb-3 text-[11px] font-bold tracking-widest text-muted-foreground uppercase"
                >
                  {group.name}
                </h2>
                <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                  {group.exercises.map((exercise) => {
                    const weight = weightFor(exercise.id);
                    return (
                      <li key={exercise.id}>
                        <button
                          type="button"
                          id={weightButtonId(rowId(exercise.id))}
                          onClick={() => edit(exercise.id, exercise.name)}
                          aria-label={
                            weight
                              ? `${exercise.name}: ${formatKg(weight.kg)} kg, edit weight`
                              : `Log weight for ${exercise.name}`
                          }
                          className="flex min-h-14 w-full items-center gap-3 px-4 py-2.5 text-left outline-none transition-colors hover:bg-white/[0.03] focus-visible:bg-primary/[0.06] focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:ring-inset active:bg-white/[0.05]"
                        >
                          <span className="min-w-0 flex-1 text-[15px] leading-snug font-semibold">
                            {exercise.name}
                          </span>
                          <span className="shrink-0 text-right">
                            <span
                              className={cn(
                                "block text-base font-black tabular-nums",
                                weight ? "text-primary" : "text-muted-foreground/60",
                              )}
                            >
                              {weight ? (
                                <>
                                  {formatKg(weight.kg)}
                                  <span className="ml-0.5 text-xs font-semibold opacity-80">kg</span>
                                </>
                              ) : (
                                "—"
                              )}
                            </span>
                            <span className="block text-[11px] text-muted-foreground">
                              {weight ? `Updated ${formatShortDate(weight.updatedAt)}` : "Not logged"}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <WeightDialog
        open={open}
        onOpenChange={setOpen}
        exercise={editing}
        weight={editing ? weightFor(editing.exerciseId) : null}
        onSave={(kg) => editing && setWeight(editing.exerciseId, kg)}
      />
    </>
  );
}
