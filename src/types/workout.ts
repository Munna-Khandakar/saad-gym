export type DayId = 1 | 2 | 3 | 4 | 5 | 6;
export type LevelId = "beginner" | "intermediate" | "advanced";
/** URL slug of a plan, e.g. "beginner-1". */
export type PlanId = `${LevelId}-${number}`;
/** A workout day, or 0 for the general warm-up. */
export type CompletionDayId = DayId | 0;

export type Exercise = {
  /** Stable, unique identifier — used as the localStorage key for ticks and weights. */
  id: string;
  name: string;
  /** Optional extras are shown but never required to finish a day. */
  optional?: boolean;
  /** Short hint shown under the name, for items such as the rest day. */
  detail?: string;
  /** How long the item takes, e.g. "10 min" for the warm-up. */
  duration?: string;
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

export type ExperienceLevel = {
  id: LevelId;
  name: string;
};

export type WorkoutPlan = {
  id: PlanId;
  level: LevelId;
  /** Position within its level, shown on the plan card. */
  number: number;
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

/** The last weight logged for an exercise. Kept across cycles. */
export type WeightEntry = {
  exerciseId: string;
  kg: number;
  updatedAt: number;
};
