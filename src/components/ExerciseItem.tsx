"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { ChecklistItem } from "@/types/workout";

type ExerciseItemProps = {
  item: ChecklistItem;
  /** 1-based position shown before the name, or `null` to hide it. */
  index: number | null;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const EMPTY = "—";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1 rounded-md bg-white/[0.05] px-2 py-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground tabular-nums">{value}</span>
    </span>
  );
}

export function ExerciseItem({ item, index, checked, onCheckedChange }: ExerciseItemProps) {
  const checkboxId = `item-${item.id}`;
  const isWarmup = item.kind === "warmup";

  return (
    <li>
      <label
        htmlFor={checkboxId}
        className={cn(
          "group flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all duration-200 select-none active:scale-[0.99]",
          "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
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

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {isWarmup ? (
              <Stat label="Duration" value={item.reps ?? EMPTY} />
            ) : item.detail ? (
              <span className="text-sm text-muted-foreground">{item.detail}</span>
            ) : item.optional ? (
              <Badge variant="outline" className="border-primary/30 text-primary">
                Optional
              </Badge>
            ) : (
              <>
                <Stat label="Sets" value={item.sets === null ? EMPTY : String(item.sets)} />
                <Stat label="Reps" value={item.reps ?? EMPTY} />
              </>
            )}
          </div>
        </div>
      </label>
    </li>
  );
}
