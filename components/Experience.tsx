"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { experience, education } from "@/data/experience";
import SectionHeading from "./SectionHeading";
import { section } from "@/data/sections";
import SectionReveal from "./SectionReveal";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { viewport, stagger, tagEntrance } from "@/lib/motion";

function Entry({
  role,
  isActive,
}: {
  role: (typeof experience)[number];
  isActive: boolean;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <SectionReveal as="li" className="relative pl-8 sm:pl-12">
      {/* Dot — pulses with accent glow when entry is in viewport */}
      <motion.span
        aria-hidden
        animate={
          isActive && !reduced
            ? {
                scale: [1, 1.5, 1],
                boxShadow: [
                  "0 0 0 0 var(--color-accent-glow)",
                  "0 0 0 8px transparent",
                  "0 0 0 0 transparent",
                ],
              }
            : {}
        }
        transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 top-[1.9rem] h-2 w-2 -translate-x-[3.5px] rounded-full bg-[var(--color-accent)]"
      />

      <div className="border-t border-[var(--color-line)] pt-5">
        {/* Company name slides in from clip-path */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="text-[clamp(1.35rem,3vw,2.25rem)] font-medium leading-tight tracking-[-0.03em]">
            {role.company}
          </h3>
          <span className="text-meta">{role.period}</span>
        </div>

        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {role.role}
          {role.location ? ` — ${role.location}` : ""}
        </p>

        {role.points.length > 0 && (
          <ul className="mt-6 flex max-w-2xl flex-col gap-3">
            {role.points.map((p, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]"
              >
                <span aria-hidden className="text-[var(--color-faint)] shrink-0">
                  —
                </span>
                {p}
              </li>
            ))}
          </ul>
        )}

        {role.technologies.length > 0 && (
          <motion.ul
            className="mt-6 flex flex-wrap gap-2"
            variants={stagger(0.04)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
          >
            {role.technologies.map((t, ti) => (
              <motion.li
                key={t}
                variants={tagEntrance}
                custom={ti}
                className="rounded-full border border-[var(--color-line)] px-3 py-1 font-mono text-[10px] tracking-wide text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {t}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </SectionReveal>
  );
}

export default function Experience() {
  const S = section("experience");
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.6"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading number={S.number} title={S.heading} />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-9 lg:col-start-4">
            <ol ref={ref} className="relative flex flex-col gap-16">
              {/* Static rail line */}
              <span
                aria-hidden
                className="absolute left-0 top-2 h-[calc(100%-0.5rem)] w-px bg-[var(--color-line)]"
              />
              {/* Scroll-driven fill */}
              {!reduced && (
                <motion.span
                  aria-hidden
                  style={{ scaleY }}
                  className="absolute left-0 top-2 h-[calc(100%-0.5rem)] w-px origin-top bg-[var(--color-accent)]"
                />
              )}

              {experience.map((r, i) => (
                <motion.div
                  key={`${r.company}-${i}`}
                  onViewportEnter={() => setActiveIndex(i)}
                  viewport={{ amount: 0.5 }}
                >
                  <Entry role={r} isActive={activeIndex === i && !reduced} />
                </motion.div>
              ))}
            </ol>

            {education.length > 0 && (
              <div className="mt-20">
                <p className="text-meta">Education</p>
                <ol className="mt-8 flex flex-col gap-10">
                  {education.map((r, i) => (
                    <Entry key={`${r.company}-edu-${i}`} role={r} isActive={false} />
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
