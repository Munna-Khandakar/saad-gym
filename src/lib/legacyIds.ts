import type { ExerciseId } from "@/data/exercises";

/*
 * Frozen snapshot of the v1 storage ids (Beginner Plan 1 slot ids, before the
 * exercise catalog existed) and where each one lives now. Used only by the
 * one-time migration in `storage.ts`. Never edit this when plans change.
 */
export const LEGACY_V1_IDS: ReadonlyMap<string, { item: string; exercise: ExerciseId }> = new Map<
  string,
  { item: string; exercise: ExerciseId }
>([
  ["warmup", { item: "warmup", exercise: "warmup" }],
  ["d1-flat-bench-press", { item: "beginner-1/1/flat-bench-press", exercise: "flat-bench-press" }],
  ["d1-incline-dumbbell-fly", { item: "beginner-1/1/incline-dumbbell-fly", exercise: "incline-dumbbell-fly" }],
  ["d1-incline-dumbbell-press", { item: "beginner-1/1/incline-dumbbell-press", exercise: "incline-dumbbell-press" }],
  ["d1-cable-side-raise", { item: "beginner-1/1/cable-side-raise", exercise: "cable-side-raise" }],
  ["d1-barbell-shoulder-press", { item: "beginner-1/1/barbell-shoulder-press", exercise: "barbell-shoulder-press" }],
  ["d1-cable-overhead-triceps-extension", { item: "beginner-1/1/cable-overhead-triceps-extension", exercise: "cable-overhead-triceps-extension" }],
  ["d1-triceps-pushdown", { item: "beginner-1/1/triceps-pushdown", exercise: "triceps-pushdown" }],
  ["d1-close-grip-push-up", { item: "beginner-1/1/close-grip-push-up", exercise: "close-grip-push-up" }],
  ["d2-chin-up", { item: "beginner-1/2/chin-up", exercise: "chin-up" }],
  ["d2-wide-grip-seated-cable-row", { item: "beginner-1/2/wide-grip-seated-cable-row", exercise: "wide-grip-seated-cable-row" }],
  ["d2-one-arm-lat-pulldown", { item: "beginner-1/2/one-arm-lat-pulldown", exercise: "one-arm-lat-pulldown" }],
  ["d2-straight-arm-pulldown", { item: "beginner-1/2/straight-arm-pulldown", exercise: "straight-arm-pulldown" }],
  ["d2-face-pull", { item: "beginner-1/2/face-pull", exercise: "face-pull" }],
  ["d2-barbell-curl", { item: "beginner-1/2/barbell-curl", exercise: "barbell-curl" }],
  ["d2-hammer-curl", { item: "beginner-1/2/hammer-curl", exercise: "hammer-curl" }],
  ["d2-reverse-barbell-curl", { item: "beginner-1/2/reverse-barbell-curl", exercise: "reverse-barbell-curl" }],
  ["d3-squat", { item: "beginner-1/3/squat", exercise: "squat" }],
  ["d3-walking-lunges", { item: "beginner-1/3/walking-lunges", exercise: "walking-lunges" }],
  ["d3-leg-extension", { item: "beginner-1/3/leg-extension", exercise: "leg-extension" }],
  ["d3-leg-curl-1", { item: "beginner-1/3/leg-curl", exercise: "leg-curl" }],
  ["d3-hip-thrust", { item: "beginner-1/3/hip-thrust", exercise: "hip-thrust" }],
  ["d3-leg-curl-2", { item: "beginner-1/3/leg-curl#2", exercise: "leg-curl" }],
  ["d3-calf-raise", { item: "beginner-1/3/calf-raise", exercise: "calf-raise" }],
  ["d4-rest-day-done", { item: "beginner-1/4/rest-day-done", exercise: "rest-day-done" }],
  ["d4-walking", { item: "beginner-1/4/walking", exercise: "walking" }],
  ["d4-cycling", { item: "beginner-1/4/cycling", exercise: "cycling" }],
  ["d4-battle-rope-workout", { item: "beginner-1/4/battle-rope-workout", exercise: "battle-rope-workout" }],
  ["d5-incline-bench-press", { item: "beginner-1/5/incline-bench-press", exercise: "incline-bench-press" }],
  ["d5-cable-crossover", { item: "beginner-1/5/cable-crossover", exercise: "cable-crossover" }],
  ["d5-flat-dumbbell-press", { item: "beginner-1/5/flat-dumbbell-press", exercise: "flat-dumbbell-press" }],
  ["d5-lat-pulldown", { item: "beginner-1/5/lat-pulldown", exercise: "lat-pulldown" }],
  ["d5-chest-supported-t-bar-row", { item: "beginner-1/5/chest-supported-t-bar-row", exercise: "chest-supported-t-bar-row" }],
  ["d5-cable-pulldown", { item: "beginner-1/5/cable-pulldown", exercise: "cable-pulldown" }],
  ["d5-dumbbell-side-raise", { item: "beginner-1/5/dumbbell-side-raise", exercise: "dumbbell-side-raise" }],
  ["d5-barbell-front-raise", { item: "beginner-1/5/barbell-front-raise", exercise: "barbell-front-raise" }],
  ["d5-bent-over-dumbbell-fly", { item: "beginner-1/5/bent-over-dumbbell-fly", exercise: "bent-over-dumbbell-fly" }],
  ["d5-dumbbell-shrugs", { item: "beginner-1/5/dumbbell-shrugs", exercise: "dumbbell-shrugs" }],
  ["d6-hack-squat", { item: "beginner-1/6/hack-squat", exercise: "hack-squat" }],
  ["d6-romanian-deadlift", { item: "beginner-1/6/romanian-deadlift", exercise: "romanian-deadlift" }],
  ["d6-leg-extension", { item: "beginner-1/6/leg-extension", exercise: "leg-extension" }],
  ["d6-close-grip-bench-press", { item: "beginner-1/6/close-grip-bench-press", exercise: "close-grip-bench-press" }],
  ["d6-skull-crushers", { item: "beginner-1/6/skull-crushers", exercise: "skull-crushers" }],
  ["d6-single-arm-triceps-pushdown", { item: "beginner-1/6/single-arm-triceps-pushdown", exercise: "single-arm-triceps-pushdown" }],
  ["d6-cable-biceps-curl", { item: "beginner-1/6/cable-biceps-curl", exercise: "cable-biceps-curl" }],
  ["d6-machine-preacher-curl", { item: "beginner-1/6/machine-preacher-curl", exercise: "machine-preacher-curl" }],
  ["d6-wrist-curl", { item: "beginner-1/6/wrist-curl", exercise: "wrist-curl" }],
]);
