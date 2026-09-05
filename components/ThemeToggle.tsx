"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

/** Subscribes to the `dark` class that the pre-hydration script sets. */
const subscribe = (onChange: () => void) => {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => obs.disconnect();
};

export default function ThemeToggle() {
  // The DOM is the source of truth, so the toggle can never disagree with
  // what is on screen — including the theme the inline script chose.
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage blocked (private mode) — toggle still works for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid h-11 w-11 place-items-center rounded-full text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
    >
      {/* Both icons render; CSS picks one from the html.dark class, so the
          correct icon is painted server-side and after hydration alike. */}
      <Sun size={16} strokeWidth={1.5} className="hidden dark:block" />
      <Moon size={16} strokeWidth={1.5} className="block dark:hidden" />
    </button>
  );
}
