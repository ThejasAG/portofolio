"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";

/**
 * Client shell. LoadingScreen manages its own visibility and exit animation;
 * it calls onDone() at the right moment so the hero begins revealing.
 *
 * Failsafe: if onDone is never called within 4 s (e.g. reduced-motion skip
 * or any error), we forcibly set ready=true so the page is never permanently hidden.
 */
export default function Shell({
  children,
}: {
  children: (ready: boolean) => ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const handleDone = useCallback(() => setReady(true), []);

  // Hard failsafe — content should never be permanently hidden
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <LoadingScreen onDone={handleDone} />
      <Navbar />
      <main id="main">{children(ready)}</main>
    </>
  );
}
