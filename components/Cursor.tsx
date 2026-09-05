"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Custom cursor for fine-pointer devices only.
 *
 * Elements opt into a label with `data-cursor="VIEW"` (or "EXPLORE", "↗").
 * Any other interactive element just widens the dot. The native cursor is
 * only hidden once this has mounted, so it never disappears on touch or
 * when the component fails to load.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Light spring: enough smoothing to feel considered, not laggy.
  const sx = useSpring(x, { stiffness: 900, damping: 45, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 900, damping: 45, mass: 0.4 });

  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("cursor-active");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const el = (e.target as Element | null)?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='button'], input, textarea, select"
      );
      if (!el) {
        setActive(false);
        setLabel(null);
        return;
      }
      setActive(true);
      setLabel(el.dataset.cursor ?? null);
    };

    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      document.body.classList.remove("cursor-active");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: label ? 76 : active ? 40 : 10,
        height: label ? 76 : active ? 40 : 10,
        opacity: visible ? 1 : 0,
        backgroundColor: label ? "var(--color-accent)" : "var(--color-fg)",
      }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence>
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
