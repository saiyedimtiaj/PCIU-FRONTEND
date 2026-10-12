"use client";

import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type Direction = "left" | "right" | "up";

const OFFSET = 24;

type ScrollRevealProps = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  amount?: number;
  className?: string;
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  amount = 0.15,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount });

  const x = direction === "left" ? -OFFSET : direction === "right" ? OFFSET : 0;
  const y = direction === "up" ? OFFSET : 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
