/**
 * Remaining CONTENT_REQUIRED markers denote facts that must come from you.
 * Everything else is grounded in verifiable evidence (authored commits in
 * the AgriEco backend, and the project's own work-division document).
 */

export const CONTENT_REQUIRED = "CONTENT_REQUIRED" as const;

export const profile = {
  name: "Thejas AG",
  initials: "TA",
  title: "Software Quality / Backend Engineering",

  /** Hero positioning statement. Split across lines for the staggered reveal. */
  statement: [
    "I build applications, automation systems and backend services,",
    "and I enjoy understanding what happens when real software",
    "meets real users.",
  ],

  /** Availability line in the hero. Set to null to hide it entirely. */
  status: "Software engineering student — currently interning at Xorstack",

  location: "Bengaluru, India",
  email: "thejasag5518@gmail.com",

  /** Real URLs only. Leave null and the link is not rendered. */
  github: "https://github.com/ThejasAG" as string | null,
  linkedin: "https://www.linkedin.com/in/thejas-ag-26385b321/" as string | null,

  /**
   * Set to "/resume.pdf" only after placing the real file at public/resume.pdf.
   * While null, the resume buttons render disabled with a visible note.
   */
  resume: null as string | null,

  seo: {
    /** Absolute origin, no trailing slash. Used for canonical/OG/sitemap. */
    siteUrl: "https://example.com", // CONTENT_REQUIRED — your real domain
    description:
      "Thejas AG — software engineering student working on backend services, mobile test automation and AI projects, with hands-on experience testing real applications.",
    twitter: null as string | null,
  },
} as const;

/** True when a value is still a placeholder, so the UI can flag it honestly. */
export const isPlaceholder = (v: string | null | undefined): boolean =>
  !v || v.includes("CONTENT_REQUIRED");
