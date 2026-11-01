/** e.g. "Nov 3" in the viewer's locale. Client-only (depends on the device clock/locale). */
export function formatShortDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** e.g. 40 → "40", 42.5 → "42.5", 42.25 → "42.25" (no trailing zeros). */
export function formatKg(kg: number): string {
  return String(Math.round(kg * 100) / 100);
}
