"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { ConfettiBurst } from "@/components/Celebration";
import { ConfirmResetButton } from "@/components/ConfirmResetButton";
import { useLevel } from "@/components/LevelTheme";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { CycleProgress, DayProgress } from "@/hooks/useWorkoutProgress";
import type { WorkoutPlan } from "@/types/workout";

type CycleTrackerProps = {
  plan: WorkoutPlan;
  cycle: CycleProgress;
  progressFor: (day: WorkoutPlan["days"][number]) => DayProgress;
  onStartNewCycle: () => void;
};

function dateRange({ startedAt, finishedAt }: CycleProgress): string | null {
  if (startedAt === null || finishedAt === null) return null;
  const start = formatShortDate(startedAt);
  const end = formatShortDate(finishedAt);
  return start === end ? start : `${start} – ${end}`;
}

/** Celebration that pops up the moment the final day of the cycle is finished. */
function CycleCompleteDialog({
  open,
  onOpenChange,
  plan,
  cycle,
  onStartNewCycle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: WorkoutPlan;
  cycle: CycleProgress;
  onStartNewCycle: () => void;
}) {
  const range = dateRange(cycle);
  const level = useLevel();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        data-level={level}
        className="overflow-hidden rounded-3xl border-primary/40 bg-card"
      >
        <div className="relative mx-auto grid size-20 place-items-center rounded-3xl bg-primary bg-level-gradient text-primary-foreground shadow-[0_0_48px_-8px] shadow-primary/70">
          <Trophy className="size-10" strokeWidth={2.25} aria-hidden />
          {open && <ConfettiBurst />}
        </div>
        <AlertDialogHeader className="sm:place-items-center sm:text-center">
          <AlertDialogTitle className="text-2xl font-black tracking-tight">
            Cycle complete!
          </AlertDialogTitle>
          <AlertDialogDescription>
            You finished all {cycle.totalDays} days of {plan.name}
            {range ? ` (${range})` : ""}. That&apos;s real consistency — great work!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11 rounded-xl">Not now</AlertDialogCancel>
          <AlertDialogAction className="h-11 rounded-xl font-semibold" onClick={onStartNewCycle}>
            Start new cycle
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CycleTracker({ plan, cycle, progressFor, onStartNewCycle }: CycleTrackerProps) {
  const { daysDone, totalDays, isComplete, startedAt } = cycle;

  // Open the celebration only when the cycle *becomes* complete in this session,
  // not every time a finished cycle is viewed.
  const [wasComplete, setWasComplete] = useState(isComplete);
  const [dialogOpen, setDialogOpen] = useState(false);
  if (wasComplete !== isComplete) {
    setWasComplete(isComplete);
    setDialogOpen(isComplete);
  }

  return (
    <section
      aria-label="Cycle progress"
      className={cn(
        "rounded-3xl border p-4 transition-colors duration-300",
        isComplete ? "border-primary/40 bg-primary/[0.07]" : "border-border bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
          This cycle
        </p>
        {!isComplete && (
          <ConfirmResetButton
            size="sm"
            label="Reset cycle"
            title="Reset the whole cycle?"
            description={`This unchecks every exercise on all ${totalDays} days of ${plan.name} and starts a fresh cycle. This can't be undone.`}
            confirmLabel="Reset cycle"
            disabled={startedAt === null}
            onConfirm={onStartNewCycle}
          />
        )}
      </div>

      {isComplete ? (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Trophy className="size-6 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0">
              <p className="font-bold">Cycle complete!</p>
              <p className="text-xs text-muted-foreground">
                All {totalDays} days done
                {dateRange(cycle) && (
                  <>
                    {" · "}
                    <span className="whitespace-nowrap">{dateRange(cycle)}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <Button className="h-11 rounded-xl px-5 font-semibold" onClick={onStartNewCycle}>
            Start new cycle
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-1 text-base font-semibold" aria-live="polite">
            <span className="text-primary tabular-nums">{daysDone}</span> of{" "}
            <span className="tabular-nums">{totalDays}</span> days done
            {startedAt !== null && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                Started {formatShortDate(startedAt)}
              </span>
            )}
          </p>
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {plan.days.map((day) => {
              const { isComplete: done, completed } = progressFor(day);
              return (
                <span
                  key={day.id}
                  className={cn(
                    "h-2 flex-1 rounded-full transition-colors duration-300",
                    done ? "bg-primary bg-level-gradient" : completed > 0 ? "bg-primary/35" : "bg-white/[0.08]",
                  )}
                />
              );
            })}
          </div>
        </>
      )}

      <CycleCompleteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={plan}
        cycle={cycle}
        onStartNewCycle={onStartNewCycle}
      />
    </section>
  );
}
