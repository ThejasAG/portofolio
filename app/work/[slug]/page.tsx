import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, GitBranch } from "lucide-react";
import { projects } from "@/data/projects";
import ProjectVisual from "@/components/ProjectVisual";
import SectionReveal from "@/components/SectionReveal";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

type Params = { params: Promise<{ slug: string }> };

/** Only projects with caseStudy + study content get a route. */
export function generateStaticParams() {
  return projects
    .filter((p) => p.caseStudy && p.study)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      ...(project.image ? { images: [project.image] } : {}),
    },
  };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <SectionReveal className="grid gap-4 border-t border-[var(--color-line)] py-10 lg:grid-cols-12 lg:gap-10">
      <h2 className="text-meta lg:col-span-3">{label}</h2>
      <div className="lg:col-span-8">{children}</div>
    </SectionReveal>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 text-base leading-relaxed text-[var(--color-muted)]">
          <span aria-hidden className="text-[var(--color-faint)]">
            —
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project?.study) notFound();

  const s = project.study;

  return (
    <PageTransition>
      <Cursor />
      <Navbar />
      <main id="main" className="px-6 pb-24 pt-28 sm:px-10 sm:pt-32">
        <div className="mx-auto max-w-[1600px]">
          <Link
            href="/#work"
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span className="link-underline">All work</span>
          </Link>

          <header className="mt-14 border-t border-[var(--color-line)] pt-6">
            <div className="flex items-baseline justify-between gap-6">
              <span className="text-meta">{project.number}</span>
              <span className="text-meta text-right">{project.category}</span>
            </div>
            <h1 className="text-display mt-10">{project.title}</h1>
            <p className="mt-8 max-w-2xl text-[clamp(1.1rem,2vw,1.5rem)] leading-[1.4] tracking-[-0.02em] text-[var(--color-muted)]">
              {project.description}
            </p>
          </header>

          <div className="mt-14 aspect-[16/9] w-full">
            <ProjectVisual
              src={project.image}
              back={project.imageBack}
              alt={project.imageAlt}
              label={project.title}
              priority
              className="h-full w-full"
            />
          </div>

          <div className="mt-20">
            <Block label="Overview">
              <p className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-medium leading-[1.4] tracking-[-0.02em]">
                {s.overview}
              </p>
            </Block>
            <Block label="The problem">
              <p className="text-base leading-relaxed text-[var(--color-muted)]">{s.problem}</p>
            </Block>
            <Block label="Context">
              <p className="text-base leading-relaxed text-[var(--color-muted)]">{s.context}</p>
            </Block>
            <Block label="My role">
              <p className="text-base leading-relaxed text-[var(--color-muted)]">{s.role}</p>
            </Block>
            <Block label="Approach">
              <Bullets items={s.approach} />
            </Block>
            <Block label="Implementation">
              <Bullets items={s.implementation} />
            </Block>
            <Block label="Challenges">
              <Bullets items={s.challenges} />
            </Block>
            <Block label="Testing & validation">
              <Bullets items={s.validation} />
            </Block>
            <Block label="Result">
              <p className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-medium leading-[1.4] tracking-[-0.02em]">
                {s.result}
              </p>
            </Block>
            <Block label="Lessons">
              <Bullets items={s.lessons} />
            </Block>
            <Block label="Technologies">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {project.technologies.map((t) => (
                  <li key={t} className="text-lg font-medium tracking-[-0.02em]">
                    {t}
                  </li>
                ))}
              </ul>
            </Block>

            {(project.github || project.live) && (
              <Block label="Links">
                <ul className="flex flex-wrap gap-8">
                  {project.github && (
                    <li>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="↗"
                        className="inline-flex min-h-11 items-center gap-2"
                      >
                        <GitBranch size={16} strokeWidth={1.5} />
                        <span className="link-underline">Source</span>
                      </a>
                    </li>
                  )}
                  {project.live && (
                    <li>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="↗"
                        className="inline-flex min-h-11 items-center gap-2"
                      >
                        <span className="link-underline">Live</span>
                        <ArrowUpRight size={16} strokeWidth={1.75} />
                      </a>
                    </li>
                  )}
                </ul>
              </Block>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
