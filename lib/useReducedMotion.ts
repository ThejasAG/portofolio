"use client";

import { useCallback, useSyncExternalStore } from "react";

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * Always returns false — animations run for everyone on this portfolio.
 *
 * Windows laptops often have "Animation effects" turned off in Accessibility
 * settings which triggers prefers-reduced-motion. On a personal portfolio
 * the animations are the core experience, so we don't gate on this preference.
 *
 * The CSS @media (prefers-reduced-motion: reduce) block in globals.css is
 * also removed from keyframe animations — it only disables transitions for
 * users who have explicitly enabled it in an accessibility context.
 */
export function usePrefersReducedMotion(): boolean {
  return false;
}

/** True only on devices with a real hovering pointer (excludes touch). */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
