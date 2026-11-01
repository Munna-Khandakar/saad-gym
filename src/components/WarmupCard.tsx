"use client";

import { ExerciseItem } from "@/components/ExerciseItem";
import { StepLabel } from "@/components/StepLabel";
import { WARMUP_DAY_ID, WARMUP_ITEM } from "@/data/workouts";
import type { CompletionDayId } from "@/types/workout";

type WarmupCardProps = {
  checked: boolean;
  onToggle: (itemId: string, dayId: CompletionDayId, completed: boolean) => void;
};

export function WarmupCard({ checked, onToggle }: WarmupCardProps) {
  return (
    <section aria-labelledby="warmup-heading">
      <StepLabel id="warmup-heading" step={1}>
        Warm up first
      </StepLabel>
      <ul>
        <ExerciseItem
          item={WARMUP_ITEM}
          index={null}
          checked={checked}
          onCheckedChange={(completed) => onToggle(WARMUP_ITEM.id, WARMUP_DAY_ID, completed)}
        />
      </ul>
    </section>
  );
}
