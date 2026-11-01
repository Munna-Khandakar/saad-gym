/** e.g. "Nov 3" in the viewer's locale. Client-only (depends on the device clock/locale). */
export function formatShortDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
