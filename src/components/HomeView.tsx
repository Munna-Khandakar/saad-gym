"use client";

import { Header } from "@/components/Header";
import { LevelPicker } from "@/components/LevelPicker";
import { PlanCards } from "@/components/PlanCards";
import { StepLabel } from "@/components/StepLabel";
import { WarmupCard } from "@/components/WarmupCard";
import { getLevel, getPlansForLevel, WARMUP_ITEM } from "@/data/workouts";
import { useWorkoutProgress } from "@/hooks/useWorkoutProgress";

export function HomeView() {
  const { hydrated, isCompleted, setCompleted, cycleFor, selectedLevel, selectLevel } =
    useWorkoutProgress();

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

        {/* The chosen level lives in localStorage, so wait for hydration to avoid a mismatch. */}
        {selectedLevel === null ? (
          <div aria-hidden className="animate-pulse space-y-8">
            <div className="space-y-3">
              <div className="h-5 w-36 rounded bg-card" />
              <div className="grid grid-cols-3 gap-2.5">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-[104px] rounded-2xl bg-card" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-5 w-36 rounded bg-card" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="h-20 rounded-2xl bg-card" />
                <div className="h-20 rounded-2xl bg-card" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <section aria-labelledby="level-heading">
              <StepLabel id="level-heading" step={2}>
                Choose your level
              </StepLabel>
              <LevelPicker labelledBy="level-heading" selected={selectedLevel} onSelect={selectLevel} />
            </section>

            <section aria-labelledby="plan-heading">
              <StepLabel id="plan-heading" step={3}>
                Choose your plan · {getLevel(selectedLevel).name}
              </StepLabel>
              <PlanCards plans={getPlansForLevel(selectedLevel)} cycleFor={cycleFor} />
            </section>
          </>
        )}
      </div>
    </>
  );
}
