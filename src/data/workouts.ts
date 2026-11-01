import type {
  ChecklistItem,
  CompletionDayId,
  DayId,
  ExperienceLevel,
  LevelId,
  PlanId,
  WorkoutDay,
  WorkoutPlan,
} from "@/types/workout";

/** Day id used for the general warm-up, which belongs to no workout day. */
export const WARMUP_DAY_ID = 0;

/** The single warm-up done before any workout, shown on the home screen. */
export const WARMUP_ITEM: ChecklistItem = {
  kind: "warmup",
  id: "warmup",
  name: "Warm-up",
  duration: "10 min",
};

const PLAN_1_DAYS: readonly WorkoutDay[] = [
  {
    id: 1,
    title: "Push",
    focus: "Chest, Shoulders & Triceps",
    exercises: [
      { id: "d1-flat-bench-press", name: "Flat Bench Press" },
      { id: "d1-incline-dumbbell-fly", name: "Incline Dumbbell Fly" },
      { id: "d1-incline-dumbbell-press", name: "Incline Dumbbell Press" },
      { id: "d1-cable-side-raise", name: "Cable Side Raise" },
      { id: "d1-barbell-shoulder-press", name: "Barbell Shoulder Press" },
      { id: "d1-cable-overhead-triceps-extension", name: "Cable Overhead Triceps Extension" },
      { id: "d1-triceps-pushdown", name: "Triceps Pushdown" },
      { id: "d1-close-grip-push-up", name: "Close-Grip Push-Up" },
    ],
  },
  {
    id: 2,
    title: "Pull",
    focus: "Back & Biceps",
    exercises: [
      { id: "d2-chin-up", name: "Chin-Up" },
      { id: "d2-wide-grip-seated-cable-row", name: "Wide-Grip Seated Cable Row" },
      { id: "d2-one-arm-lat-pulldown", name: "One-Arm Lat Pulldown" },
      { id: "d2-straight-arm-pulldown", name: "Straight-Arm Pulldown" },
      { id: "d2-face-pull", name: "Face Pull" },
      { id: "d2-barbell-curl", name: "Barbell Curl" },
      { id: "d2-hammer-curl", name: "Hammer Curl" },
      { id: "d2-reverse-barbell-curl", name: "Reverse Barbell Curl" },
    ],
  },
  {
    id: 3,
    title: "Legs",
    focus: "Lower Body",
    exercises: [
      { id: "d3-squat", name: "Squat" },
      { id: "d3-walking-lunges", name: "Walking Lunges" },
      { id: "d3-leg-extension", name: "Leg Extension" },
      { id: "d3-leg-curl-1", name: "Leg Curl" },
      { id: "d3-hip-thrust", name: "Hip Thrust" },
      { id: "d3-leg-curl-2", name: "Leg Curl (Second Entry)" },
      { id: "d3-calf-raise", name: "Calf Raise" },
    ],
  },
  {
    id: 4,
    title: "Rest / Cardio",
    focus: "Active Recovery",
    isRecovery: true,
    exercises: [
      {
        id: "d4-rest-day-done",
        name: "Rest day done",
        detail: "Tick once you've rested or done some light cardio.",
      },
      { id: "d4-walking", name: "Walking", optional: true },
      { id: "d4-cycling", name: "Cycling", optional: true },
      { id: "d4-battle-rope-workout", name: "Battle Rope Workout", optional: true },
    ],
  },
  {
    id: 5,
    title: "Upper Body",
    focus: "Chest, Back & Shoulders",
    exercises: [
      { id: "d5-incline-bench-press", name: "Incline Bench Press" },
      { id: "d5-cable-crossover", name: "Cable Crossover" },
      { id: "d5-flat-dumbbell-press", name: "Flat Dumbbell Press" },
      { id: "d5-lat-pulldown", name: "Lat Pulldown" },
      { id: "d5-chest-supported-t-bar-row", name: "Chest-Supported T-Bar Row" },
      { id: "d5-cable-pulldown", name: "Cable Pulldown" },
      { id: "d5-dumbbell-side-raise", name: "Dumbbell Side Raise" },
      { id: "d5-barbell-front-raise", name: "Barbell Front Raise" },
      { id: "d5-bent-over-dumbbell-fly", name: "Bent-Over Dumbbell Fly" },
      { id: "d5-dumbbell-shrugs", name: "Dumbbell Shrugs" },
    ],
  },
  {
    id: 6,
    title: "Legs & Arms",
    focus: "Legs, Triceps & Biceps",
    exercises: [
      { id: "d6-hack-squat", name: "Hack Squat" },
      { id: "d6-romanian-deadlift", name: "Romanian Deadlift" },
      { id: "d6-leg-extension", name: "Leg Extension" },
      { id: "d6-close-grip-bench-press", name: "Close-Grip Bench Press" },
      { id: "d6-skull-crushers", name: "Skull Crushers" },
      { id: "d6-single-arm-triceps-pushdown", name: "Single-Arm Triceps Pushdown" },
      { id: "d6-cable-biceps-curl", name: "Cable Biceps Curl" },
      { id: "d6-machine-preacher-curl", name: "Machine Preacher Curl" },
      { id: "d6-wrist-curl", name: "Wrist Curl" },
    ],
  },
];

export const EXPERIENCE_LEVELS: readonly ExperienceLevel[] = [
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced (Pro)" },
];

export const DEFAULT_LEVEL_ID: LevelId = "beginner";

/*
 * Plans without days show as "Coming soon". Beginner Plan 1 keeps its original
 * "d1-…" exercise ids so existing saved progress survives. Give every new plan's
 * ids a plan prefix (e.g. "b2-d1-…", "i1-d1-…", "a1-d1-…") so they never collide
 * in localStorage.
 */
export const WORKOUT_PLANS: readonly WorkoutPlan[] = [
  { id: "beginner-1", level: "beginner", number: 1, name: "Plan 1", days: PLAN_1_DAYS },
  { id: "beginner-2", level: "beginner", number: 2, name: "Plan 2", days: [] },
  { id: "intermediate-1", level: "intermediate", number: 1, name: "Plan 1", days: [] },
  { id: "intermediate-2", level: "intermediate", number: 2, name: "Plan 2", days: [] },
  { id: "advanced-1", level: "advanced", number: 1, name: "Plan 1", days: [] },
  { id: "advanced-2", level: "advanced", number: 2, name: "Plan 2", days: [] },
];

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

/** Exercises that can hold a logged weight: everything except the warm-up and recovery days. */
export const WEIGHT_ITEM_IDS: ReadonlySet<string> = new Set(
  WORKOUT_PLANS.flatMap((plan) =>
    plan.days.filter((day) => !day.isRecovery).flatMap((day) => day.exercises.map((e) => e.id)),
  ),
);
