"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: string; // e.g. "500+", "120", "6", "1K+"
  className?: string;
}

/**
 * Animates a numeric prefix from 0 up to the target, preserving any
 * non-numeric prefix/suffix (e.g. "1K+" counts 0 -> 1, then shows "1K+";
 * "500+" counts 0 -> 500, then shows "500+"). Re-plays every time the
 * element scrolls into view (not just once).
 */
export default function StatCounter({ value, className }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value.replace(/[0-9]/g, "0"));
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const match = value.match(/(\d+)/);
    if (!match || !ref.current) return;

    const target = parseInt(match[1], 10);
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + match[1].length);

    const runAnimation = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      const duration = 2500;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        setDisplay(`${prefix}${current}${suffix}`);
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
        } else {
          // Reset to 0 when it leaves view, so it counts up again on re-entry
          if (frameRef.current) cancelAnimationFrame(frameRef.current);
          setDisplay(`${prefix}0${suffix}`);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return (
    <div ref={ref} className={className}>
      {display}
    </div>
  );
}