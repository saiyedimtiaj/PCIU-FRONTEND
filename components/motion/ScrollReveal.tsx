"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Direction = "left" | "right" | "up";

const OFFSET = 48;

function buildVariants(
  direction: Direction,
  delay: number,
  prefersReducedMotion: boolean,
): Variants {
  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.3, delay },
      },
    };
  }

  const x = direction === "left" ? -OFFSET : direction === "right" ? OFFSET : 0;

  const y = direction === "up" ? OFFSET : 0;

  return {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay,
      },
    },
  };
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  amount = 0.25,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  amount?: number;
  className?: string;
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();

    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  const variants = buildVariants(direction, delay, prefersReducedMotion);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
