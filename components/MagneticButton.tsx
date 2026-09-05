"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max travel toward the cursor, in px. Kept subtle by design. */
  strength?: number;
};

/**
 * Wraps a child in a magnetic pull. Disabled on touch and reduced motion,
 * where it renders as a plain span so the child keeps working normally.
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 10,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  if (!fine || reduced) {
    return <span className={className}>{children}</span>;
  }

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Offset from centre, normalised to [-1, 1], then scaled to `strength`.
    x.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength);
    y.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
