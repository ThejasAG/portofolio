import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.seo.siteUrl;
  const now = new Date();

  return [
    { url: base, lastModified: now, priority: 1 },
    ...projects
      .filter((p) => p.caseStudy && p.study)
      .map((p) => ({
        url: `${base}/work/${p.slug}`,
        lastModified: now,
        priority: 0.8,
      })),
  ];
}
