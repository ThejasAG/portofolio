"use client";

import { ArrowUpRight } from "lucide-react";
import { profile, isPlaceholder } from "@/data/profile";
import MagneticButton from "./MagneticButton";
import MaskReveal from "./MaskReveal";
import { section } from "@/data/sections";

/** Edit this closing line — it should sound like you. */
const CLOSING = ["Let's build", "something", "that holds."];

export default function Contact() {
  const S = section("contact");
  const emailReady = !isPlaceholder(profile.email);

  const links = [
    profile.github && { label: "GitHub", href: profile.github },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
    profile.resume && { label: "Resume", href: profile.resume },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section id="contact" className="scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-baseline justify-between gap-6 border-t border-[var(--color-line)] pt-6">
          <span className="text-meta">
            {S.number} — {S.label}
          </span>
          <span className="text-meta">{profile.location}</span>
        </div>

        <h2 className="mt-16 text-[clamp(2.5rem,11vw,9rem)] font-medium leading-[0.88] tracking-[-0.05em]">
          {CLOSING.map((line, i) => (
            <MaskReveal key={line} delay={i * 0.08}>
              {line}
            </MaskReveal>
          ))}
        </h2>

        <div className="mt-20 grid gap-12 border-t border-[var(--color-line)] pt-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-meta">Email</p>
            {emailReady ? (
              <MagneticButton strength={6}>
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="↗"
                  className="group mt-4 inline-flex items-center gap-3 text-[clamp(1.35rem,4vw,3rem)] font-medium tracking-[-0.035em]"
                >
                  <span className="link-underline">{profile.email}</span>
                  <ArrowUpRight
                    size={28}
                    strokeWidth={1.5}
                    className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
                  />
                </a>
              </MagneticButton>
            ) : (
              <p className="mt-4 text-[clamp(1.35rem,4vw,3rem)] font-medium tracking-[-0.035em] text-[var(--color-faint)]">
                {profile.email}
              </p>
            )}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-meta">Elsewhere</p>
            <ul className="mt-4 flex flex-col">
              {links.map((l) => (
                <li key={l.label} className="border-b border-[var(--color-line)]">
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="↗"
                    className="group flex min-h-11 items-center justify-between py-3 text-base"
                  >
                    <span className="link-underline">{l.label}</span>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-[var(--color-muted)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </a>
                </li>
              ))}
              {links.length === 0 && (
                <li className="py-3 text-sm text-[var(--color-faint)]">
                  Add your links in data/profile.ts
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
