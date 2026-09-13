"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, EASE_SPRING, viewport } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * A line of type that rises from behind a clip with a spring overshoot.
 *
 * The animation is driven from the MASK, not the moving child: the child
 * starts translated fully outside the mask's overflow:hidden box, so an
 * observer attached to the child never sees it intersect and the line
 * stays hidden forever. Watching the mask and driving the child through
 * a parent→child variant keeps the trigger on a box that is actually
 * on screen.
 */
export default function MaskReveal({
  children,
  delay = 0,
  className = "",
  spring = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Use spring physics for a subtle overshoot on completion. */
  spring?: boolean;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <span className={`mask-line ${className}`}>
        <span className="block">{children}</span>
      </span>
    );
  }

  return (
    <motion.span
      className={`mask-line ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: "110%" }, show: { y: 0 } }}
        transition={
          spring
            ? { duration: 1.05, ease: EASE_SPRING, delay }
            : { duration: 0.92, ease: EASE, delay }
        }
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
