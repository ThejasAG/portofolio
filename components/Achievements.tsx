"use client";

import { ArrowUpRight } from "lucide-react";
import { achievements } from "@/data/achievements";
import SectionHeading from "./SectionHeading";
import SectionReveal from "./SectionReveal";

export default function Achievements() {
  // Nothing to show is better than something invented.
  if (achievements.length === 0) return null;

  return (
    <section className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading number="—" title="Recognition" />

        <ul className="mt-16 grid gap-px overflow-hidden border-t border-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <SectionReveal as="li" key={a.title} delay={i}>
              <div className="h-full border-b border-r border-[var(--color-line)] p-7">
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
                    className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm"
                  >
                    <span className="link-underline">Verify</span>
                    <ArrowUpRight size={14} strokeWidth={1.75} />
                  </a>
                )}
              </div>
            </SectionReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
