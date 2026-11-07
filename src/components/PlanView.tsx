"use client";

import Link from "next/link";
import { Hourglass, Weight } from "lucide-react";

import { BackHeader, iconLinkClass } from "@/components/BackHeader";
import { CycleTracker } from "@/components/CycleTracker";
import { DaySelector, dayTabId } from "@/components/DaySelector";
import { LevelProvider } from "@/components/LevelTheme";
import { ProgressTracker } from "@/components/ProgressTracker";
import { WorkoutCard } from "@/components/WorkoutCard";
import { getChecklist, getDay, getLevel, getPlan } from "@/data/workouts";
import { useWorkoutProgress } from "@/hooks/useWorkoutProgress";
import type { PlanId, WorkoutPlan } from "@/types/workout";

const DAY_PANEL_ID = "workout-panel";

function PlanHeader({ plan }: { plan: WorkoutPlan | null }) {
  return (
    <BackHeader
      eyebrow={plan && getLevel(plan.level).name}
      title={plan?.name ?? null}
      action={
        // Lets the lifter check their numbers mid-workout without going home.
        <Link href="/weights" prefetch aria-label="My weights" className={iconLinkClass}>
          <Weight className="size-5" aria-hidden />
        </Link>
      }
    />
  );
}

function LoadingSkeleton() {
  return (
    <div aria-hidden className="animate-pulse space-y-6">
      <div className="h-[104px] rounded-3xl bg-card" />
      <div className="-mx-4 flex gap-2.5 overflow-hidden px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 md:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-[92px] w-[128px] shrink-0 rounded-2xl bg-card sm:w-auto" />
        ))}
      </div>
      <div className="h-[126px] rounded-3xl bg-card" />
      <div className="space-y-2.5">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-[76px] rounded-2xl bg-card" />
        ))}
      </div>
    </div>
  );
}

function EmptyPlan({ plan }: { plan: WorkoutPlan }) {
  return (
    <div className="flex animate-rise-in flex-col items-center rounded-3xl border border-dashed border-white/15 bg-card/50 px-6 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Hourglass className="size-6" aria-hidden />
      </div>
      <p className="mt-4 text-lg font-bold">
        {getLevel(plan.level).name} {plan.name} is coming soon
      </p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Exercises for this plan haven&apos;t been added yet.
      </p>
    </div>
  );
}

/** Shown while the route's URL params resolve. */
export function PlanViewFallback() {
  return (
    <>
      <PlanHeader plan={null} />
      <div className="mt-8">
        <LoadingSkeleton />
      </div>
    </>
  );
}

export function PlanView({ planId }: { planId: PlanId }) {
  const {
    hydrated,
    selectedDay,
    selectDay,
    isCompleted,
    setCompleted,
    resetDay,
    resetCycle,
    progressFor,
    cycleFor,
    weightFor,
    setWeight,
  } = useWorkoutProgress();

  const plan = getPlan(planId);
  const day = selectedDay === null ? null : getDay(plan, selectedDay);
  const progress = day ? progressFor(day) : null;

  return (
    // The level's accent colours apply to everything in this plan (see globals.css).
    <LevelProvider value={plan.level}>
      <div data-level={plan.level}>
        <PlanHeader plan={plan} />

        <div className="mt-8">
          {plan.days.length === 0 ? (
            <EmptyPlan plan={plan} />
          ) : !hydrated || !day || !progress ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-6">
              <CycleTracker
                plan={plan}
                cycle={cycleFor(plan)}
                progressFor={progressFor}
                onStartNewCycle={() => {
                  resetCycle(plan);
                  selectDay(plan.days[0].id);
                }}
              />
              <DaySelector
                days={plan.days}
                selectedDay={day.id}
                onSelect={selectDay}
                progressFor={progressFor}
                panelId={DAY_PANEL_ID}
              />
              <ProgressTracker day={day} progress={progress} />
              <WorkoutCard
                key={day.id}
                day={day}
                id={DAY_PANEL_ID}
                labelledBy={dayTabId(day.id)}
                isCompleted={isCompleted}
                onToggle={setCompleted}
                weightFor={weightFor}
                onSaveWeight={setWeight}
                onReset={() => resetDay(day)}
                hasProgress={getChecklist(day).some((item) => isCompleted(item.id))}
              />
            </div>
          )}
        </div>
      </div>
    </LevelProvider>
  );
}
