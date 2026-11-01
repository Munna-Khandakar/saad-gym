"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  getNextExpiry,
  isValidWeight,
  readCompletions,
  readSelectedDay,
  readSelectedLevel,
  readWeights,
  SELECTED_DAY_KEY,
  SELECTED_LEVEL_KEY,
  STORAGE_KEY,
  WEIGHTS_KEY,
  writeCompletions,
  writeSelectedDay,
  writeSelectedLevel,
  writeWeights,
} from "@/lib/storage";
import { getChecklist, getPlanItemIds, getRequiredItems } from "@/data/workouts";
import type {
  CompletionDayId,
  DayId,
  LevelId,
  WeightEntry,
  WorkoutCompletion,
  WorkoutDay,
  WorkoutPlan,
} from "@/types/workout";

export type LoggedWeight = Pick<WeightEntry, "kg" | "updatedAt">;

type Snapshot = {
  selectedDay: DayId;
  selectedLevel: LevelId;
  /** exerciseId → completedAt */
  completions: ReadonlyMap<string, number>;
  /** exerciseId → last logged weight */
  weights: ReadonlyMap<string, LoggedWeight>;
};

/** Safety-net re-check while the app is open, independent of the expiry timer. */
const POLL_INTERVAL = 30 * 1000;
/** Cap on the precise expiry timer so a throttled/suspended timer can't drift far. */
const MAX_TIMER_DELAY = 60 * 1000;

/*
 * A tiny external store over localStorage. `Date.now()` is the only source of
 * truth for expiry; timers and browser events merely trigger a re-read, which
 * prunes expired entries and notifies subscribers if anything changed.
 */
let snapshot: Snapshot | null = null;
let snapshotKey = "";
let stored: WorkoutCompletion[] = [];
const listeners = new Set<() => void>();
let expiryTimer: ReturnType<typeof setTimeout> | undefined;
let pollTimer: ReturnType<typeof setInterval> | undefined;

function load(): void {
  const now = Date.now();
  stored = readCompletions(now);
  const weights = readWeights(now);
  const selectedDay = readSelectedDay();
  const selectedLevel = readSelectedLevel();
  const key = [
    selectedDay,
    selectedLevel,
    stored
      .map((c) => `${c.exerciseId}:${c.completedAt}`)
      .sort()
      .join(","),
    weights
      .map((w) => `${w.exerciseId}:${w.kg}:${w.updatedAt}`)
      .sort()
      .join(","),
  ].join("|");
  if (key !== snapshotKey || !snapshot) {
    snapshotKey = key;
    snapshot = {
      selectedDay,
      selectedLevel,
      completions: new Map(stored.map((c) => [c.exerciseId, c.completedAt])),
      weights: new Map(weights.map((w) => [w.exerciseId, { kg: w.kg, updatedAt: w.updatedAt }])),
    };
  }
}

function scheduleExpiryCheck(): void {
  clearTimeout(expiryTimer);
  const next = getNextExpiry(stored);
  if (next === null || listeners.size === 0) return;
  // Small buffer so the check lands just after the 4-hour boundary.
  const delay = Math.min(Math.max(next - Date.now() + 50, 0), MAX_TIMER_DELAY);
  expiryTimer = setTimeout(refresh, delay);
}

function refresh(): void {
  const previous = snapshot;
  load();
  scheduleExpiryCheck();
  if (snapshot !== previous) listeners.forEach((listener) => listener());
}

function onVisibilityChange(): void {
  if (document.visibilityState === "visible") refresh();
}

const WATCHED_KEYS = new Set([STORAGE_KEY, SELECTED_DAY_KEY, SELECTED_LEVEL_KEY, WEIGHTS_KEY]);

function onStorage(event: StorageEvent): void {
  if (event.key === null || WATCHED_KEYS.has(event.key)) refresh();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("storage", onStorage);
    pollTimer = setInterval(refresh, POLL_INTERVAL);
    refresh();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("storage", onStorage);
      clearInterval(pollTimer);
      clearTimeout(expiryTimer);
    }
  };
}

function getSnapshot(): Snapshot {
  if (!snapshot) load();
  return snapshot!;
}

/** localStorage doesn't exist on the server — render a placeholder until hydrated. */
function getServerSnapshot(): Snapshot | null {
  return null;
}

