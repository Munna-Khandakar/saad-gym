export type DayId = 1 | 2 | 3 | 4 | 5 | 6;
export type PlanId = 1 | 2;
/** A workout day, or 0 for the general warm-up. */
export type CompletionDayId = DayId | 0;

export type Exercise = {
  /** Stable, unique identifier — used as the localStorage completion key. */
  id: string;
  name: string;
  /** `null` when the routine does not specify sets (rendered as "—"). */
  sets: number | null;
  /** `null` when the routine does not specify reps (rendered as "—"). */
  reps: string | null;
  /** Optional extras are shown but never required to finish a day. */
  optional?: boolean;
  /** Short hint shown instead of sets/reps, for items that have none. */
  detail?: string;
};

export type WorkoutDay = {
  id: DayId;
  /** e.g. "Push" */
  title: string;
  /** e.g. "Chest, Shoulders & Triceps" */
  focus: string;
  exercises: Exercise[];
  isRecovery?: boolean;
};

export type WorkoutPlan = {
  id: PlanId;
  name: string;
  days: readonly WorkoutDay[];
};

/** A checkable row: either the warm-up or an exercise. */
export type ChecklistItem = Exercise & { kind: "warmup" | "exercise" };

export type WorkoutCompletion = {
  exerciseId: string;
  dayId: CompletionDayId;
  completedAt: number;
};
