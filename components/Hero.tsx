"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { profile, isPlaceholder } from "@/data/profile";
import MagneticButton from "./MagneticButton";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Editorial hero: the name set as an oversized wordmark that fills the
 * viewport width, with everything else pushed to the corners as small
 * metadata. The type is the artwork — no decoration competes with it.
 */
export default function Hero({ ready }: { ready: boolean }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const state = reduced || ready ? "show" : "hidden";
  const name = isPlaceholder(profile.name) ? "Your Name" : profile.name;
  const title = isPlaceholder(profile.title) ? "" : profile.title;

  // The wordmark is split per character so it can rise in sequence.
  const letters = name.replace(/\s+/g, " ").split("");

  const rise = {
    hidden: { y: "115%" },
    show: (i: number) => ({
      y: 0,
      transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] as const, delay: i },
    }),
  };
  const fade = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const, delay: i },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between px-5 pb-6 pt-24 sm:px-8 sm:pb-8"
    >
      {/* Top row: positioning statement left, nothing competing with it. */}
      <motion.div
        variants={fade}
        custom={0.05}
        initial="hidden"
        animate={state}
        className="max-w-xl"
      >
        <p className="text-[clamp(1rem,1.5vw,1.35rem)] font-medium leading-[1.25] tracking-[-0.02em]">
          {profile.statement[0]}
          <br />
          <span className="text-[var(--color-muted)]">
            {profile.statement.slice(1).join(" ")}
          </span>
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <MagneticButton>
            <a
              href="#work"
              data-cursor="VIEW"
              className="group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[var(--color-fg)] px-6 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-bg)] transition-opacity hover:opacity-85"
            >
              View work
              <ArrowRight
                size={14}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </MagneticButton>

          {profile.resume ? (
            <MagneticButton>
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                data-cursor="↗"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-fg)] px-6 text-[11px] font-medium uppercase tracking-[0.14em]"
              >
                Resume
                <ArrowUpRight size={14} strokeWidth={2} />
              </a>
            </MagneticButton>
          ) : (
            <span
              title="Add public/resume.pdf, then set profile.resume"
              className="inline-flex min-h-11 cursor-not-allowed items-center rounded-full border border-dashed border-[var(--color-line)] px-6 text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]"
            >
              Resume — not added
            </span>
          )}
        </div>
      </motion.div>

      {/* The wordmark. Sized in vw so it always spans the viewport. */}
      <motion.h1
        style={reduced ? undefined : { y, opacity }}
        className="my-4 select-none text-center font-medium tracking-[-0.055em]"
      >
        <span className="flex justify-center overflow-hidden py-[0.12em]">
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block text-[19.5vw] leading-[1.05]"
              variants={rise}
              custom={0.15 + i * 0.035}
              initial="hidden"
              animate={state}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </span>
      </motion.h1>

      {/* Bottom row: role, links, scroll cue — small, cornered, quiet. */}
      <motion.div
        variants={fade}
        custom={0.55}
        initial="hidden"
        animate={state}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
          {title}
          {profile.location ? ` — ${profile.location}` : ""}
        </p>

        <div className="flex items-center gap-5">
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="↗"
              className="link-underline text-[11px] font-medium uppercase tracking-[0.14em]"
            >
              GitHub
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="↗"
              className="link-underline text-[11px] font-medium uppercase tracking-[0.14em]"
            >
              LinkedIn
            </a>
          )}
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-faint)]">
            01
          </span>
        </div>
      </motion.div>
    </section>
  );
}
