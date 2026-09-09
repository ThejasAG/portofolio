"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * three + R3F are ~600KB. Loading them lazily and client-only keeps them out
 * of the initial bundle and off the server render entirely.
 */
const Scene = dynamic(() => import("./Scene"), { ssr: false });

type Verdict = "pending" | "high" | "low" | "off";

/**
 * Decides whether the 3D scene runs, and how hard.
 *
 * The reference site renders nothing at all without a GPU — a blank screen.
 * This refuses to do that: if anything here says no, the caller keeps its
 * existing static hero, which is always in the DOM underneath.
 */
function probe(): Exclude<Verdict, "pending"> {
  // Respect the OS setting before touching the GPU.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";

  // Touch devices: thermals and fill rate make transmission a bad trade.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return "off";

  // Save-Data / metered connections opt out of a 600KB payload.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return "off";

  let canvas: HTMLCanvasElement | null = document.createElement("canvas");
  try {
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "off";

    // Software rasterisers (SwiftShader, llvmpipe) report as WebGL but crawl
    // under transmission. This is exactly the headless case that renders blank.
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg
      ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
      : "";
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return "off";

    // Transmission needs float render targets and enough texture units.
    const units = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) as number;
    const size = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    if (units < 12 || size < 4096) return "low";

    if ((navigator.hardwareConcurrency ?? 4) <= 4) return "low";
    if ((navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
        (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4) return "low";

    return "high";
  } catch {
    return "off";
  } finally {
    canvas = null;
  }
}

export default function HeroScene() {
  const reduced = usePrefersReducedMotion();
  const [verdict, setVerdict] = useState<Verdict>("pending");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Defer past first paint so the probe never delays LCP.
    const id = requestAnimationFrame(() => setVerdict(probe()));
    return () => cancelAnimationFrame(id);
  }, []);

  // A WebGL context can die at any time (tab backgrounded, GPU reset).
  useEffect(() => {
    const onLost = () => setFailed(true);
    window.addEventListener("webglcontextlost", onLost, true);
    return () => window.removeEventListener("webglcontextlost", onLost, true);
  }, []);

  if (reduced || failed || verdict === "pending" || verdict === "off") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      // Fade in once the first frame is up, so it never pops.
      style={{ animation: "sceneIn 1.2s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <Scene quality={verdict} />
    </div>
  );
}
