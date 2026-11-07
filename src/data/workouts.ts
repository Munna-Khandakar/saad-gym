import { EXERCISES, MUSCLE_GROUPS, type ExerciseId } from "@/data/exercises";
import { EXPERIENCE_LEVELS, PLAN_DEFS } from "@/data/plans";
import type {
  ChecklistItem,
  CompletionDayId,
  DayId,
  Exercise,
  ExperienceLevel,
  LevelId,
  PlanDayDef,
  PlanDef,
  PlanId,
  WorkoutDay,
  WorkoutPlan,
} from "@/types/workout";

export { EXERCISES, EXPERIENCE_LEVELS };

/** Day id used for the general warm-up, which belongs to no workout day. */
export const WARMUP_DAY_ID = 0;

/** The single warm-up done before any workout, shown on the home screen. */
export const WARMUP_ITEM: ChecklistItem = {
  ...EXERCISES.warmup,
  kind: "warmup",
  id: "warmup",
  exerciseId: "warmup",
};

/**
 * Resolves a day's slots against the catalog. Tick keys are derived from the
 * plan, day and exercise, with "#2", "#3"… for repeats within a day, so they
 * are unique without anyone writing ids by hand.
 */
function resolveDay(planId: PlanId, day: PlanDayDef): WorkoutDay {
  const seen = new Map<ExerciseId, number>();
  const exercises = day.exercises.map((slot): Exercise => {
    const { exercise, name, optional } = typeof slot === "string" ? { exercise: slot } : slot;
    const count = (seen.get(exercise) ?? 0) + 1;
    seen.set(exercise, count);
    const id = `${planId}/${day.id}/${exercise}${count > 1 ? `#${count}` : ""}`;
    return {
      ...EXERCISES[exercise],
      ...(name ? { name } : {}),
      ...(optional ? { optional } : {}),
      id,
      exerciseId: exercise,
    };
  });
  return { ...day, exercises };
}

function resolvePlan(plan: PlanDef): WorkoutPlan {
  return { ...plan, days: plan.days.map((day) => resolveDay(plan.id, day)) };
}

export const WORKOUT_PLANS: readonly WorkoutPlan[] = PLAN_DEFS.map(resolvePlan);

export const DEFAULT_LEVEL_ID: LevelId = "beginner";

export const DEFAULT_DAY_ID: DayId = 1;

export function isLevelId(value: unknown): value is LevelId {
  return EXPERIENCE_LEVELS.some((level) => level.id === value);
}

export function isPlanId(value: unknown): value is PlanId {
  return WORKOUT_PLANS.some((plan) => plan.id === value);
}

export function isDayId(value: unknown): value is DayId {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 6;
}

export function getLevel(levelId: LevelId): ExperienceLevel {
  return EXPERIENCE_LEVELS.find((level) => level.id === levelId) ?? EXPERIENCE_LEVELS[0];
}

export function getPlansForLevel(levelId: LevelId): WorkoutPlan[] {
  return WORKOUT_PLANS.filter((plan) => plan.level === levelId);
}

export function getPlan(planId: PlanId): WorkoutPlan {
  return WORKOUT_PLANS.find((plan) => plan.id === planId) ?? WORKOUT_PLANS[0];
}

/** The plan's day with this id, falling back to its first day; `null` if the plan has no days. */
export function getDay(plan: WorkoutPlan, dayId: DayId): WorkoutDay | null {
  return plan.days.find((day) => day.id === dayId) ?? plan.days[0] ?? null;
}

/** Every checkable row for a day, in routine order. */
export function getChecklist(day: WorkoutDay): ChecklistItem[] {
  return day.exercises.map((exercise) => ({ ...exercise, kind: "exercise" }));
}

/** The items that must be ticked for a day to count as done (optional extras excluded). */
export function getRequiredItems(day: WorkoutDay): ChecklistItem[] {
  return getChecklist(day).filter((item) => !item.optional);
}

/** Every checklist item id belonging to a plan's days (the warm-up is not part of a plan). */
export function getPlanItemIds(plan: WorkoutPlan): Set<string> {
  return new Set(plan.days.flatMap((day) => getChecklist(day).map((item) => item.id)));
}

/**
 * Items whose ticks clear themselves after EXPIRY_TIME. Only the warm-up, which
 * is redone every session; exercises stay ticked for the whole cycle.
 */
export const EXPIRING_ITEM_IDS: ReadonlySet<string> = new Set([WARMUP_ITEM.id]);

/** Maps every valid checklist item id to the day it belongs to (0 for the warm-up). */
export const ITEM_DAY_INDEX: ReadonlyMap<string, CompletionDayId> = new Map<string, CompletionDayId>([
  [WARMUP_ITEM.id, WARMUP_DAY_ID],
  ...WORKOUT_PLANS.flatMap((plan) =>
    plan.days.flatMap((day) => getChecklist(day).map((item) => [item.id, day.id] as const)),
  ),
]);

/**
 * Exercises that can hold a logged weight: anything used on a workout day
 * (not the warm-up or recovery-only items). Weights are keyed by exercise, so
 * one entry covers every day and plan the exercise appears in.
 */
export const WEIGHT_EXERCISE_IDS: ReadonlySet<ExerciseId> = new Set(
  WORKOUT_PLANS.flatMap((plan) =>
    plan.days.filter((day) => !day.isRecovery).flatMap((day) => day.exercises.map((e) => e.exerciseId)),
  ),
);

export type WeightGroup = {
  id: string;
  name: string;
  exercises: { id: ExerciseId; name: string }[];
};

/**
 * Every weight-eligible exercise, grouped by body part for the "My weights"
 * page. Groups follow MUSCLE_GROUPS; exercises keep catalog order. Anything
 * untagged lands in "Other" so it is never hidden.
 */
export const WEIGHT_GROUPS: readonly WeightGroup[] = (() => {
  const exercises = (Object.keys(EXERCISES) as ExerciseId[])
    .filter((id) => WEIGHT_EXERCISE_IDS.has(id))
    .map((id) => {
      const info: { name: string; group?: string } = EXERCISES[id];
      return { id, name: info.name, group: info.group };
    });
  const groups: { id: string; name: string }[] = [...MUSCLE_GROUPS, { id: "other", name: "Other" }];
  const known = new Set<string>(MUSCLE_GROUPS.map((group) => group.id));
  return groups
    .map((group) => ({
      ...group,
      exercises: exercises
        .filter((e) => (e.group && known.has(e.group) ? e.group : "other") === group.id)
        .map(({ id, name }) => ({ id, name })),
    }))
    .filter((group) => group.exercises.length > 0);
})();
