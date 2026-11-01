import Link from "next/link";
import { ChevronRight, Hourglass } from "lucide-react";

import type { CycleProgress } from "@/hooks/useWorkoutProgress";
import type { WorkoutPlan } from "@/types/workout";

const cardBase =
  "flex min-h-20 items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-200";

type PlanCardsProps = {
  plans: readonly WorkoutPlan[];
  /** Current cycle progress per plan; omitted until localStorage has loaded. */
  cycleFor?: (plan: WorkoutPlan) => CycleProgress;
};

function cycleLabel(cycle: CycleProgress | undefined): string | null {
  if (!cycle || cycle.startedAt === null) return null;
  return cycle.isComplete ? "Cycle complete!" : `${cycle.daysDone}/${cycle.totalDays} days this cycle`;
}

export function PlanCards({ plans, cycleFor }: PlanCardsProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {plans.map((plan) => (
        <li key={plan.id}>
          {plan.days.length > 0 ? (
            <Link
              href={`/plan/${plan.id}`}
              prefetch
              className={`${cardBase} group border-border bg-card outline-none hover:border-primary/60 hover:bg-primary/[0.06] focus-visible:ring-[3px] focus-visible:ring-ring/60 active:scale-[0.98]`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground">
                {plan.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg leading-tight font-black tracking-tight">{plan.name}</span>
                <span className="block text-sm text-muted-foreground">
                  {plan.days.length}-day split
                  {cycleLabel(cycleFor?.(plan)) && (
                    <span className="text-primary"> · {cycleLabel(cycleFor?.(plan))}</span>
                  )}
                </span>
              </span>
              <ChevronRight
                className="size-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden
              />
            </Link>
          ) : (
            <div
              aria-disabled="true"
              className={`${cardBase} border-dashed border-white/15 bg-card/50 text-muted-foreground`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-lg font-black">
                {plan.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg leading-tight font-black tracking-tight text-foreground/70">
                  {plan.name}
                </span>
                <span className="block text-sm">Coming soon</span>
              </span>
              <Hourglass className="size-5" aria-hidden />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
