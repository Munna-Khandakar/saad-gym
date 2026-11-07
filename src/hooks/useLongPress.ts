"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";

/** How long a row must be held before the long-press action fires. */
export const HOLD_DURATION = 1000;
/** Movement beyond this many px means the user is scrolling, not holding. */
const MOVE_TOLERANCE = 10;

/**
 * Press-and-hold on an element. Returns `holding` (for a progress indicator) and
 * handlers to spread onto the element. When the hold fires, the click that
 * follows the release is swallowed, so holding a checkbox row never toggles it.
 */
export function useLongPress(onLongPress: (() => void) | undefined) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const fired = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!onLongPress) return { holding: false, handlers: {} };

  const cancel = () => {
    clearTimeout(timer.current);
    origin.current = null;
    setHolding(false);
  };

  const handlers = {
    onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return;
      // A new gesture: a hold that never produced a click must not swallow this one.
      fired.current = false;
      origin.current = { x: event.clientX, y: event.clientY };
      setHolding(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        fired.current = true;
        origin.current = null;
        setHolding(false);
        try {
          navigator.vibrate?.(15);
        } catch {
          // Haptics are a nicety; some browsers throw without user activation.
        }
        onLongPress();
      }, HOLD_DURATION);
    },
    onPointerMove(event: PointerEvent) {
      const start = origin.current;
      if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > MOVE_TOLERANCE) {
        cancel();
      }
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onClickCapture(event: MouseEvent) {
      if (!fired.current) return;
      fired.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
    // Stops the mobile press-and-hold menu from interrupting the gesture.
    onContextMenu(event: MouseEvent) {
      event.preventDefault();
    },
  };

  return { holding, handlers };
}
