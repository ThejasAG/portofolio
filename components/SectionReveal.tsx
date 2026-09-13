"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, slideFromLeft, slideFromRight, scaleUp, viewport } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Direction = "up" | "left" | "right" | "scale" | "none";

/**
 * Scroll-triggered reveal with direction support.
 * Under reduced motion the child renders immediately — content is never
 * gated behind motion.
 */
export default function SectionReveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "p";
  direction?: Direction;
}) {
  const reduced = usePrefersReducedMotion();
  const M = motion[as];

  if (reduced || direction === "none") {
    return <M className={className}>{children}</M>;
  }

  const variants =
    direction === "left"
      ? slideFromLeft
      : direction === "right"
      ? slideFromRight
      : direction === "scale"
      ? scaleUp
      : fadeUp;

  return (
    <M
      className={className}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </M>
  );
}
