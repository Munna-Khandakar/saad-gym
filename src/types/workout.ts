import type { ExerciseId } from "@/data/exercises";

export type DayId = 1 | 2 | 3 | 4 | 5 | 6;
export type LevelId = "beginner" | "intermediate" | "advanced";
/** URL slug of a plan, e.g. "beginner-1". */
export type PlanId = `${LevelId}-${number}`;
/** A workout day, or 0 for the general warm-up. */
export type CompletionDayId = DayId | 0;

export type { ExerciseId };

/** Body-part headings on the "My weights" page. */
export type MuscleGroupId = "chest" | "back" | "shoulders" | "legs" | "arms";

/** A row in the exercise catalog (`src/data/exercises.ts`). */
export type ExerciseInfo = {
  name: string;
  /** Where the exercise is listed on the "My weights" page; untagged ones go under "Other". */
  group?: MuscleGroupId;
  /** Short hint shown under the name, for items such as the rest day. */
  detail?: string;
  /** How long the item takes, e.g. "10 min" for the warm-up. */
  duration?: string;
};

/**
 * One entry in a plan day: an exercise id, or an object when the slot needs
 * its own label or is an optional extra.
 */
export type PlanSlot =
  | ExerciseId
  | {
      exercise: ExerciseId;
      /** Overrides the catalog name for this slot only. */
      name?: string;
      /** Optional extras are shown but never required to finish a day. */
      optional?: boolean;
    };

/** A day as written in `src/data/plans.ts`. */
export type PlanDayDef = {
  id: DayId;
  /** e.g. "Push" */
  title: string;
  /** e.g. "Chest, Shoulders & Triceps" */
  focus: string;
  exercises: readonly PlanSlot[];
  isRecovery?: boolean;
};

/** A plan as written in `src/data/plans.ts`. */
export type PlanDef = {
  id: PlanId;
  level: LevelId;
  /** Position within its level, shown on the plan card. */
  number: number;
  name: string;
  days: readonly PlanDayDef[];
};

/** A plan slot resolved against the catalog. */
export type Exercise = ExerciseInfo & {
  /**
   * Unique per plan slot (`<planId>/<dayId>/<exerciseId>`, `#2`… for repeats) —
   * the localStorage key for ticks.
   */
  id: string;
  /** Catalog id — the localStorage key for weights, shared across days and plans. */
  exerciseId: ExerciseId;
  optional?: boolean;
};

export type WorkoutDay = Omit<PlanDayDef, "exercises"> & {
  exercises: readonly Exercise[];
};

export type WorkoutPlan = Omit<PlanDef, "days"> & {
  days: readonly WorkoutDay[];
};

export type ExperienceLevel = {
  id: LevelId;
  name: string;
};

/** A checkable row: either the warm-up or an exercise. */
export type ChecklistItem = Exercise & { kind: "warmup" | "exercise" };

export type WorkoutCompletion = {
  itemId: string;
  dayId: CompletionDayId;
  completedAt: number;
};

/** The last weight logged for an exercise. Kept across cycles. */
export type WeightEntry = {
  exerciseId: ExerciseId;
  kg: number;
  updatedAt: number;
};
