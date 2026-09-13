"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { profile, isPlaceholder } from "@/data/profile";
import { sections } from "@/data/sections";
import ThemeToggle from "./ThemeToggle";
import MagneticButton from "./MagneticButton";
import { drawerItem } from "@/lib/motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

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
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-[var(--color-line)] bg-[var(--color-bg)]/85 backdrop-blur-[14px]"
            : "border-transparent bg-transparent backdrop-blur-none"
        }`}
        style={{ borderBottomStyle: "solid" }}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1600px] items-center justify-between px-6 sm:px-10"
        >
          <motion.div
            animate={{
              paddingTop: scrolled ? 14 : 24,
              paddingBottom: scrolled ? 14 : 24,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/"
              className="text-sm font-medium tracking-tight transition-opacity hover:opacity-60"
            >
              {nameLabel}
            </Link>
          </motion.div>

          {/* Desktop nav */}
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

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center"
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={18} strokeWidth={1.5} />
            </motion.button>
          </div>
        </nav>
      </header>

      {/* ── Full-screen mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[65] bg-[var(--color-bg)]/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel — slides from right */}
            <motion.div
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-[var(--color-bg)] px-6 py-6 md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Decorative accent blob inside drawer */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20"
                style={{
                  background:
                    "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{nameLabel}</span>
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center"
                  whileTap={{ scale: 0.9, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={18} strokeWidth={1.5} />
                </motion.button>
              </div>

              <ul className="mt-12 flex flex-col gap-1">
                {sections.map((s, i) => (
                  <motion.li
                    key={s.id}
                    variants={drawerItem}
                    custom={i}
                    initial="hidden"
                    animate="show"
                  >
                    <a
                      href={`/#${s.id}`}
                      onClick={() => setOpen(false)}
                      className="touch-press flex items-baseline gap-4 rounded-lg py-3 text-4xl font-medium tracking-tight transition-colors hover:text-[var(--color-accent)]"
                    >
                      <span className="text-meta">{s.number}</span>
                      {s.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--color-line)] pt-6">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-meta py-2 transition-colors hover:text-[var(--color-fg)]"
                  >
                    GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-meta py-2 transition-colors hover:text-[var(--color-fg)]"
                  >
                    LinkedIn
                  </a>
                )}
                {profile.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="text-meta py-2 transition-colors hover:text-[var(--color-fg)]"
                  >
                    Resume
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
