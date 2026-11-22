export const CONTENT_REQUIRED = "CONTENT_REQUIRED" as const;
import content from "./content.json";

export const profile = content as {
  name: string;
  initials: string;
  title: string;
  statement: string[];
  status: string | null;
  location: string;
  email: string;
  github: string | null;
  linkedin: string | null;
  resume: string | null;
  seo: {
    siteUrl: string;
    description: string;
    twitter: string | null;
  };
};

/** True when a value is still a placeholder, so the UI can flag it honestly. */
export const isPlaceholder = (v: string | null | undefined): boolean =>
  !v || v.includes("CONTENT_REQUIRED");
