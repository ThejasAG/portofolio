"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Entry transition for routed pages: a wipe layer clears upward while the
 * content fades in. Kept short so navigation still feels instant.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[75] bg-[var(--color-fg)]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        style={{ originY: 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
