import type { ExerciseInfo, MuscleGroupId } from "@/types/workout";

/** Group order on the "My weights" page. */
export const MUSCLE_GROUPS: readonly { id: MuscleGroupId; name: string }[] = [
  { id: "chest", name: "Chest" },
  { id: "back", name: "Back" },
  { id: "shoulders", name: "Shoulders" },
  { id: "legs", name: "Legs" },
  { id: "arms", name: "Arms" },
];

/*
 * The exercise catalog: every exercise once, keyed by a stable id. Plans in
 * `plans.ts` reference these ids, and logged weights are stored per id — so
 * renaming an id silently drops its saved weight. Names may change freely.
 */
export const EXERCISES = {
  warmup: { name: "Warm-up", duration: "10 min" },

  // Push
  "flat-bench-press": { name: "Flat Bench Press", group: "chest" },
  "incline-dumbbell-fly": { name: "Incline Dumbbell Fly", group: "chest" },
  "incline-dumbbell-press": { name: "Incline Dumbbell Press", group: "chest" },
  "cable-side-raise": { name: "Cable Side Raise", group: "shoulders" },
  "barbell-shoulder-press": { name: "Barbell Shoulder Press", group: "shoulders" },
  "cable-overhead-triceps-extension": { name: "Cable Overhead Triceps Extension", group: "arms" },
  "triceps-pushdown": { name: "Triceps Pushdown", group: "arms" },
  "close-grip-push-up": { name: "Close-Grip Push-Up", group: "arms" },

  // Pull
  "chin-up": { name: "Chin-Up", group: "back" },
  "wide-grip-seated-cable-row": { name: "Wide-Grip Seated Cable Row", group: "back" },
  "one-arm-lat-pulldown": { name: "One-Arm Lat Pulldown", group: "back" },
  "straight-arm-pulldown": { name: "Straight-Arm Pulldown", group: "back" },
  "face-pull": { name: "Face Pull", group: "shoulders" },
  "barbell-curl": { name: "Barbell Curl", group: "arms" },
  "hammer-curl": { name: "Hammer Curl", group: "arms" },
  "reverse-barbell-curl": { name: "Reverse Barbell Curl", group: "arms" },

  // Legs
  squat: { name: "Squat", group: "legs" },
  "walking-lunges": { name: "Walking Lunges", group: "legs" },
  "leg-extension": { name: "Leg Extension", group: "legs" },
  "leg-curl": { name: "Leg Curl", group: "legs" },
  "hip-thrust": { name: "Hip Thrust", group: "legs" },
  "calf-raise": { name: "Calf Raise", group: "legs" },
  "hack-squat": { name: "Hack Squat", group: "legs" },
  "romanian-deadlift": { name: "Romanian Deadlift", group: "legs" },

  // Upper body
  "incline-bench-press": { name: "Incline Bench Press", group: "chest" },
  "cable-crossover": { name: "Cable Crossover", group: "chest" },
  "flat-dumbbell-press": { name: "Flat Dumbbell Press", group: "chest" },
  "lat-pulldown": { name: "Lat Pulldown", group: "back" },
  "chest-supported-t-bar-row": { name: "Chest-Supported T-Bar Row", group: "back" },
  "cable-pulldown": { name: "Cable Pulldown", group: "back" },
  "dumbbell-side-raise": { name: "Dumbbell Side Raise", group: "shoulders" },
  "barbell-front-raise": { name: "Barbell Front Raise", group: "shoulders" },
  "bent-over-dumbbell-fly": { name: "Bent-Over Dumbbell Fly", group: "shoulders" },
  "dumbbell-shrugs": { name: "Dumbbell Shrugs", group: "shoulders" },

  // Arms
  "close-grip-bench-press": { name: "Close-Grip Bench Press", group: "arms" },
  "skull-crushers": { name: "Skull Crushers", group: "arms" },
  "single-arm-triceps-pushdown": { name: "Single-Arm Triceps Pushdown", group: "arms" },
  "cable-biceps-curl": { name: "Cable Biceps Curl", group: "arms" },
  "machine-preacher-curl": { name: "Machine Preacher Curl", group: "arms" },
  "wrist-curl": { name: "Wrist Curl", group: "arms" },

  // Recovery
  "rest-day-done": {
    name: "Rest day done",
    detail: "Tick once you've rested or done some light cardio.",
  },
  walking: { name: "Walking" },
  cycling: { name: "Cycling" },
  "battle-rope-workout": { name: "Battle Rope Workout" },
} as const satisfies Record<string, ExerciseInfo>;

export type ExerciseId = keyof typeof EXERCISES;

export function isExerciseId(value: unknown): value is ExerciseId {
  return typeof value === "string" && Object.hasOwn(EXERCISES, value);
}
