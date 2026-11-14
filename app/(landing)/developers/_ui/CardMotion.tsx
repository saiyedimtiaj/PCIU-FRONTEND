"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

const MAX_TILT = 8;

/**
 * Rises in as the card scrolls into view (`reveal-rise`, pure CSS) and
 * tilts toward a mouse pointer. The tilt writes two CSS variables straight
 * to the element, once per frame, so it never re-renders React and ships no
 * animation library. Reduced-motion users get neither.
 */
export default function CardMotion({ index, children }: { index: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function setTilt(x: number, y: number) {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      ref.current?.style.setProperty("--tilt-x", `${x}deg`);
      ref.current?.style.setProperty("--tilt-y", `${y}deg`);
    });
  }

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt(-y * MAX_TILT * 2, x * MAX_TILT * 2);
  }

  // Cards in the same row start rising a little after one another.
  const stagger = (index % 3) * 8;

  return (
    <div className="h-full perspective-[1000px]">
      <div
        className="reveal-rise h-full"
        style={{ animationRange: `entry ${stagger}% entry ${40 + stagger}%` }}
      >
        <div
          ref={ref}
          className="h-full transition-transform duration-300 ease-out motion-safe:transform-[rotateX(var(--tilt-x))_rotateY(var(--tilt-y))]"
          style={{ "--tilt-x": "0deg", "--tilt-y": "0deg" } as CSSProperties}
          onPointerMove={handleMove}
          onPointerLeave={() => setTilt(0, 0)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
