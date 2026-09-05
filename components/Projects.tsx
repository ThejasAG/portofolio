"use client";

import { featuredProjects } from "@/data/projects";
import SectionHeading from "./SectionHeading";
import { section } from "@/data/sections";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const S = section("work");
  return (
    <section id="work" className="scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading
          number={S.number}
          title={S.heading}
          aside={`${featuredProjects.length} projects`}
        />

        <div className="mt-20 flex flex-col gap-28 sm:gap-40">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
