"use client";

import Link from "next/link";
import { ArrowUpRight, GitBranch } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectVisual from "./ProjectVisual";
import SectionReveal from "./SectionReveal";
import MaskReveal from "./MaskReveal";

/** Aspect and column span per layout, so no two projects read the same. */
const LAYOUT = {
  wide: { col: "lg:col-span-12", ratio: "aspect-[16/10]", body: "lg:col-span-7" },
  split: { col: "lg:col-span-7", ratio: "aspect-[4/3]", body: "lg:col-span-5" },
  stack: {
    col: "lg:col-span-8 lg:col-start-5",
    ratio: "aspect-[3/2]",
    body: "lg:col-span-6",
  },
} as const;

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const L = LAYOUT[project.layout];
  const href = project.caseStudy ? `/work/${project.slug}` : null;

  const Title = (
    <h3 className="text-[clamp(2rem,5.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.04em]">
      <MaskReveal>{project.title}</MaskReveal>
    </h3>
  );

  return (
    <article className="group border-t border-[var(--color-line)] pt-6">
      <div className="flex items-baseline justify-between gap-6">
        <span className="text-meta transition-colors group-hover:text-[var(--color-fg)]">
          {project.number}
        </span>
        <span className="text-meta text-right">{project.category}</span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-x-10">
        <div className={`min-w-0 ${L.col}`}>
          {href ? (
            <Link
              href={href}
              data-cursor="VIEW"
              aria-label={`Open case study: ${project.title}`}
              className="block h-full w-full"
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
        </div>

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
                  <li key={t} className="text-sm text-[var(--color-muted)]">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>

          <SectionReveal delay={3} className="mt-10 flex flex-wrap items-center gap-6">
            {href && (
              <Link
                href={href}
                data-cursor="VIEW"
                className="group/link inline-flex min-h-11 items-center gap-2 text-sm font-medium"
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
                className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
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
                className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
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
