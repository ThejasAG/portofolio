"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { viewport } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Embeds a diagram-design HTML file for a project.
 *
 * The diagram is an iframe rather than inlined SVG: each file is a complete
 * document with its own scoped motion controller and ids, and iframing keeps
 * those from colliding with the host page or with each other.
 *
 * It loads lazily and starts on `?motion=static` — the complete frame — so a
 * reader who never presses Play still sees the whole diagram, and reduced
 * motion never gets an animation it did not ask for.
 */
export default function ProjectDiagram({
  slug,
  title,
  className = "",
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [loaded, setLoaded] = useState(false);
  // Only mount the iframe once it is near the viewport. `loading="lazy"`
  // alone still costs a document per diagram on first paint, which pushed
  // LCP past five seconds when all four mounted at once.
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLIFrameElement>(null);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || mounted) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  /**
   * The iframe is its own document, so it cannot see the host's `dark` class.
   * Mirror it across on load and whenever the user toggles the theme. Both
   * documents are same-origin, so this needs no postMessage handshake.
   */
  const syncTheme = useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc) return;
    const dark = document.documentElement.classList.contains("dark");
    doc.documentElement.classList.toggle("dark", dark);
    // `light` pins the media-query fallback off when the user chose light.
    doc.documentElement.classList.toggle("light", !dark);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    syncTheme();
    const obs = new MutationObserver(syncTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [loaded, syncTheme]);

  return (
    <motion.div
      ref={host}
      className={`relative overflow-hidden rounded-sm border border-[var(--color-line)] bg-[var(--color-surface)] ${className}`}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {mounted && (
      <iframe
        ref={ref}
        // Static frame by default; the controls inside enable stepping.
        src={`/diagrams/${slug}.html${reduced ? "?motion=static" : ""}`}
        title={`${title} — architecture diagram`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="h-full w-full border-0"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity .5s ease" }}
      />
      )}
    </motion.div>
  );
}
