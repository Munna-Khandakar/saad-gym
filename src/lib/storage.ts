import {
  DEFAULT_DAY_ID,
  DEFAULT_LEVEL_ID,
  EXPIRING_ITEM_IDS,
  isDayId,
  isLevelId,
  ITEM_DAY_INDEX,
  WEIGHT_EXERCISE_IDS,
} from "@/data/workouts";
import { LEGACY_V1_IDS } from "@/lib/legacyIds";
import type { DayId, ExerciseId, LevelId, WeightEntry, WorkoutCompletion } from "@/types/workout";

export const STORAGE_KEY = "saad-gym-workout-v2";
export const SELECTED_DAY_KEY = "saad-gym-selected-day-v1";
export const SELECTED_LEVEL_KEY = "saad-gym-selected-level-v1";
export const WEIGHTS_KEY = "saad-gym-weights-v2";
/** v1 keyed ticks and weights by plan-slot id; see `migrateV1`. */
const LEGACY_STORAGE_KEY = "saad-gym-workout-v1";
const LEGACY_WEIGHTS_KEY = "saad-gym-weights-v1";
/** Upper bound for a logged weight; anything above is treated as a typo. */
export const MAX_WEIGHT_KG = 999;
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
  { itemId, completedAt }: Pick<WorkoutCompletion, "itemId" | "completedAt">,
  now: number,
): boolean {
  return EXPIRING_ITEM_IDS.has(itemId) && now - completedAt >= EXPIRY_TIME;
}

