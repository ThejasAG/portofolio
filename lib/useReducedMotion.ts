"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query as an external store. useSyncExternalStore is the right
 * primitive here: it subscribes without a setState-in-effect cascade and
 * returns the server snapshot (false) during SSR, so markup matches.
 */
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

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True only on devices with a real hovering pointer (excludes touch). */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
