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
 * The AgriEco entry is verifiable from the authored backend commit and the
 * project's work-division document. The Vya role is left unfilled because
 * the employer, title and dates are not recorded anywhere in this repository.
 */
export const experience: Role[] = [
  {
    // The work below is factual. The employer name, job title and dates are
    // the only things still needed here.
    company: "Vya", // CONTENT_REQUIRED — confirm the employer name as it should appear
    role: "CONTENT_REQUIRED", // your actual job title
    period: "CONTENT_REQUIRED", // absolute dates, e.g. "Jan 2025 — Aug 2025"
    location: "CONTENT_REQUIRED",
    points: [
      "Tested the Vya Consumer and Business applications and compared their behaviour and outputs, treating agreement between the two as the correctness condition rather than checking either in isolation.",
      "Investigated invoice and VAT calculation consistency across different rates, and traced discrepancies to premature per-unit rounding — a case where a correct €8.42 total accompanied a VAT line one cent out.",
      "Validated application workflows and API responses on real devices, and evaluated parallel execution across multiple applications and devices along with its practical limits.",
      "Ran the cross-application comparisons as regression checks, since rounding behaviour is easily disturbed by pricing or tax-handling changes.",
    ],
    technologies: [
      "Invoice validation",
      "VAT validation",
      "Regression testing",
      "Real-device testing",
      "Parallel testing",
      "API validation",
    ],
  },
  {
    company: "AgriEco — final-year engineering project",
    role: "Backend engineer (academic project)",
    period: "2026",
    location: "Dr. Ambedkar Institute of Technology, Bengaluru",
    points: [
      "Built the FastAPI backend and relational schema for a farming advisory platform: farmers, farms, soil records and crop sessions, with seven domain route modules.",
      "Designed the service to run before the machine learning models it serves existed — lazy loaders and 503 responses naming the missing artefact, so frontend work never blocked on the ML timeline.",
      "Implemented token authentication and scoped every record lookup by the authenticated owner, so one account cannot read or write another's data.",
      "Wrote the smoke test suite covering auth, input validation, degraded model responses and cross-account access, runnable with no external services configured.",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "pytest",
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