function isValidCompletion(value: unknown, now: number): value is WorkoutCompletion {
  if (typeof value !== "object" || value === null) return false;
  const { itemId, dayId, completedAt } = value as Record<string, unknown>;
  return (
    typeof itemId === "string" &&
    typeof dayId === "number" &&
    ITEM_DAY_INDEX.get(itemId) === dayId &&
    typeof completedAt === "number" &&
    Number.isFinite(completedAt) &&
    completedAt <= now + MAX_CLOCK_SKEW &&
    !isExpired({ itemId, completedAt }, now)
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
  migrateV1(storage);

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
    const { itemId, dayId, completedAt } = entry;
    const existing = byId.get(itemId);
    if (!existing || existing.completedAt < completedAt) {
      byId.set(itemId, { itemId, dayId, completedAt });
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

function readPreference<T>(
  key: string,
  parse: (raw: string) => unknown,
  isValid: (value: unknown) => value is T,
  fallback: T,
): T {
  try {
    const raw = getStorage()?.getItem(key);
    if (raw == null) return fallback;
    const value = parse(raw);
    return isValid(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writePreference(key: string, value: string | number): void {
  try {
    getStorage()?.setItem(key, String(value));
  } catch {
    // Ignore — remembering the selection is a convenience.
  }
}

export const readSelectedDay = (): DayId =>
  readPreference(SELECTED_DAY_KEY, Number, isDayId, DEFAULT_DAY_ID);
export const writeSelectedDay = (dayId: DayId) => writePreference(SELECTED_DAY_KEY, dayId);

export const readSelectedLevel = (): LevelId =>
  readPreference(SELECTED_LEVEL_KEY, String, isLevelId, DEFAULT_LEVEL_ID);
export const writeSelectedLevel = (levelId: LevelId) => writePreference(SELECTED_LEVEL_KEY, levelId);

type StoredWeights = { weights: WeightEntry[] };

export function isValidWeight(kg: unknown): kg is number {
  return typeof kg === "number" && Number.isFinite(kg) && kg > 0 && kg <= MAX_WEIGHT_KG;
}

function isValidWeightEntry(value: unknown, now: number): value is WeightEntry {
  if (typeof value !== "object" || value === null) return false;
  const { exerciseId, kg, updatedAt } = value as Record<string, unknown>;
  return (
    typeof exerciseId === "string" &&
    WEIGHT_EXERCISE_IDS.has(exerciseId as ExerciseId) &&
    isValidWeight(kg) &&
    typeof updatedAt === "number" &&
    Number.isFinite(updatedAt) &&
    updatedAt <= now + MAX_CLOCK_SKEW
  );
}

/**
 * Reads logged weights, discarding anything invalid, unknown or duplicated, and
 * writes the cleaned list back if anything was dropped. Weights are never
 * cleared by day/cycle resets, so the lifter sees them next session.
 */
export function readWeights(now: number = Date.now()): WeightEntry[] {
  const storage = getStorage();
  if (!storage) return [];
  migrateV1(storage);

  let raw: string | null;
  try {
    raw = storage.getItem(WEIGHTS_KEY);
  } catch {
    return [];
  }
  if (raw === null) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    writeWeights([]);
    return [];
  }

  const entries =
    typeof parsed === "object" && parsed !== null && Array.isArray((parsed as StoredWeights).weights)
      ? (parsed as StoredWeights).weights
      : null;
  if (!entries) {
    writeWeights([]);
    return [];
  }

  const byId = new Map<ExerciseId, WeightEntry>();
  for (const entry of entries as unknown[]) {
    if (!isValidWeightEntry(entry, now)) continue;
    const { exerciseId, kg, updatedAt } = entry;
    const existing = byId.get(exerciseId);
    if (!existing || existing.updatedAt < updatedAt) byId.set(exerciseId, { exerciseId, kg, updatedAt });
  }

  const cleaned = [...byId.values()];
  if (cleaned.length !== entries.length) writeWeights(cleaned);
  return cleaned;
}

export function writeWeights(weights: WeightEntry[]): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    if (weights.length === 0) {
      storage.removeItem(WEIGHTS_KEY);
    } else {
      const state: StoredWeights = { weights };
      storage.setItem(WEIGHTS_KEY, JSON.stringify(state));
    }
  } catch {
    // Quota exceeded or storage disabled — the UI still works for this session.
  }
}

/** Timestamp at which the earliest expiring completion expires, or `null`. */
export function getNextExpiry(completions: WorkoutCompletion[]): number | null {
  const expiring = completions.filter((c) => EXPIRING_ITEM_IDS.has(c.itemId));
  if (expiring.length === 0) return null;
  return Math.min(...expiring.map((c) => c.completedAt)) + EXPIRY_TIME;
}

function readEntries(storage: Storage, key: string, field: string): unknown[] {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    const list = typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>)[field] : null;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

/**
 * Moves v1 data (keyed by plan-slot ids such as "d3-leg-extension") into the v2
 * keys: ticks to the derived item ids, weights to catalog exercise ids. Entries
 * are appended and the v2 readers dedupe by newest timestamp, so when two old
 * slots map to the same exercise the most recent weight wins. Runs whenever v1
 * keys are present — cheap, and it also picks up writes from a stale tab.
 */
function migrateV1(storage: Storage): void {
  try {
    const oldTicks = storage.getItem(LEGACY_STORAGE_KEY);
    const oldWeights = storage.getItem(LEGACY_WEIGHTS_KEY);
    if (oldTicks === null && oldWeights === null) return;

    if (oldTicks !== null) {
      const moved = readEntries(storage, LEGACY_STORAGE_KEY, "completions").flatMap((value) => {
        const entry = asRecord(value);
        const legacy = typeof entry?.exerciseId === "string" ? LEGACY_V1_IDS.get(entry.exerciseId) : undefined;
        return entry && legacy ? [{ itemId: legacy.item, dayId: entry.dayId, completedAt: entry.completedAt }] : [];
      });
      if (moved.length > 0) {
        const current = readEntries(storage, STORAGE_KEY, "completions");
        storage.setItem(STORAGE_KEY, JSON.stringify({ completions: [...current, ...moved] }));
      }
      storage.removeItem(LEGACY_STORAGE_KEY);
    }

    if (oldWeights !== null) {
      const moved = readEntries(storage, LEGACY_WEIGHTS_KEY, "weights").flatMap((value) => {
        const entry = asRecord(value);
        const legacy = typeof entry?.exerciseId === "string" ? LEGACY_V1_IDS.get(entry.exerciseId) : undefined;
        return entry && legacy
          ? [{ exerciseId: legacy.exercise, kg: entry.kg, updatedAt: entry.updatedAt }]
          : [];
      });
      if (moved.length > 0) {
        const current = readEntries(storage, WEIGHTS_KEY, "weights");
        storage.setItem(WEIGHTS_KEY, JSON.stringify({ weights: [...current, ...moved] }));
      }
      storage.removeItem(LEGACY_WEIGHTS_KEY);
    }
  } catch {
    // Storage blocked or full — leave v1 in place and try again on the next read.
  }
}

let persistRequested = false;

/**
 * Asks the browser to exempt our data from eviction (e.g. Safari's 7-day cap
 * on script-written storage). Called after a user action, because some
 * browsers may show a prompt. Fire-and-forget; failure changes nothing.
 */
export function requestPersistentStorage(): void {
  if (persistRequested || typeof navigator === "undefined") return;
  persistRequested = true;
  try {
    const manager = navigator.storage;
    if (!manager?.persist || !manager.persisted) return;
    manager
      .persisted()
      .then((persisted) => (persisted ? undefined : manager.persist()))
      .catch(() => {});
  } catch {
    // Unsupported — nothing to do.
  }
}
