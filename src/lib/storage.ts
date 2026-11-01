import { DEFAULT_DAY_ID, EXPIRING_ITEM_IDS, isDayId, ITEM_DAY_INDEX } from "@/data/workouts";
import type { DayId, WorkoutCompletion } from "@/types/workout";

export const STORAGE_KEY = "saad-gym-workout-v1";
export const SELECTED_DAY_KEY = "saad-gym-selected-day-v1";
/** How long a warm-up tick lasts. Exercise ticks last until the cycle is reset. */
export const EXPIRY_TIME = 4 * 60 * 60 * 1000;

/** Tolerate small clock adjustments; anything further in the future is bogus. */
const MAX_CLOCK_SKEW = 5 * 60 * 1000;

type StoredState = { completions: WorkoutCompletion[] };

function getStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    // Accessing localStorage can throw (e.g. blocked cookies / sandboxed iframes).
    return null;
  }
}

export function isExpired(
  { exerciseId, completedAt }: Pick<WorkoutCompletion, "exerciseId" | "completedAt">,
  now: number,
): boolean {
  return EXPIRING_ITEM_IDS.has(exerciseId) && now - completedAt >= EXPIRY_TIME;
}

function isValidCompletion(value: unknown, now: number): value is WorkoutCompletion {
  if (typeof value !== "object" || value === null) return false;
  const { exerciseId, dayId, completedAt } = value as Record<string, unknown>;
  return (
    typeof exerciseId === "string" &&
    typeof dayId === "number" &&
    ITEM_DAY_INDEX.get(exerciseId) === dayId &&
    typeof completedAt === "number" &&
    Number.isFinite(completedAt) &&
    completedAt <= now + MAX_CLOCK_SKEW &&
    !isExpired({ exerciseId, completedAt }, now)
  );
}

/**
 * Reads completions, discarding anything invalid, unknown, duplicated or expired.
 * If anything was discarded the cleaned list is written back, so expired
 * entries never linger in localStorage.
 */
export function readCompletions(now: number = Date.now()): WorkoutCompletion[] {
  const storage = getStorage();
  if (!storage) return [];

  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (raw === null) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    writeCompletions([]);
    return [];
  }

  const entries =
    typeof parsed === "object" && parsed !== null && Array.isArray((parsed as StoredState).completions)
      ? (parsed as StoredState).completions
      : null;
  if (!entries) {
    writeCompletions([]);
    return [];
  }

  // Keep the most recent completion per item.
  const byId = new Map<string, WorkoutCompletion>();
  for (const entry of entries as unknown[]) {
    if (!isValidCompletion(entry, now)) continue;
    const { exerciseId, dayId, completedAt } = entry;
    const existing = byId.get(exerciseId);
    if (!existing || existing.completedAt < completedAt) {
      byId.set(exerciseId, { exerciseId, dayId, completedAt });
    }
  }

  const cleaned = [...byId.values()];
  if (cleaned.length !== entries.length) writeCompletions(cleaned);
  return cleaned;
}

export function writeCompletions(completions: WorkoutCompletion[]): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    if (completions.length === 0) {
      storage.removeItem(STORAGE_KEY);
    } else {
      const state: StoredState = { completions };
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // Quota exceeded or storage disabled — the UI still works for this session.
  }
}

function readPreference<T>(key: string, isValid: (value: unknown) => value is T, fallback: T): T {
  try {
    const value = Number(getStorage()?.getItem(key));
    return isValid(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writePreference(key: string, value: number): void {
  try {
    getStorage()?.setItem(key, String(value));
  } catch {
    // Ignore — remembering the selection is a convenience.
  }
}

export const readSelectedDay = (): DayId => readPreference(SELECTED_DAY_KEY, isDayId, DEFAULT_DAY_ID);
export const writeSelectedDay = (dayId: DayId) => writePreference(SELECTED_DAY_KEY, dayId);

/** Timestamp at which the earliest expiring completion expires, or `null`. */
export function getNextExpiry(completions: WorkoutCompletion[]): number | null {
  const expiring = completions.filter((c) => EXPIRING_ITEM_IDS.has(c.exerciseId));
  if (expiring.length === 0) return null;
  return Math.min(...expiring.map((c) => c.completedAt)) + EXPIRY_TIME;
}
