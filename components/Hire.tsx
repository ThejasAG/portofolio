"use client";

import SectionHeading from "./SectionHeading";
import SectionReveal from "./SectionReveal";
import HireForm from "./HireForm";
import { section } from "@/data/sections";

export default function Hire() {
  const S = section("hire");

  return (
    <section id="hire" className="scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading number={S.number} title={S.heading} aside="Open to opportunities" />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <SectionReveal className="lg:col-span-4">
            <p className="text-[clamp(1.1rem,1.8vw,1.4rem)] font-medium leading-[1.35] tracking-[-0.02em]">
              Have a project, an internship opening, or an engineering problem?
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
              Tell me what you&apos;re working on and I&apos;ll get back to you.
            </p>
          </SectionReveal>

          <SectionReveal delay={1} className="lg:col-span-7 lg:col-start-6">
            <HireForm />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
