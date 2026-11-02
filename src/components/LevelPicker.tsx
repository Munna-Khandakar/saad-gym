"use client";

import { SignalHigh, SignalLow, SignalMedium, type LucideIcon } from "lucide-react";

import { EXPERIENCE_LEVELS, getPlansForLevel } from "@/data/workouts";
import { cn } from "@/lib/utils";
import type { LevelId } from "@/types/workout";

const LEVEL_ICONS: Record<LevelId, LucideIcon> = {
  beginner: SignalLow,
  intermediate: SignalMedium,
  advanced: SignalHigh,
};

type LevelPickerProps = {
  labelledBy: string;
  selected: LevelId;
  onSelect: (levelId: LevelId) => void;
};

function readiness(levelId: LevelId): string {
  const ready = getPlansForLevel(levelId).filter((plan) => plan.days.length > 0).length;
  if (ready === 0) return "Coming soon";
  return ready === 1 ? "1 plan ready" : `${ready} plans ready`;
}

/** Native radios, so the browser handles arrow keys and form semantics for us. */
export function LevelPicker({ labelledBy, selected, onSelect }: LevelPickerProps) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid grid-cols-3 gap-2.5">
      {EXPERIENCE_LEVELS.map((level) => {
        const Icon = LEVEL_ICONS[level.id];
        const checked = level.id === selected;
        const status = readiness(level.id);
        return (
          <label
            key={level.id}
            // Each card wears its own level colour, so the whole ladder is visible at once.
            data-level={level.id}
            className={cn(
              "relative flex min-h-[104px] cursor-pointer flex-col justify-between gap-2 overflow-hidden rounded-2xl border p-3 transition-all duration-200 select-none active:scale-[0.98]",
              "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60",
              checked
                ? "border-primary bg-primary/[0.08] shadow-[0_0_24px_-8px] shadow-primary/50"
                : "border-border bg-card hover:border-primary/40 hover:bg-[#1c1c20]",
            )}
          >
            {checked && (
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-primary bg-level-gradient" />
            )}
            <input
              type="radio"
              name="experience-level"
              value={level.id}
              checked={checked}
              onChange={() => onSelect(level.id)}
              className="sr-only"
            />
            <Icon className={cn("size-5 text-primary", !checked && "opacity-70")} aria-hidden />
            <span>
              <span className="block text-[15px] leading-tight font-black tracking-tight text-balance">
                {level.name}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-xs",
                  status === "Coming soon" ? "text-primary/70" : "text-primary",
                )}
              >
                {status}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
