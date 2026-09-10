export type Role = {
  company: string;
  role: string;
  /** e.g. "2024 — Present". Absolute dates only, no relative wording. */
  period: string;
  location: string;
  /** 2–4 bullets. Ownership and technical contribution, no invented metrics. */
  points: string[];
  technologies: string[];
};

/**
 * Xorstack is the employer. Vya is a product worked on during that
 * internship, not a company — it lives in data/projects.ts as a case study.
 *
 * The work below is factual; the title, dates and location are the only
 * fields still needed. Commit activity under the work email runs from
 * 2026-07 to 2026-09, but commit dates are not employment dates, so the
 * period is left for you to supply rather than inferred.
 */
export const experience: Role[] = [
  {
    company: "Xorstack",
    role: "CONTENT_REQUIRED", // your actual internship title
    period: "CONTENT_REQUIRED", // absolute dates, e.g. "Jun 2026 — Present"
    location: "CONTENT_REQUIRED",
    points: [
      "Tested the Vya Consumer and Business applications and compared their behaviour and outputs, treating agreement between the two as the correctness condition rather than checking either in isolation.",
      "Investigated invoice and VAT calculation consistency across different rates, and traced discrepancies to premature per-unit rounding — a case where a correct €8.42 total accompanied a VAT line one cent out.",
      "Built and maintained a mobile test orchestration platform — FastAPI backend, React dashboard and Appium execution agents — and led the reliability work that stopped runs reporting results which did not match device behaviour.",
      "Validated application workflows and API responses on real devices, and evaluated parallel execution across multiple applications and devices along with its practical limits.",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "Appium",
      "PostgreSQL",
      "Alembic",
      "React",
      "Invoice & VAT validation",
      "Real-device testing",
      "Git",
    ],
  },
];

export const education: Role[] = [
  {
    company: "Dr. Ambedkar Institute of Technology, Bengaluru",
    role: "B.E. — Artificial Intelligence & Machine Learning",
    period: "CONTENT_REQUIRED", // e.g. "2022 — 2026"
    location: "Bengaluru, India",
    points: [],
    technologies: [],
  },
];
