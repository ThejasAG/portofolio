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
  "I'm a software engineering student, currently interning at Xorstack. I build backend services, mobile test automation and AI projects, and I've spent a lot of that time testing real applications rather than only writing them.",
  "That mix is what I find useful. Writing a feature teaches you how it's meant to work; testing one teaches you how it actually behaves — which is where invoices disagree by a cent, a delivery radius uses a stale map pin, or a test run reports something that never happened on the device.",
  "Most of my work so far has been in Python and JavaScript: FastAPI and Flask backends, React and React Native front ends, Appium for mobile automation, and scikit-learn for the AI side.",
  "I'm looking for software engineering roles where I can keep working across both — building things and understanding how they hold up.",
];

const currently =
  "Interning at Xorstack, working on application testing and an internal mobile test orchestration platform.";

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
