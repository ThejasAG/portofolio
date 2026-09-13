"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, GitBranch } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectVisual from "./ProjectVisual";
import ProjectDiagram from "./ProjectDiagram";
import SectionReveal from "./SectionReveal";
import MaskReveal from "./MaskReveal";
import { usePrefersReducedMotion, useFinePointer } from "@/lib/useReducedMotion";

/** Aspect and column span per layout, so no two projects read the same. */
const LAYOUT = {
  wide:  { col: "lg:col-span-12", ratio: "aspect-[16/10]", body: "lg:col-span-7" },
  split: { col: "lg:col-span-7",  ratio: "aspect-[4/3]",   body: "lg:col-span-5" },
  stack: {
    col: "lg:col-span-8 lg:col-start-5",
    ratio: "aspect-[3/2]",
    body: "lg:col-span-6",
  },
} as const;

/** 3D-tilt card wrapper — only activates on fine-pointer (desktop) devices. */
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothX = useSpring(mouseX, { stiffness: 200, damping: 28, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 200, damping: 28, mass: 0.5 });

  const rotateX = useTransform(smoothY, [0, 1], [4, -4]);
  const rotateY = useTransform(smoothX, [0, 1], [-5, 5]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  };

  const handleLeave = () => {
    if (!enabled) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 900,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const L = LAYOUT[project.layout];
  const href = project.caseStudy ? `/work/${project.slug}` : null;
  const [hovered, setHovered] = useState(false);

  const Title = (
    <h3 className="text-[clamp(2rem,5.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.04em]">
      <MaskReveal>{project.title}</MaskReveal>
    </h3>
  );

  return (
    <article
      className="group border-t border-[var(--color-line)] pt-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-baseline justify-between gap-6">
        <motion.span
          animate={{ color: hovered ? "var(--color-accent)" : "var(--color-muted)" }}
          transition={{ duration: 0.3 }}
          className="text-meta"
        >
          {project.number}
        </motion.span>
        <span className="text-meta text-right">{project.category}</span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-x-10">
        {/* Visual area with 3D tilt */}
        <TiltCard className={`min-w-0 ${L.col}`}>
          {!project.image && project.diagram ? (
            <ProjectDiagram
              slug={project.diagram}
              title={project.title}
              className={`w-full ${L.ratio}`}
            />
          ) : href ? (
            <Link
              href={href}
              data-cursor="VIEW"
              aria-label={`Open case study: ${project.title}`}
              className="touch-press block h-full w-full"
            >
              <ProjectVisual
                src={project.image}
                back={project.imageBack}
                alt={project.imageAlt}
                label={project.title}
                priority={index === 0}
                className={`w-full ${L.ratio}`}
              />
            </Link>
          ) : (
            <ProjectVisual
              src={project.image}
              back={project.imageBack}
              alt={project.imageAlt}
              label={project.title}
              priority={index === 0}
              className={`w-full ${L.ratio}`}
            />
          )}
        </TiltCard>

        {/* Body */}
        <div className={`min-w-0 ${L.body} flex flex-col justify-center`}>
          {href ? (
            <Link href={href} data-cursor="VIEW" className="inline-block">
              {Title}
            </Link>
          ) : (
            Title
          )}

          <SectionReveal delay={1} className="mt-6">
            <p className="max-w-xl text-base leading-relaxed text-[var(--color-muted)]">
              {project.longDescription}
            </p>
          </SectionReveal>

          <SectionReveal delay={2} className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-meta">Role</p>
              <p className="mt-2 text-sm leading-relaxed">{project.role}</p>
            </div>
            <div>
              <p className="text-meta">Stack</p>
              <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {project.technologies.map((t) => (
                  <motion.li
                    key={t}
                    className="text-sm text-[var(--color-muted)]"
                    whileHover={{ color: "var(--color-fg)", x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t}
                  </motion.li>
                ))}
              </ul>
            </div>
          </SectionReveal>

          <SectionReveal delay={3} className="mt-10 flex flex-wrap items-center gap-6">
            {href && (
              <Link
                href={href}
                data-cursor="VIEW"
                className="touch-press group/link inline-flex min-h-11 items-center gap-2 text-sm font-medium"
              >
                <span className="link-underline">Explore project</span>
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.75}
                  className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                />
              </Link>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="↗"
                className="touch-press inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
              >
                <GitBranch size={15} strokeWidth={1.5} />
                <span className="link-underline">Source</span>
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                data-cursor="↗"
                className="touch-press inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
              >
                <span className="link-underline">Live</span>
                <ArrowUpRight size={15} strokeWidth={1.75} />
              </a>
            )}
          </SectionReveal>
        </div>
      </div>
    </article>
  );
}
