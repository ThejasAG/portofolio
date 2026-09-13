"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { profile, isPlaceholder } from "@/data/profile";
import MagneticButton from "./MagneticButton";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Editorial hero: name wordmark fills the viewport width.
 * Aurora blobs create an atmospheric depth layer.
 * Status pill with pulsing indicator.
 * Scroll-bounce arrow at bottom centre.
 */
export default function Hero({ ready }: { ready: boolean }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // Failsafe: if parent never sets ready (edge case), show after 4.5 s
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForceShow(true), 4500);
    return () => clearTimeout(t);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const state = reduced || ready || forceShow ? "show" : "hidden";
  const name = isPlaceholder(profile.name) ? "Your Name" : profile.name;
  const title = isPlaceholder(profile.title) ? "" : profile.title;

  const letters = name.replace(/\s+/g, " ").split("");

  const rise = {
    hidden: { y: "115%" },
    show: (i: number) => ({
      y: 0,
      transition: {
        duration: 1.1,
        ease: [0.34, 1.56, 0.64, 1] as const,
        delay: i,
      },
    }),
  };
  const fade = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: i },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-6 pt-24 sm:px-8 sm:pb-8"
    >
      {/* ── Aurora background blobs ── */}
      {!reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Warm amber-orange blob — top left */}
          <div
            className="aurora-blob aurora-blob-1 absolute -left-[10%] -top-[15%] h-[55vw] w-[55vw] opacity-[0.14]"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
            }}
          />
          {/* Subtle neutral blob — bottom right */}
          <div
            className="aurora-blob aurora-blob-2 absolute -bottom-[10%] -right-[5%] h-[45vw] w-[45vw] opacity-[0.08]"
            style={{
              background:
                "radial-gradient(circle, var(--color-fg) 0%, transparent 70%)",
            }}
          />
          {/* Tiny accent spot — centre-right */}
          <div
            className="aurora-blob aurora-blob-3 absolute right-[20%] top-[35%] h-[25vw] w-[25vw] opacity-[0.10]"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
            }}
          />
        </div>
      )}

      {/* ── Top row ── */}
      <motion.div
        variants={fade}
        custom={0.05}
        initial="hidden"
        animate={state}
        className="relative max-w-xl"
      >
        {/* Status pill */}
        {profile.status && (
          <motion.div
            variants={fade}
            custom={0.0}
            initial="hidden"
            animate={state}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-1.5"
          >
            <span
              aria-hidden
              className="status-dot h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
            />
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
              {profile.status}
            </span>
          </motion.div>
        )}

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
              className="touch-press group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[var(--color-fg)] px-6 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-bg)] transition-opacity hover:opacity-85"
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
                className="touch-press inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-fg)] px-6 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
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

      {/* ── Wordmark ── */}
      <motion.h1
        style={reduced ? undefined : { y, opacity }}
        className="relative my-4 select-none text-center font-medium tracking-[-0.055em]"
      >
        <span className="flex justify-center overflow-hidden py-[0.12em]">
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block text-[19.5vw] leading-[1.05]"
              variants={rise}
              custom={0.15 + i * 0.04}
              initial="hidden"
              animate={state}
            >
              {ch === " " ? "\u00a0" : ch}
            </motion.span>
          ))}
        </span>
      </motion.h1>

      {/* ── Bottom row ── */}
      <motion.div
        variants={fade}
        custom={0.6}
        initial="hidden"
        animate={state}
        className="relative flex flex-wrap items-end justify-between gap-4"
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

      {/* ── Scroll indicator ── */}
      {!reduced && (
        <motion.div
          className="scroll-indicator"
          variants={fade}
          custom={1.2}
          initial="hidden"
          animate={state}
          aria-hidden
        >
          <ArrowDown
            size={18}
            strokeWidth={1.5}
            className="text-[var(--color-muted)]"
          />
        </motion.div>
      )}
    </section>
  );
}
