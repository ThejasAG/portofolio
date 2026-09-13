"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { profile } from "@/data/profile";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const FILL_DURATION = 1000; // ms — progress bar fill time

/**
 * Intro overlay:
 *  1. Progress bar fills + initials rise
 *  2. Status text types in
 *  3. onDone() fires (hero starts revealing underneath)
 *  4. Overlay slides up and out
 *
 * Under reduced motion: calls onDone() immediately and renders nothing.
 */
export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(true);      // controls AnimatePresence
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const calledDone = useRef(false);

  const progress = useMotionValue(0);
  const percent = useTransform(progress, (p) =>
    String(Math.round(p * 100)).padStart(3, "0")
  );

  const callDone = () => {
    if (calledDone.current) return;
    calledDone.current = true;
    onDone();            // hero starts
    setShow(false);      // overlay exit animation starts
  };

  // Fill progress bar
  useEffect(() => {
    if (reduced) {
      callDone();
      return;
    }

    document.body.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / FILL_DURATION, 1);
      progress.set(t);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        const status = profile.status ?? "";
        if (status) {
          setIsTyping(true);   // triggers typing effect below
        } else {
          setTimeout(() => callDone(), 200);
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Typewriter for status line
  useEffect(() => {
    if (!isTyping) return;
    const statusText = profile.status ?? "";
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(statusText.slice(0, i));
      if (i >= statusText.length) {
        clearInterval(iv);
        setTimeout(() => callDone(), 380);
      }
    }, 26);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]);

  // Unlock scroll when overlay exits
  const handleExitComplete = () => {
    document.body.style.overflow = "";
  };

  if (reduced) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[80] flex flex-col justify-between overflow-hidden bg-[var(--color-bg)] px-6 py-8 sm:px-10"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Soft radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
              filter: "blur(90px)",
              opacity: 0.13,
            }}
          />

          {/* Top spacer */}
          <div />

          {/* Initials + typewriter */}
          <div className="relative flex flex-col items-start gap-5">
            <span className="mask-line">
              <motion.span
                className="block select-none font-medium leading-[0.85] tracking-[-0.05em]"
                style={{ fontSize: "clamp(3rem,14vw,9rem)" }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                {profile.initials}
              </motion.span>
            </span>

            <motion.p
              className="text-meta min-h-[1rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: isTyping ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {typed}
              {isTyping && typed.length < (profile.status?.length ?? 0) && (
                <span
                  className="ml-0.5 inline-block animate-pulse opacity-60"
                  aria-hidden
                >
                  _
                </span>
              )}
            </motion.p>
          </div>

          {/* Progress bar + counter */}
          <div className="relative space-y-3">
            <motion.span
              className="text-meta tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {percent}
            </motion.span>
            <div className="h-px w-full overflow-hidden bg-[var(--color-line)]">
              <motion.div
                className="h-full origin-left bg-[var(--color-fg)]"
                style={{ scaleX: progress }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
