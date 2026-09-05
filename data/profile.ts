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
    "I test consumer and business applications against",
    "each other, and build the backends underneath them.",
    "The work I care about is where correctness is checkable.",
  ],

  /** Availability line in the hero. Set to null to hide it entirely. */
  status: null as string | null, // e.g. "Open to backend / QA engineering roles"

  location: "Bengaluru, India",
  email: "support@xorstack.com",

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
      "Thejas AG — software quality and backend engineering. I validate real applications end to end, from invoice and VAT calculation consistency to API behaviour, and build the services underneath them.",
    twitter: null as string | null,
  },
} as const;

/** True when a value is still a placeholder, so the UI can flag it honestly. */
export const isPlaceholder = (v: string | null | undefined): boolean =>
  !v || v.includes("CONTENT_REQUIRED");
