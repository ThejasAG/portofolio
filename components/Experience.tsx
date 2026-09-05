"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { experience, education } from "@/data/experience";
import SectionHeading from "./SectionHeading";
import { section } from "@/data/sections";
import SectionReveal from "./SectionReveal";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

function Entry({ role }: { role: (typeof experience)[number] }) {
  return (
    <SectionReveal as="li" className="relative pl-8 sm:pl-12">
      <span
        aria-hidden
        className="absolute left-0 top-[1.9rem] h-2 w-2 -translate-x-[3.5px] rounded-full bg-[var(--color-accent)]"
      />
      <div className="border-t border-[var(--color-line)] pt-5">
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
                <span aria-hidden className="text-[var(--color-faint)]">
                  —
                </span>
                {p}
              </li>
            ))}
          </ul>
        )}

        {role.technologies.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-1">
            {role.technologies.map((t) => (
              <li key={t} className="text-meta normal-case tracking-normal">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionReveal>
  );
}

export default function Experience() {
  const S = section("experience");
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.6"],
  });
  // The rail draws itself as the list scrolls through.
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading number={S.number} title={S.heading} />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-9 lg:col-start-4">
            <ol ref={ref} className="relative flex flex-col gap-16">
              <span
                aria-hidden
                className="absolute left-0 top-2 h-[calc(100%-0.5rem)] w-px bg-[var(--color-line)]"
              />
              {!reduced && (
                <motion.span
                  aria-hidden
                  style={{ scaleY }}
                  className="absolute left-0 top-2 h-[calc(100%-0.5rem)] w-px origin-top bg-[var(--color-fg)]"
                />
              )}
              {experience.map((r, i) => (
                <Entry key={`${r.company}-${i}`} role={r} />
              ))}
            </ol>

            {education.length > 0 && (
              <div className="mt-20">
                <p className="text-meta">Education</p>
                <ol className="mt-8 flex flex-col gap-10">
                  {education.map((r, i) => (
                    <Entry key={`${r.company}-edu-${i}`} role={r} />
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
