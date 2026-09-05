"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, viewport } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Scroll-triggered reveal. Under reduced motion the child renders
 * immediately and unanimated — content is never gated behind motion.
 */
export default function SectionReveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduced = usePrefersReducedMotion();
  const M = motion[as];

  if (reduced) return <M className={className}>{children}</M>;

  return (
    <M
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </M>
  );
}
