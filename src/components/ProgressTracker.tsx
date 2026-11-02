"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { ConfettiBurst } from "@/components/Celebration";
import { Progress } from "@/components/ui/progress";
import type { DayProgress } from "@/hooks/useWorkoutProgress";
import type { WorkoutDay } from "@/types/workout";

type ProgressTrackerProps = {
  day: WorkoutDay;
  progress: DayProgress;
};

const RING_RADIUS = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function ProgressRing({ percent }: { percent: number }) {
  return (
    <div className="relative size-[84px] shrink-0">
      <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r={RING_RADIUS} fill="none" strokeWidth="7" className="stroke-white/[0.07]" />
        <circle
          cx="40"
          cy="40"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - percent / 100)}
          className="stroke-primary transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-lg font-black tabular-nums">
        {percent}%
      </span>
    </div>
  );
}

export function ProgressTracker({ day, progress }: ProgressTrackerProps) {
  const { completed, total, percent, isComplete, finishedAt } = progress;

  // Play the confetti only when this day *transitions* to complete, not when
  // switching to a day that was already finished or on first load.
  const [previous, setPrevious] = useState({ dayId: day.id, isComplete });
  const [burst, setBurst] = useState(0);
  if (previous.dayId !== day.id || previous.isComplete !== isComplete) {
    setPrevious({ dayId: day.id, isComplete });
    setBurst(previous.dayId === day.id && isComplete ? (n) => n + 1 : 0);
  }

  return (
    <section
      aria-label={`Day ${day.id} progress`}
      className={cn(
        "relative overflow-hidden rounded-3xl border p-5 transition-colors duration-300",
        isComplete ? "border-primary/40 bg-primary/[0.07]" : "border-border bg-card",
      )}
    >
      <div className="flex items-center gap-5">
        <div className="relative">
          <ProgressRing percent={percent} />
          {isComplete && burst > 0 && <ConfettiBurst key={burst} />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            Day {day.id} progress
          </p>
          <p className="mt-1 text-base font-semibold" aria-live="polite">
            {day.isRecovery ? (
              isComplete ? (
                "Rest day logged"
              ) : (
                "Rest day not logged yet"
              )
            ) : (
              <>
                <span className="text-primary tabular-nums">{completed}</span> of{" "}
                <span className="tabular-nums">{total}</span> exercises completed
              </>
            )}
          </p>
          <Progress
            value={percent}
            aria-label={`${percent}% of Day ${day.id} completed`}
            className="mt-3 h-2.5 bg-white/[0.07] [&_[data-slot=progress-indicator]]:duration-500 [&_[data-slot=progress-indicator]]:ease-out"
          />
        </div>
      </div>

      {isComplete && (
        <div
          role="status"
          className="mt-4 flex animate-rise-in items-center gap-3 rounded-2xl bg-primary bg-level-gradient px-4 py-3 text-primary-foreground"
        >
          <Trophy className="size-5 shrink-0" strokeWidth={2.5} aria-hidden />
          <div className="min-w-0">
            <p className="font-bold">
              {day.isRecovery ? "Rest day done! Recharged." : "Workout Complete! Great job!"}
            </p>
            {finishedAt !== null && (
              <p className="text-xs font-semibold opacity-70">Finished {formatShortDate(finishedAt)}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
