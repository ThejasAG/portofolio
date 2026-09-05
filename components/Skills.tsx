"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/skills";
import SectionHeading from "./SectionHeading";
import { section } from "@/data/sections";
import { viewport } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Typographic skill list — no bars, no invented proficiency numbers.
 *
 * Hovering a group dims the others. That is decoration only: every
 * category and item stays readable and in the DOM at all times.
 */
export default function Skills() {
  const S = section("skills");
  const [hover, setHover] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <section id="skills" className="scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading number={S.number} title={S.heading} aside="What I work in" />

        <dl className="mt-16" onMouseLeave={() => setHover(null)}>
          {skills.map((group, gi) => (
            <motion.div
              key={group.category}
              onMouseEnter={() => setHover(group.category)}
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, delay: gi * 0.05, ease: [0.16, 1, 0.3, 1] }}
              animate={{
                opacity: hover && hover !== group.category ? 0.4 : 1,
              }}
              className="grid gap-3 border-t border-[var(--color-line)] py-7 transition-colors sm:grid-cols-12 sm:gap-8"
            >
              <dt className="text-meta sm:col-span-3">{group.category}</dt>
              <dd className="sm:col-span-9">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-[clamp(1rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-1 hover:text-[var(--color-accent)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
