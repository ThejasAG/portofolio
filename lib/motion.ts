import type { Variants } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Text lines rise from behind a `.mask-line` clip.
 *
 * Plain object variants, not a function of `custom`: a function variant
 * resolved with no `custom` prop yields no target, which silently leaves
 * the line stuck behind its mask. Stagger these via a parent variant or
 * an explicit `transition` delay instead.
 */
export const lineRise: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.9, ease: EASE } },
};

/** `custom` is the stagger index; always pass one (SectionReveal does). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.06 },
  }),
};

/**
 * Images are revealed by a clip-path wipe plus a slight scale settle.
 * Apply this to a CHILD of the observed element, never to the element
 * carrying whileInView: a fully clipped node reports isIntersecting:false
 * about itself, so it would never trigger its own reveal.
 */
export const imageReveal: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.1, ease: EASE },
  },
};

/** Scale settle for the image itself, kept off the full-bleed wrapper so
 *  an in-flight transform cannot widen the layout at narrow viewports. */
export const imageSettle: Variants = {
  hidden: { scale: 1.06 },
  show: { scale: 1, transition: { duration: 1.1, ease: EASE } },
};

export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/**
 * Shared viewport config. `amount: "some"` fires as soon as any part of the
 * element is visible. A fractional amount is unreliable here: several
 * elements (full-bleed project visuals) are taller than the viewport, so a
 * fraction they can never satisfy would leave them stuck hidden forever.
 */
export const viewport = { once: true, amount: "some" } as const;
