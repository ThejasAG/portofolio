"use client";

import { ArrowUpRight } from "lucide-react";
import { achievements } from "@/data/achievements";
import SectionHeading from "./SectionHeading";
import SectionReveal from "./SectionReveal";
import { motion } from "framer-motion";
import { viewport, stagger, scaleUp } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

export default function Achievements() {
  const reduced = usePrefersReducedMotion();
  if (achievements.length === 0) return null;

  return (
    <section className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading number="—" title="Recognition" />

        <motion.ul
          className="mt-16 grid gap-px overflow-hidden border border-[var(--color-line)] rounded-2xl sm:grid-cols-2 lg:grid-cols-3"
          variants={reduced ? undefined : stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {achievements.map((a, i) => (
            <motion.li
              key={a.title}
              variants={reduced ? undefined : scaleUp}
              custom={i}
              className="group relative overflow-hidden border-b border-r border-[var(--color-line)] bg-[var(--color-bg)] p-7 transition-colors hover:bg-[var(--color-surface)]"
            >
              {/* Hover accent glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(ellipse at top left, var(--color-accent-subtle) 0%, transparent 70%)",
                }}
              />

              <p className="text-meta">{a.date}</p>
              <h3 className="mt-4 text-lg font-medium leading-snug tracking-[-0.02em]">
                {a.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{a.issuer}</p>
              {a.link && (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="↗"
                  className="touch-press mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm"
                >
                  <span className="link-underline">Verify</span>
                  <ArrowUpRight size={14} strokeWidth={1.75} />
                </a>
              )}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
