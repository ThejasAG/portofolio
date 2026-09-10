"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { technicalCases } from "@/data/caseStudies";
import SectionHeading from "./SectionHeading";
import SectionReveal from "./SectionReveal";

/**
 * Problem → investigation → approach → result, one row per problem.
 *
 * Rows are <details>-style disclosures driven by state so the body can be
 * animated. Content is in the DOM for search engines and readable without
 * hover; the trigger is a real button and keyboard operable.
 */
export default function TechnicalCases() {
  const [open, setOpen] = useState<number | null>(0);

  if (technicalCases.length === 0) return null;

  return (
    <section className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading
          number="—"
          title="Problems I've worked through"
          aside="Engineering write-ups"
        />

        <ul className="mt-16">
          {technicalCases.map((c, i) => {
            const isOpen = open === i;
            return (
              <SectionReveal as="li" key={c.number} delay={i}>
                <div className="border-t border-[var(--color-line)]">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`case-${c.number}`}
                      className="group flex w-full items-baseline gap-6 py-7 text-left"
                    >
                      <span className="text-meta shrink-0">{c.number}</span>
                      <span className="flex-1 text-[clamp(1.25rem,2.8vw,2.25rem)] font-medium leading-tight tracking-[-0.025em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                        {c.title}
                      </span>
                      <span className="text-meta hidden shrink-0 sm:block">
                        {c.domain}
                      </span>
                      <motion.span
                        aria-hidden
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="shrink-0 text-[var(--color-muted)]"
                      >
                        <Plus size={18} strokeWidth={1.5} />
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`case-${c.number}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-8 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
                          {(
                            [
                              ["Problem", c.problem],
                              ["Investigation", c.investigation],
                              ["Approach", c.approach],
                              ["Result", c.result],
                            ] as const
                          ).map(([label, body]) => (
                            <div key={label}>
                              <p className="text-meta">{label}</p>
                              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                                {body}
                              </p>
                            </div>
                          ))}
                        </div>

                        {c.flow && c.flow.length > 0 && (
                          <div className="mb-12 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-[var(--color-line)] pt-6">
                            {c.flow.map((step, si) => (
                              <span key={si} className="flex items-center gap-3">
                                <span className="rounded-full border border-[var(--color-line)] px-3 py-1.5 font-mono text-[11px] tracking-wide">
                                  {step}
                                </span>
                                {si < c.flow!.length - 1 && (
                                  <span aria-hidden className="text-[var(--color-faint)]">
                                    →
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SectionReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
