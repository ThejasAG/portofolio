"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const DURATION = 850;

/**
 * ~0.85s intro, plus a 0.6s lift. It does not gate content — the page below is already
 * rendered and in the DOM, this only overlays it, so nothing is
 * artificially delayed. Skipped entirely under reduced motion.
 */
export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [done, setDone] = useState(false);

  // Progress lives in a motion value: animating it re-renders nothing.
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (p) =>
    String(Math.round(p * 100)).padStart(3, "0")
  );

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }

    document.body.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      progress.set(t);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        document.body.style.overflow = "";
        setDone(true);
        onDone();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [reduced, progress, onDone]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col justify-between bg-[var(--color-bg)] px-6 py-8 sm:px-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div />

          <div className="flex items-end justify-between">
            <span className="mask-line">
              <motion.span
                className="block text-[clamp(3rem,14vw,9rem)] font-medium leading-[0.85] tracking-[-0.05em]"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {profile.initials}
              </motion.span>
            </span>
            <motion.span className="text-meta tabular-nums">{percent}</motion.span>
          </div>

          <div className="h-px w-full bg-[var(--color-line)]">
            <motion.div
              className="h-full origin-left bg-[var(--color-fg)]"
              style={{ scaleX: progress }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
