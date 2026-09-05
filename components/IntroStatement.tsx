"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * The signature scroll moment: a large sentence starts muted and each word
 * resolves to full contrast as scroll progress passes over it.
 *
 * Edit the sentence here. Words wrapped in `[]` are rendered in the accent
 * colour, e.g. "I build software that [solves] real [problems]".
 */
const SENTENCE =
  "I build software and then try to [break] it, because the interesting part is how it [fails].";

function Word({
  word,
  range,
  progress,
  accent,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  accent: boolean;
}) {
  // Floor is 0.6, not near-zero: the muted state must still clear
  // contrast minimums for a reader who never scrolls the sentence.
  const opacity = useTransform(progress, range, [0.6, 1]);
  return (
    <span className="relative mr-[0.28em] inline-block">
      <motion.span
        style={{ opacity }}
        className={accent ? "text-[var(--color-accent)]" : undefined}
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function IntroStatement() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    // The reveal runs across the middle of the viewport pass, so it
    // completes well before the section scrolls away.
    offset: ["start 0.85", "end 0.45"],
  });

  const words = SENTENCE.split(" ").map((raw) => ({
    accent: raw.startsWith("[") || raw.includes("["),
    text: raw.replace(/[[\]]/g, ""),
  }));

  return (
    <section className="px-6 py-[18vh] sm:px-10" aria-label="Statement">
      <div ref={ref} className="mx-auto max-w-[1600px]">
        <p className="text-[clamp(1.85rem,6.2vw,5.25rem)] font-medium leading-[1.06] tracking-[-0.035em]">
          {reduced
            ? words.map((w, i) => (
                <span
                  key={i}
                  className={`mr-[0.28em] inline-block ${
                    w.accent ? "text-[var(--color-accent)]" : ""
                  }`}
                >
                  {w.text}
                </span>
              ))
            : words.map((w, i) => {
                const start = i / words.length;
                const end = (i + 1) / words.length;
                return (
                  <Word
                    key={i}
                    word={w.text}
                    accent={w.accent}
                    range={[start, end]}
                    progress={scrollYProgress}
                  />
                );
              })}
        </p>
      </div>
    </section>
  );
}
