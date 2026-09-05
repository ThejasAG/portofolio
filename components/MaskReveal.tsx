"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, viewport } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * A line of type that rises from behind a clip.
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
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
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
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
