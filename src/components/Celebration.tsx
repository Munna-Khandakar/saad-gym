import type { CSSProperties } from "react";

const PIECES = 18;
const COLORS = ["#a3e635", "#d9f99d", "#fafafa", "#65a30d"];

/** Deterministic burst pattern (no randomness, so renders stay pure). */
const pieces = Array.from({ length: PIECES }, (_, i) => {
  const angle = (i / PIECES) * Math.PI * 2;
  const distance = 70 + (i % 3) * 28;
  return {
    color: COLORS[i % COLORS.length],
    round: i % 2 === 0,
    style: {
      "--dx": `${Math.round(Math.cos(angle) * distance)}px`,
      "--dy": `${Math.round(Math.sin(angle) * distance)}px`,
      "--rot": `${(i % 2 === 0 ? 1 : -1) * (180 + i * 25)}deg`,
      animationDelay: `${(i % 4) * 40}ms`,
    } as CSSProperties,
  };
});

/** CSS-only confetti burst, centred on its positioned parent. */
export function ConfettiBurst() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-1/2 size-0 motion-reduce:hidden"
    >
      {pieces.map((piece, i) => (
        <span
          key={i}
          className={`absolute -top-1 -left-1 size-2 animate-confetti ${piece.round ? "rounded-full" : "rounded-[2px]"}`}
          style={{ ...piece.style, backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}
