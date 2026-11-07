import type { ExperienceLevel, PlanDayDef, PlanDef } from "@/types/workout";

/*
 * Plans reference exercises by their catalog id (`exercises.ts`); a typo fails
 * the type check. Use `{ exercise, name }` to give one slot its own label, and
 * `{ exercise, optional: true }` for extras that don't count towards progress.
 * The same exercise may appear on several days — it shares one logged weight.
 */

const BEGINNER_1_DAYS: readonly PlanDayDef[] = [
  {
    id: 1,
    title: "Push",
    focus: "Chest, Shoulders & Triceps",
    exercises: [
      "flat-bench-press",
      "incline-dumbbell-fly",
      "incline-dumbbell-press",
      "cable-side-raise",
      "barbell-shoulder-press",
      "cable-overhead-triceps-extension",
      "triceps-pushdown",
      "close-grip-push-up",
    ],
  },
  {
    id: 2,
    title: "Pull",
    focus: "Back & Biceps",
    exercises: [
      "chin-up",
      "wide-grip-seated-cable-row",
      "one-arm-lat-pulldown",
      "straight-arm-pulldown",
      "face-pull",
      "barbell-curl",
      "hammer-curl",
      "reverse-barbell-curl",
    ],
  },
  {
    id: 3,
    title: "Legs",
    focus: "Lower Body",
    exercises: [
      "squat",
      "walking-lunges",
      "leg-extension",
      "leg-curl",
      "hip-thrust",
      { exercise: "leg-curl", name: "Leg Curl (Second Entry)" },
      "calf-raise",
    ],
  },
  {
    id: 4,
    title: "Rest / Cardio",
    focus: "Active Recovery",
    isRecovery: true,
    exercises: [
      "rest-day-done",
      { exercise: "walking", optional: true },
      { exercise: "cycling", optional: true },
      { exercise: "battle-rope-workout", optional: true },
    ],
  },
  {
    id: 5,
    title: "Upper Body",
    focus: "Chest, Back & Shoulders",
    exercises: [
      "incline-bench-press",
      "cable-crossover",
      "flat-dumbbell-press",
      "lat-pulldown",
      "chest-supported-t-bar-row",
      "cable-pulldown",
      "dumbbell-side-raise",
      "barbell-front-raise",
      "bent-over-dumbbell-fly",
      "dumbbell-shrugs",
    ],
  },
  {
    id: 6,
    title: "Legs & Arms",
    focus: "Legs, Triceps & Biceps",
    exercises: [
      "hack-squat",
      "romanian-deadlift",
      "leg-extension",
      "close-grip-bench-press",
      "skull-crushers",
      "single-arm-triceps-pushdown",
      "cable-biceps-curl",
      "machine-preacher-curl",
      "wrist-curl",
    ],
  },
];

export const EXPERIENCE_LEVELS: readonly ExperienceLevel[] = [
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced (Pro)" },
];

/** Plans without days show as "Coming soon". */
export const PLAN_DEFS: readonly PlanDef[] = [
  { id: "beginner-1", level: "beginner", number: 1, name: "Plan 1", days: BEGINNER_1_DAYS },
  { id: "beginner-2", level: "beginner", number: 2, name: "Plan 2", days: [] },
  { id: "intermediate-1", level: "intermediate", number: 1, name: "Plan 1", days: [] },
  { id: "intermediate-2", level: "intermediate", number: 2, name: "Plan 2", days: [] },
  { id: "advanced-1", level: "advanced", number: 1, name: "Plan 1", days: [] },
  { id: "advanced-2", level: "advanced", number: 2, name: "Plan 2", days: [] },
];
