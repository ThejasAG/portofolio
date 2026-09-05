"use client";

import { useCallback, useState, type ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import Cursor from "./Cursor";

/**
 * Client shell around otherwise static content: intro overlay, nav, cursor.
 * `ready` is passed down so the hero starts its choreography as the
 * loading overlay lifts, rather than underneath it.
 */
export default function Shell({
  children,
}: {
  children: (ready: boolean) => ReactNode;
}) {
  const [ready, setReady] = useState(false);
  // Stable identity: LoadingScreen's rAF effect depends on this, and must
  // not restart when the tree re-renders.
  const handleDone = useCallback(() => setReady(true), []);

  return (
    <>
      <LoadingScreen onDone={handleDone} />
      <Cursor />
      <Navbar />
      <main id="main">{children(ready)}</main>
    </>
  );
}
