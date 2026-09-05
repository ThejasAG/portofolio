"use client";

import { profile } from "@/data/profile";
import SectionHeading from "./SectionHeading";
import { section } from "@/data/sections";
import SectionReveal from "./SectionReveal";

/**
 * Editorial About. Paragraphs live here rather than in the data layer
 * because they are prose, not structured content — edit them in place.
 */
const paragraphs = [
  "I work on two sides of the same problem: building backends, and checking that software actually behaves the way it claims to. Most recently that has meant testing the Vya Consumer and Business applications against each other, and building the API and data layer for AgriEco, a farming advisory platform.",
  "The comparison work is the part I find genuinely interesting. Two applications issue invoices for the same purchase, and the totals agree — until a rounding step happens one stage too early and the VAT line comes out a cent apart. Most invoices match. Finding the ones that do not means reproducing the calculation yourself and knowing which intermediate value to distrust.",
  "On the backend side I care about how systems fail. AgriEco had to run for weeks before the machine learning models it served existed, so the useful question became what a route should return when the thing it needs is missing. I would rather return a 503 naming the absent file than a stack trace.",
  "I am working toward backend and quality engineering roles where correctness is checkable — authorisation boundaries, input validation, calculations that have to agree across two applications.",
];

const currently =
  "Evaluating real-device and parallel test execution, and where its practical limits actually sit.";

export default function About() {
  const S = section("about");
  return (
    <section id="about" className="scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading number={S.number} title={S.heading} aside={profile.location} />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 lg:col-start-4">
            <div className="flex flex-col gap-7">
              {paragraphs.map((p, i) => (
                <SectionReveal key={i} delay={i}>
                  <p
                    className={
                      i === 0
                        ? "text-[clamp(1.15rem,2.2vw,1.75rem)] font-medium leading-[1.35] tracking-[-0.02em]"
                        : "text-base leading-relaxed text-[var(--color-muted)]"
                    }
                  >
                    {p}
                  </p>
                </SectionReveal>
              ))}
            </div>

            <SectionReveal delay={3} className="mt-14 border-t border-[var(--color-line)] pt-6">
              <p className="text-meta">Currently</p>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--color-muted)]">
                {currently}
              </p>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
