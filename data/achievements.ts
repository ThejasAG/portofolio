export type Achievement = {
  title: string;
  issuer: string;
  /** Absolute year or month-year. */
  date: string;
  /** Verification link, or null. Never invent one. */
  link: string | null;
};

/**
 * Empty by design: no verifiable certifications or awards were available,
 * and the Achievements section returns null when this array is empty, so
 * nothing is rendered. Add real, checkable entries here and the section
 * appears on its own. An absent section beats an invented one.
 */
export const achievements: Achievement[] = [];
