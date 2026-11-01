"use client";

import { Header } from "@/components/Header";
import { PlanCards } from "@/components/PlanCards";
import { StepLabel } from "@/components/StepLabel";
import { WarmupCard } from "@/components/WarmupCard";
import { WARMUP_ITEM, WORKOUT_PLANS } from "@/data/workouts";
import { useWorkoutProgress } from "@/hooks/useWorkoutProgress";

export function HomeView() {
  const { hydrated, isCompleted, setCompleted, cycleFor } = useWorkoutProgress();

  return (
    <>
      <Header />

      <h2 className="mt-8 mb-6 text-3xl leading-tight font-black tracking-tight text-balance sm:text-4xl">
        Ready to crush your <span className="text-primary">workout?</span>
      </h2>

      <div className="space-y-8">
        {hydrated ? (
          <WarmupCard checked={isCompleted(WARMUP_ITEM.id)} onToggle={setCompleted} />
        ) : (
          <div aria-hidden className="animate-pulse space-y-3">
            <div className="h-5 w-32 rounded bg-card" />
            <div className="h-[86px] rounded-2xl bg-card" />
          </div>
        )}

        <section aria-labelledby="plan-heading">
          <StepLabel id="plan-heading" step={2}>
            Choose your plan
          </StepLabel>
          <PlanCards plans={WORKOUT_PLANS} cycleFor={hydrated ? cycleFor : undefined} />
        </section>
      </div>
    </>
  );
}