export type DayProgress = {
  completed: number;
  total: number;
  percent: number;
  isComplete: boolean;
  /** When the last required item was ticked, if the day is complete. */
  finishedAt: number | null;
};

export type CycleProgress = {
  daysDone: number;
  totalDays: number;
  isComplete: boolean;
  /** When the first item of this cycle was ticked. */
  startedAt: number | null;
  /** When the final day was finished, if the cycle is complete. */
  finishedAt: number | null;
};

export function useWorkoutProgress() {
  const state = useSyncExternalStore<Snapshot | null>(subscribe, getSnapshot, getServerSnapshot);

  const selectDay = useCallback((dayId: DayId) => {
    writeSelectedDay(dayId);
    refresh();
  }, []);

  const selectLevel = useCallback((levelId: LevelId) => {
    writeSelectedLevel(levelId);
    refresh();
  }, []);

  /** Saves the weight for an exercise, or removes it when `kg` is `null`. */
  const setWeight = useCallback((exerciseId: string, kg: number | null) => {
    const now = Date.now();
    const next = readWeights(now).filter((w) => w.exerciseId !== exerciseId);
    if (kg !== null && isValidWeight(kg)) next.push({ exerciseId, kg, updatedAt: now });
    writeWeights(next);
    refresh();
  }, []);

  const weightFor = useCallback(
    (exerciseId: string): LoggedWeight | null => state?.weights.get(exerciseId) ?? null,
    [state],
  );

  const setCompleted = useCallback((exerciseId: string, dayId: CompletionDayId, completed: boolean) => {
    const now = Date.now();
    // Re-read so we never write back entries that expired since the last render.
    const next = readCompletions(now).filter((c) => c.exerciseId !== exerciseId);
    if (completed) next.push({ exerciseId, dayId, completedAt: now });
    writeCompletions(next);
    refresh();
  }, []);

  const resetDay = useCallback((day: WorkoutDay) => {
    // Match on the day's own items: day ids alone aren't unique across plans.
    const ids = new Set(getChecklist(day).map((item) => item.id));
    writeCompletions(readCompletions(Date.now()).filter((c) => !ids.has(c.exerciseId)));
    refresh();
  }, []);

  const isCompleted = useCallback(
    (exerciseId: string) => state?.completions.has(exerciseId) ?? false,
    [state],
  );

  const resetCycle = useCallback((plan: WorkoutPlan) => {
    const ids = getPlanItemIds(plan);
    writeCompletions(readCompletions(Date.now()).filter((c) => !ids.has(c.exerciseId)));
    refresh();
  }, []);

  const progressFor = useCallback(
    (day: WorkoutDay): DayProgress => {
      const times = getRequiredItems(day)
        .map((item) => state?.completions.get(item.id))
        .filter((time): time is number => time !== undefined);
      const total = getRequiredItems(day).length;
      const completed = times.length;
      const isComplete = total > 0 && completed === total;
      return {
        completed,
        total,
        percent: total === 0 ? 0 : Math.round((completed / total) * 100),
        isComplete,
        finishedAt: isComplete ? Math.max(...times) : null,
      };
    },
    [state],
  );

  const cycleFor = useCallback(
    (plan: WorkoutPlan): CycleProgress => {
      const days = plan.days.map(progressFor);
      const daysDone = days.filter((day) => day.isComplete).length;
      const totalDays = plan.days.length;
      const isComplete = totalDays > 0 && daysDone === totalDays;
      const ids = getPlanItemIds(plan);
      const ticked = [...(state?.completions ?? [])]
        .filter(([id]) => ids.has(id))
        .map(([, time]) => time);
      return {
        daysDone,
        totalDays,
        isComplete,
        startedAt: ticked.length > 0 ? Math.min(...ticked) : null,
        finishedAt: isComplete ? Math.max(...days.map((day) => day.finishedAt ?? 0)) : null,
      };
    },
    [state, progressFor],
  );

  return {
    hydrated: state !== null,
    selectedDay: state?.selectedDay ?? null,
    selectDay,
    selectedLevel: state?.selectedLevel ?? null,
    selectLevel,
    weightFor,
    setWeight,
    isCompleted,
    setCompleted,
    resetDay,
    resetCycle,
    progressFor,
    cycleFor,
  };
}
