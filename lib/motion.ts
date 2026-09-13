import type { Variants } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;
export const EASE_BOUNCE = [0.22, 1.8, 0.36, 1] as const;
export const EASE_QUART = [0.76, 0, 0.24, 1] as const;

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

/** Spring-physics line rise — slight overshoot for a handcrafted feel. */
export const lineRiseSpring: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 1.0, ease: EASE_SPRING } },
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

/** Fade + subtle scale-up for cards and surface elements. */
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: EASE, delay: i * 0.07 },
  }),
};

/** Slide in from the left — clip-path based, sharp edge. */
export const slideFromLeft: Variants = {
  hidden: { clipPath: "inset(0% 100% 0% 0%)", x: -12, opacity: 0 },
  show: (i: number = 0) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    x: 0,
    opacity: 1,
    transition: { duration: 0.75, ease: EASE, delay: i * 0.06 },
  }),
};

/** Slide in from the right. */
export const slideFromRight: Variants = {
  hidden: { clipPath: "inset(0% 0% 0% 100%)", x: 12, opacity: 0 },
  show: (i: number = 0) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    x: 0,
    opacity: 1,
    transition: { duration: 0.75, ease: EASE, delay: i * 0.06 },
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

/** Staggered tag entrance — for skill pill grids. */
export const tagEntrance: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.92 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_SPRING, delay: i * 0.035 },
  }),
};

/** Mobile x-axis slide — for nav drawer items. */
export const drawerItem: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EASE, delay: 0.06 + i * 0.06 },
  }),
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

/** Viewport config that waits for a bit more of the element to be visible. */
export const viewportStrict = { once: true, amount: 0.25 } as const;

/** Spring transition preset — use for interactive hover/click responses. */
export const springTransition = {
  type: "spring",
  stiffness: 280,
  damping: 22,
  mass: 0.6,
} as const;

/** Gentle spring for large surfaces. */
export const gentleSpring = {
  type: "spring",
  stiffness: 180,
  damping: 24,
  mass: 0.8,
} as const;
