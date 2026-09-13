"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/skills";
import SectionHeading from "./SectionHeading";
import { section } from "@/data/sections";
import { viewport, tagEntrance, stagger } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Skills section — two parts:
 * 1. Typographic skill list with staggered pill tags + hover dim of other groups.
 * 2. A marquee ticker band of all technologies at the bottom.
 */
export default function Skills() {
  const S = section("skills");
  const [hoverGroup, setHoverGroup] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();

  // Flatten all items for the marquee ticker (doubled for seamless loop)
  const allItems = skills.flatMap((g) => g.items);
  const doubled = [...allItems, ...allItems];

  return (
    <section id="skills" className="scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading number={S.number} title={S.heading} aside="What I work in" />

        {/* ── Category groups ── */}
        <dl className="mt-16" onMouseLeave={() => setHoverGroup(null)}>
          {skills.map((group, gi) => (
            <motion.div
              key={group.category}
              onMouseEnter={() => setHoverGroup(group.category)}
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{
                duration: 0.6,
                delay: gi * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              animate={{
                opacity: hoverGroup && hoverGroup !== group.category ? 0.35 : 1,
              }}
              className="grid gap-3 border-t border-[var(--color-line)] py-7 sm:grid-cols-12 sm:gap-8"
            >
              <dt className="text-meta sm:col-span-3">{group.category}</dt>
              <dd className="sm:col-span-9">
                <motion.ul
                  className="flex flex-wrap gap-2.5"
                  variants={reduced ? undefined : stagger(0.04, gi * 0.04)}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewport}
                >
                  {group.items.map((item, ii) => (
                    <motion.li
                      key={item}
                      variants={reduced ? undefined : tagEntrance}
                      custom={ii}
                    >
                      <span className="skill-tag">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </dd>
            </motion.div>
          ))}
        </dl>

        {/* ── Marquee ticker ── */}
        {!reduced && (
          <div className="marquee-outer relative mt-16 overflow-hidden border-t border-[var(--color-line)] pt-10">
            {/* Fade edges */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24"
              style={{
                background: "linear-gradient(to right, var(--color-bg), transparent)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24"
              style={{
                background: "linear-gradient(to left, var(--color-bg), transparent)",
              }}
            />

            <div className="marquee-track gap-8 pb-2">
              {doubled.map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="inline-flex shrink-0 items-center gap-8 pr-8"
                >
                  <span className="text-[clamp(0.9rem,1.3vw,1.05rem)] font-medium tracking-[-0.01em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
                    {item}
                  </span>
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full bg-[var(--color-accent)] opacity-60"
                  />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
