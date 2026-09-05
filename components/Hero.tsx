"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile, isPlaceholder } from "@/data/profile";
import MagneticButton from "./MagneticButton";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/** Splits a title on "/" so each segment can be revealed on its own line. */
function titleLines(title: string): string[] {
  return title.split("/").map((s) => s.trim()).filter(Boolean);
}

export default function Hero({ ready }: { ready: boolean }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Subtle parallax drift as the hero leaves — transform only, no reflow.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Animations wait for the loading overlay so the two don't overlap.
  const state = reduced || ready ? "show" : "hidden";
  const D = 0.05; // base delay between reveal groups

  const name = isPlaceholder(profile.name) ? "Your Name" : profile.name;
  const lines = isPlaceholder(profile.title)
    ? ["Your Title"]
    : titleLines(profile.title);

  const rise = {
    hidden: { y: "110%" },
    show: (i: number) => ({
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: i },
    }),
  };
  const fade = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: i },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end px-6 pb-10 pt-32 sm:px-10 sm:pb-14"
    >
      <motion.div style={reduced ? undefined : { y, opacity }}>
        {profile.status && (
          <motion.p
            variants={fade}
            custom={D}
            initial="hidden"
            animate={state}
            className="text-meta mb-10 flex items-center gap-2"
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
            />
            {profile.status}
          </motion.p>
        )}

        <h1 className="text-display">
          <span className="mask-line">
            <motion.span
              className="block"
              variants={rise}
              custom={D + 0.05}
              initial="hidden"
              animate={state}
            >
              {name}
            </motion.span>
          </span>
        </h1>

        <div className="mt-8 grid gap-10 border-t border-[var(--color-line)] pt-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="text-[clamp(1.25rem,2.6vw,2rem)] font-medium leading-[1.1] tracking-[-0.02em]">
              {lines.map((line, i) => (
                <span key={line} className="mask-line">
                  <motion.span
                    className="block"
                    variants={rise}
                    custom={D + 0.25 + i * 0.08}
                    initial="hidden"
                    animate={state}
                  >
                    {i > 0 && (
                      <span className="text-[var(--color-faint)]">/ </span>
                    )}
                    {line}
                  </motion.span>
                </span>
              ))}
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-md text-base leading-relaxed text-[var(--color-muted)]">
              {profile.statement.map((line, i) => (
                <span key={line} className="mask-line">
                  <motion.span
                    className="block"
                    variants={rise}
                    custom={D + 0.4 + i * 0.07}
                    initial="hidden"
                    animate={state}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </p>

            <motion.div
              variants={fade}
              custom={D + 0.62}
              initial="hidden"
              animate={state}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <MagneticButton>
                <a
                  href="#work"
                  data-cursor="VIEW"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-fg)] px-6 text-sm font-medium text-[var(--color-bg)] transition-opacity hover:opacity-85"
                >
                  View work
                  <ArrowDown size={15} strokeWidth={1.75} />
                </a>
              </MagneticButton>

              {profile.resume ? (
                <MagneticButton>
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="↗"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-line)] px-6 text-sm transition-colors hover:border-[var(--color-fg)]"
                  >
                    Resume
                    <ArrowUpRight size={15} strokeWidth={1.75} />
                  </a>
                </MagneticButton>
              ) : (
                // No file at public/resume.pdf — the control is shown as
                // unavailable rather than linking to a 404.
                <span
                  title="Add public/resume.pdf, then set profile.resume"
                  className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-[var(--color-line)] px-6 text-sm text-[var(--color-muted)]"
                >
                  Resume — file not added
                </span>
              )}

              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="↗"
                  className="link-underline inline-flex min-h-11 items-center text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
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
                  className="link-underline inline-flex min-h-11 items-center text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                >
                  LinkedIn
                </a>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div
          variants={fade}
          custom={D + 0.8}
          initial="hidden"
          animate={state}
          className="mt-16 flex items-end justify-between"
        >
          <span className="text-meta flex items-center gap-3">
            Scroll
            <motion.span
              aria-hidden
              animate={reduced ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={13} strokeWidth={1.5} />
            </motion.span>
          </span>
          <span className="text-meta">01</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
