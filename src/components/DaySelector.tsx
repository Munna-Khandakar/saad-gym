"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { DayProgress } from "@/hooks/useWorkoutProgress";
import type { DayId, WorkoutDay } from "@/types/workout";

type DaySelectorProps = {
  days: readonly WorkoutDay[];
  selectedDay: DayId;
  onSelect: (dayId: DayId) => void;
  progressFor: (day: WorkoutDay) => DayProgress;
  panelId: string;
};

export const dayTabId = (dayId: DayId) => `day-tab-${dayId}`;

export function DaySelector({ days, selectedDay, onSelect, progressFor, panelId }: DaySelectorProps) {
  const tabRefs = useRef(new Map<DayId, HTMLButtonElement>());

  // Keep the active tab visible in the horizontally scrolling strip on mobile.
  useEffect(() => {
    tabRefs.current.get(selectedDay)?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [selectedDay]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = days.findIndex((day) => day.id === selectedDay);
    const targets: Record<string, number> = {
      ArrowRight: (index + 1) % days.length,
      ArrowDown: (index + 1) % days.length,
      ArrowLeft: (index - 1 + days.length) % days.length,
      ArrowUp: (index - 1 + days.length) % days.length,
      Home: 0,
      End: days.length - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = days[target].id;
    onSelect(next);
    tabRefs.current.get(next)?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Workout days"
      onKeyDown={handleKeyDown}
      className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 md:grid-cols-6 [&::-webkit-scrollbar]:hidden"
    >
      {days.map((day) => {
        const selected = day.id === selectedDay;
        const { completed, total, isComplete, finishedAt } = progressFor(day);
        return (
          <button
            key={day.id}
            ref={(node) => {
              if (node) tabRefs.current.set(day.id, node);
              else tabRefs.current.delete(day.id);
            }}
            id={dayTabId(day.id)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(day.id)}
            className={cn(
              "group relative flex min-h-[92px] w-[128px] shrink-0 snap-start flex-col items-start justify-between rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 outline-none sm:w-auto",
              "focus-visible:ring-[3px] focus-visible:ring-ring/60 active:scale-[0.97]",
              selected
                ? "border-primary/70 bg-primary/10 shadow-[0_0_24px_-8px] shadow-primary/50"
                : "border-border bg-card hover:border-white/20 hover:bg-white/[0.04]",
            )}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span
                className={cn(
                  "text-[11px] font-bold tracking-widest uppercase",
                  selected ? "text-primary" : "text-muted-foreground",
                )}
              >
                Day {day.id}
              </span>
              {isComplete && (
                <span className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" strokeWidth={3.5} aria-hidden />
                </span>
              )}
            </span>
            <span
              className={cn(
                "text-sm leading-tight font-semibold",
                selected ? "text-foreground" : "text-foreground/85",
              )}
            >
              {day.title}
            </span>
            <span
              className={cn(
                "mt-1 text-[11px] tabular-nums",
                isComplete ? "font-semibold text-primary" : "text-muted-foreground",
              )}
            >
              {isComplete && finishedAt !== null
                ? `Done · ${formatShortDate(finishedAt)}`
                : completed > 0
                  ? `${completed}/${total} done`
                  : "Not started"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
