"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { imageReveal, imageSettle, viewport } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Project visual with a clip-path reveal and layered parallax.
 *
 * The observed node and the clipped node must be different. An element
 * whose clip-path hides it reports isIntersecting:false to its own
 * IntersectionObserver, so a reveal placed on the same node it clips can
 * never fire. Here the outer frame is observed and stays unclipped, and
 * the inner layer carries the clip-path and the parallax.
 *
 * With no image supplied, renders a typographic panel instead of a broken
 * <img> — the layout stays intact until real screenshots are added.
 */
export default function ProjectVisual({
  src,
  back,
  alt,
  label,
  priority = false,
  className = "",
}: {
  src: string | null;
  back?: string | null;
  alt: string;
  label: string;
  priority?: boolean;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const track = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start end", "end start"],
  });
  // Two speeds create depth without tipping into a "3D site".
  const yFront = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const yBack = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-sm bg-[var(--color-surface)] ${className}`}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={viewport}
    >
      <motion.div ref={track} className="absolute inset-0" variants={imageReveal}>
        {back && (
          <motion.div
            aria-hidden
            className="absolute inset-0 scale-105"
            style={reduced ? undefined : { y: yBack }}
          >
            <Image
              src={back}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover opacity-50"
            />
          </motion.div>
        )}

        {src ? (
          <motion.div
            className="absolute inset-0"
            variants={imageSettle}
            style={reduced ? undefined : { y: yFront }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 900px"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 grid place-items-center border border-dashed border-[var(--color-line)] p-6 text-center sm:p-8">
            <div>
              <p className="text-meta">Image not added</p>
              <p className="mt-3 text-lg font-medium tracking-tight text-[var(--color-faint)]">
                {label}
              </p>
              <p className="text-meta mt-3 break-all normal-case tracking-normal">
                public/images/projects/
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
