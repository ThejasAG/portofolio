"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { profile, isPlaceholder } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();
  const name = isPlaceholder(profile.name) ? profile.initials : profile.name;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="px-6 pb-10 sm:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 border-t border-[var(--color-line)] pt-8">
        <p className="text-meta">
          © {year} {name}
        </p>
        <p className="text-meta">{profile.location}</p>

        {/* Back to top */}
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="touch-press group ml-auto flex items-center gap-2 text-meta transition-colors hover:text-[var(--color-fg)]"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.16em]">
            Back to top
          </span>
          <motion.span
            className="grid h-7 w-7 place-items-center rounded-full border border-[var(--color-line)] transition-colors group-hover:border-[var(--color-fg)]"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUp size={12} strokeWidth={2} />
          </motion.span>
        </motion.button>
      </div>
    </footer>
  );
}
