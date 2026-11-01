"use client";

import { BatteryCharging } from "lucide-react";

import { ConfirmResetButton } from "@/components/ConfirmResetButton";
import { ExerciseItem } from "@/components/ExerciseItem";
import { getChecklist } from "@/data/workouts";
import type { ChecklistItem, DayId, WorkoutDay } from "@/types/workout";

type WorkoutCardProps = {
  day: WorkoutDay;
  id: string;
  labelledBy: string;
  isCompleted: (itemId: string) => boolean;
  onToggle: (itemId: string, dayId: DayId, completed: boolean) => void;
  onReset: () => void;
  hasProgress: boolean;
};

export function WorkoutCard({
  day,
  id,
  labelledBy,
  isCompleted,
  onToggle,
  onReset,
  hasProgress,
}: WorkoutCardProps) {
  const items = getChecklist(day);
  const required = items.filter((item) => !item.optional);
  const optional = items.filter((item) => item.optional);

  const renderList = (list: ChecklistItem[]) => (
    <ul className="space-y-2.5">
      {list.map((item, i) => (
        <ExerciseItem
          key={item.id}
          item={item}
          // Numbering only makes sense for an ordered routine, not a rest day.
          index={day.isRecovery ? null : i + 1}
          checked={isCompleted(item.id)}
          onCheckedChange={(checked) => onToggle(item.id, day.id, checked)}
        />
      ))}
    </ul>
  );

  return (
    <section id={id} role="tabpanel" aria-labelledby={labelledBy} className="animate-rise-in">
      <div className="mb-4">
        <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
          Day {day.id} <span className="text-muted-foreground">—</span> {day.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{day.focus}</p>
      </div>

      {day.isRecovery && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.06] p-4">
          <BatteryCharging className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm leading-relaxed">
            <span className="font-semibold">Recovery is part of progress.</span>{" "}
            <span className="text-muted-foreground">Stay active and recharge.</span>
          </p>
        </div>
      )}

      {renderList(required)}

      {optional.length > 0 && (
        <>
          <h4 className="mt-6 mb-3 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            Optional extras
          </h4>
          {renderList(optional)}
        </>
      )}

      <div className="mt-5 flex justify-center">
        <ConfirmResetButton
          label={`Reset Day ${day.id}`}
          title={`Reset Day ${day.id}?`}
          description={`This unchecks everything on Day ${day.id} — ${day.title}. Other days in your cycle are not affected.`}
          confirmLabel="Reset day"
          disabled={!hasProgress}
          onConfirm={onReset}
        />
      </div>
    </section>
  );
}
