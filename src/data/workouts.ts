import type {
  ChecklistItem,
  CompletionDayId,
  DayId,
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
  sets: null,
  reps: "10 min",
};

const PLAN_1_DAYS: readonly WorkoutDay[] = [
  {
    id: 1,
    title: "Push",
    focus: "Chest, Shoulders & Triceps",
    exercises: [
      { id: "d1-flat-bench-press", name: "Flat Bench Press", sets: 4, reps: "8–12" },
      { id: "d1-incline-dumbbell-fly", name: "Incline Dumbbell Fly", sets: 3, reps: "8–12" },
      { id: "d1-incline-dumbbell-press", name: "Incline Dumbbell Press", sets: 3, reps: "8–12" },
      { id: "d1-cable-side-raise", name: "Cable Side Raise", sets: 3, reps: "8–12" },
      { id: "d1-barbell-shoulder-press", name: "Barbell Shoulder Press", sets: 3, reps: "6–8" },
      {
        id: "d1-cable-overhead-triceps-extension",
        name: "Cable Overhead Triceps Extension",
        sets: 3,
        reps: "8–12",
      },
      { id: "d1-triceps-pushdown", name: "Triceps Pushdown", sets: 3, reps: "8–12" },
      { id: "d1-close-grip-push-up", name: "Close-Grip Push-Up", sets: null, reps: "40" },
    ],
  },
  {
    id: 2,
    title: "Pull",
    focus: "Back & Biceps",
    exercises: [
      { id: "d2-chin-up", name: "Chin-Up", sets: null, reps: "30" },
      { id: "d2-wide-grip-seated-cable-row", name: "Wide-Grip Seated Cable Row", sets: 3, reps: null },
      { id: "d2-one-arm-lat-pulldown", name: "One-Arm Lat Pulldown", sets: 3, reps: null },
      { id: "d2-straight-arm-pulldown", name: "Straight-Arm Pulldown", sets: 3, reps: null },
      { id: "d2-face-pull", name: "Face Pull", sets: 4, reps: null },
      { id: "d2-barbell-curl", name: "Barbell Curl", sets: 3, reps: "6–8" },
      { id: "d2-hammer-curl", name: "Hammer Curl", sets: 2, reps: "10–12" },
      { id: "d2-reverse-barbell-curl", name: "Reverse Barbell Curl", sets: 3, reps: null },
    ],
  },
  {
    id: 3,
    title: "Legs",
    focus: "Lower Body",
    exercises: [
      { id: "d3-squat", name: "Squat", sets: 4, reps: "8–12" },
      { id: "d3-walking-lunges", name: "Walking Lunges", sets: 3, reps: null },
      { id: "d3-leg-extension", name: "Leg Extension", sets: 3, reps: "10–12" },
      { id: "d3-leg-curl-1", name: "Leg Curl", sets: 3, reps: "8–12" },
      { id: "d3-hip-thrust", name: "Hip Thrust", sets: 3, reps: "10–15" },
      { id: "d3-leg-curl-2", name: "Leg Curl (Second Entry)", sets: 3, reps: "8–12" },
      { id: "d3-calf-raise", name: "Calf Raise", sets: 3, reps: "15–20" },
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
        sets: null,
        reps: null,
        detail: "Tick once you've rested or done some light cardio.",
      },
      { id: "d4-walking", name: "Walking", sets: null, reps: null, optional: true },
      { id: "d4-cycling", name: "Cycling", sets: null, reps: null, optional: true },
      {
        id: "d4-battle-rope-workout",
        name: "Battle Rope Workout",
        sets: null,
        reps: null,
        optional: true,
      },
    ],
  },
  {
    id: 5,
    title: "Upper Body",
    focus: "Chest, Back & Shoulders",
    exercises: [
      { id: "d5-incline-bench-press", name: "Incline Bench Press", sets: 3, reps: "8–12" },
      { id: "d5-cable-crossover", name: "Cable Crossover", sets: 3, reps: "8–12" },
      { id: "d5-flat-dumbbell-press", name: "Flat Dumbbell Press", sets: 3, reps: "8–12" },
      { id: "d5-lat-pulldown", name: "Lat Pulldown", sets: 3, reps: "8–12" },
      { id: "d5-chest-supported-t-bar-row", name: "Chest-Supported T-Bar Row", sets: 3, reps: "6–8" },
      { id: "d5-cable-pulldown", name: "Cable Pulldown", sets: 3, reps: "10–12" },
      { id: "d5-dumbbell-side-raise", name: "Dumbbell Side Raise", sets: 4, reps: "8–10" },
      { id: "d5-barbell-front-raise", name: "Barbell Front Raise", sets: 3, reps: null },
      { id: "d5-bent-over-dumbbell-fly", name: "Bent-Over Dumbbell Fly", sets: 3, reps: "8–10" },
      { id: "d5-dumbbell-shrugs", name: "Dumbbell Shrugs", sets: 2, reps: "6–8" },
    ],
  },
  {
    id: 6,
    title: "Legs & Arms",
    focus: "Legs, Triceps & Biceps",
    exercises: [
      { id: "d6-hack-squat", name: "Hack Squat", sets: 4, reps: "8–12" },
      { id: "d6-romanian-deadlift", name: "Romanian Deadlift", sets: 3, reps: "6–10" },
      { id: "d6-leg-extension", name: "Leg Extension", sets: 2, reps: "10–12" },
      { id: "d6-close-grip-bench-press", name: "Close-Grip Bench Press", sets: 4, reps: "6–10" },
      { id: "d6-skull-crushers", name: "Skull Crushers", sets: 3, reps: "6–10" },
      {
        id: "d6-single-arm-triceps-pushdown",
        name: "Single-Arm Triceps Pushdown",
        sets: 2,
        reps: null,
      },
      { id: "d6-cable-biceps-curl", name: "Cable Biceps Curl", sets: 3, reps: null },
      { id: "d6-machine-preacher-curl", name: "Machine Preacher Curl", sets: 3, reps: null },
      { id: "d6-wrist-curl", name: "Wrist Curl", sets: 3, reps: null },
    ],
  },
];

export const WORKOUT_PLANS: readonly WorkoutPlan[] = [
  { id: 1, name: "Plan 1", days: PLAN_1_DAYS },
  // Exercises not added yet. Give its exercise ids a "p2-" prefix so they never
  // collide with Plan 1's ids in localStorage.
  { id: 2, name: "Plan 2", days: [] },
];

export const DEFAULT_DAY_ID: DayId = 1;

export function isPlanId(value: unknown): value is PlanId {
  return WORKOUT_PLANS.some((plan) => plan.id === value);
}

export function isDayId(value: unknown): value is DayId {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 6;
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
