"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { profile, isPlaceholder } from "@/data/profile";
import { sections } from "@/data/sections";
import ThemeToggle from "./ThemeToggle";
import MagneticButton from "./MagneticButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Motion value subscription: no React re-render per scroll frame.
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  // The mobile sheet is a modal surface — lock the page behind it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const nameLabel = isPlaceholder(profile.name) ? profile.initials : profile.name;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{
          backgroundColor: scrolled
            ? "color-mix(in srgb, var(--color-bg) 82%, transparent)"
            : "color-mix(in srgb, var(--color-bg) 0%, transparent)",
          borderBottomColor: scrolled
            ? "var(--color-line)"
            : "color-mix(in srgb, var(--color-line) 0%, transparent)",
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1600px] items-center justify-between px-6 sm:px-10"
        >
          <motion.div
            animate={{ paddingTop: scrolled ? 14 : 24, paddingBottom: scrolled ? 14 : 24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/"
              className="text-sm font-medium tracking-tight transition-opacity hover:opacity-60"
            >
              {nameLabel}
            </Link>
          </motion.div>

          <div className="hidden items-center gap-8 md:flex">
            {sections
              .filter((s) => s.id !== "hire")
              .map((s) => (
                <a
                  key={s.id}
                  href={`/#${s.id}`}
                  className="group relative text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
                >
                  <span className="link-underline">{s.label}</span>
                </a>
              ))}

            <MagneticButton>
              <Link
                href="/#hire"
                data-cursor="VIEW"
                className="inline-flex min-h-11 items-center rounded-full bg-[var(--color-fg)] px-5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-bg)] transition-opacity hover:opacity-85"
              >
                Hire me
              </Link>
            </MagneticButton>

            {profile.resume && (
              <MagneticButton>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="↗"
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm transition-colors hover:border-[var(--color-fg)]"
                >
                  Resume
                </a>
              </MagneticButton>
            )}

            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center"
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[70] flex flex-col bg-[var(--color-bg)] px-6 py-6 md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{nameLabel}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <ul className="mt-16 flex flex-col gap-2">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={`/#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-3 text-4xl font-medium tracking-tight"
                  >
                    <span className="text-meta">{s.number}</span>
                    {s.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--color-line)] pt-6">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="text-meta py-2">
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-meta py-2">
                  LinkedIn
                </a>
              )}
              {profile.resume && (
                <a href={profile.resume} target="_blank" rel="noreferrer" className="text-meta py-2">
                  Resume
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
