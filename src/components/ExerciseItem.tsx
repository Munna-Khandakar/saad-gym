"use client";

import { Dumbbell, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { LoggedWeight } from "@/hooks/useWorkoutProgress";
import { HOLD_DURATION, useLongPress } from "@/hooks/useLongPress";
import { formatKg } from "@/lib/format";
import type { ChecklistItem } from "@/types/workout";

type ExerciseItemProps = {
  item: ChecklistItem;
  /** 1-based position shown before the name, or `null` to hide it. */
  index: number | null;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Last logged weight; only meaningful when `onEditWeight` is set. */
  weight?: LoggedWeight | null;
  /** Opens the weight editor. Omit for rows that can't hold a weight (warm-up, rest day). */
  onEditWeight?: () => void;
};

/** DOM id of a row's weight button, so the weight dialog can return focus to it. */
export function weightButtonId(itemId: string): string {
  return `weight-${itemId}`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1 rounded-md bg-white/[0.05] px-2 py-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground tabular-nums">{value}</span>
    </span>
  );
}

export function ExerciseItem({
  item,
  index,
  checked,
  onCheckedChange,
  weight = null,
  onEditWeight,
}: ExerciseItemProps) {
  const checkboxId = `item-${item.id}`;
  const isWarmup = item.kind === "warmup";
  const { holding, handlers } = useLongPress(onEditWeight);

  const meta = isWarmup ? (
    item.duration && <Stat label="Duration" value={item.duration} />
  ) : item.detail ? (
    <span className="text-sm text-muted-foreground">{item.detail}</span>
  ) : item.optional ? (
    <Badge variant="outline" className="border-primary/30 text-primary">
      Optional
    </Badge>
  ) : null;

  return (
    <li className="relative">
      <label
        htmlFor={checkboxId}
        {...handlers}
        className={cn(
          "group relative flex min-h-16 cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3.5 transition-all duration-200 select-none [-webkit-touch-callout:none] active:scale-[0.99]",
          "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
          onEditWeight && "pr-[6.5rem]",
          checked
            ? "border-primary/30 bg-primary/[0.06]"
            : "border-border bg-card hover:border-white/20 hover:bg-[#1c1c20]",
        )}
      >
        <Checkbox
          id={checkboxId}
          checked={checked}
          onCheckedChange={(state) => onCheckedChange(state === true)}
          className={cn(
            "size-7 rounded-lg border-2 border-white/25 transition-colors duration-200 focus-visible:ring-0",
            "group-hover:border-primary/70 data-[state=checked]:border-primary",
            "[&_svg]:size-5 [&_svg]:stroke-[3] [&_[data-slot=checkbox-indicator]]:animate-check-pop",
          )}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isWarmup ? (
              <Flame
                className={cn("size-4 shrink-0", checked ? "text-primary/60" : "text-primary")}
                aria-hidden
              />
            ) : (
              index !== null && (
                <span
                  className="font-mono text-[11px] text-muted-foreground/70 tabular-nums"
                  aria-hidden
                >
                  {String(index).padStart(2, "0")}
                </span>
              )
            )}
            <span
              className={cn(
                "text-[15px] leading-snug font-semibold transition-colors duration-200",
                checked &&
                  "text-muted-foreground line-through decoration-primary/60 decoration-2",
              )}
            >
              {item.name}
            </span>
          </div>

          {meta && <div className="mt-2 flex flex-wrap items-center gap-1.5">{meta}</div>}
        </div>

        {holding && (
          // Fills across the row while held; reduced motion collapses it to an instant bar.
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1 origin-left animate-hold-fill bg-primary"
            style={{ animationDuration: `${HOLD_DURATION}ms` }}
          />
        )}
      </label>

      {onEditWeight && (
        // A sibling of the label, not a child, so tapping it never toggles the checkbox.
        <button
          type="button"
          id={weightButtonId(item.id)}
          onClick={onEditWeight}
          aria-label={
            weight
              ? `${item.name}: ${formatKg(weight.kg)} kg, edit weight`
              : `Log weight for ${item.name}`
          }
          className={cn(
            "absolute top-1/2 right-3 flex h-11 min-w-11 -translate-y-1/2 items-center justify-center gap-1 rounded-xl border px-2.5 text-sm font-bold tabular-nums outline-none transition-colors",
            "focus-visible:ring-[3px] focus-visible:ring-ring/60 active:scale-95",
            weight
              ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
              : "border-white/10 bg-white/[0.04] text-muted-foreground hover:border-primary/50 hover:text-primary",
          )}
        >
          {weight ? (
            <>
              {formatKg(weight.kg)}
              <span className="text-xs font-semibold opacity-80">kg</span>
            </>
          ) : (
            <>
              <Dumbbell className="size-4" aria-hidden />
              <span className="text-xs font-semibold">kg</span>
            </>
          )}
        </button>
      )}
    </li>
  );
}
